from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import vanna
from vanna.openai import OpenAI_Chat
from vanna.chromadb import ChromaDB_VectorStore
import psycopg

load_dotenv()

app = FastAPI(title="Vanna AI Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vanna AI Configuration
class MyVanna(ChromaDB_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        ChromaDB_VectorStore.__init__(self, config=config)
        # Set OPENAI_API_KEY from GROQ_API_KEY for OpenAI_Chat compatibility
        if config and 'api_key' in config:
            os.environ['OPENAI_API_KEY'] = config['api_key']
        OpenAI_Chat.__init__(self, config=config)

# Initialize Vanna
vn = MyVanna(config={
    'api_key': os.getenv('GROQ_API_KEY'),
    'model': 'llama3-70b-8192',  # Groq model
    'base_url': 'https://api.groq.com/openai/v1'
})

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')

# Connect to database
vn.connect_to_postgres(
    host=os.getenv('DB_HOST', 'localhost'),
    dbname=os.getenv('DB_NAME', 'flowbit_analytics'),
    user=os.getenv('DB_USER', 'user'),
    password=os.getenv('DB_PASSWORD', 'password'),
    port=int(os.getenv('DB_PORT', 5432))
)

# Train Vanna with DDL and documentation
ddl_statements = [
    """
    CREATE TABLE Document (
        id UUID PRIMARY KEY,
        name VARCHAR(255),
        status VARCHAR(50),
        created_at TIMESTAMP,
        organization_id VARCHAR(255)
    );
    """,
    """
    CREATE TABLE Vendor (
        id UUID PRIMARY KEY,
        name VARCHAR(255),
        tax_id VARCHAR(50),
        address TEXT
    );
    """,
    """
    CREATE TABLE Customer (
        id UUID PRIMARY KEY,
        name VARCHAR(255),
        address TEXT
    );
    """,
    """
    CREATE TABLE Invoice (
        id UUID PRIMARY KEY,
        document_id UUID REFERENCES Document(id),
        vendor_id UUID REFERENCES Vendor(id),
        customer_id UUID REFERENCES Customer(id),
        invoice_number VARCHAR(100),
        invoice_date TIMESTAMP,
        due_date TIMESTAMP,
        sub_total DECIMAL,
        total_tax DECIMAL,
        invoice_total DECIMAL,
        status VARCHAR(50)
    );
    """,
    """
    CREATE TABLE LineItem (
        id UUID PRIMARY KEY,
        invoice_id UUID REFERENCES Invoice(id),
        description TEXT,
        quantity DECIMAL,
        unit_price DECIMAL,
        total_price DECIMAL,
        category VARCHAR(100)
    );
    """,
    """
    CREATE TABLE Payment (
        id UUID PRIMARY KEY,
        invoice_id UUID REFERENCES Invoice(id),
        bank_account_number VARCHAR(100),
        net_days INTEGER,
        payment_terms TEXT
    );
    """
]

# Documentation for the AI
documentation = [
    "The Invoice table contains all invoice records with amounts in EUR currency",
    "invoice_total represents the final amount including tax",
    "sub_total is the amount before tax",
    "Negative values in invoice_total indicate credits or refunds",
    "Use ABS() function to get absolute values when calculating spend",
    "The status field can be 'processed', 'pending', or 'rejected'",
    "invoice_date is when the invoice was issued",
    "due_date is when payment is expected",
    "Vendors are companies that provide goods or services",
    "LineItem contains individual products/services on an invoice",
    "category in LineItem groups items (Services, Materials, General, etc.)",
    "Join Invoice with Vendor using vendor_id",
    "Join Invoice with Customer using customer_id",
    "Join Invoice with LineItem using invoice_id"
]

# Train on initialization
@app.on_event("startup")
async def startup_event():
    try:
        # Add DDL
        for ddl in ddl_statements:
            vn.train(ddl=ddl)
        
        # Add documentation
        for doc in documentation:
            vn.train(documentation=doc)
        
        # Add sample questions
        sample_questions = [
            {
                "question": "What is the total spend?",
                "sql": "SELECT ABS(SUM(invoice_total)) as total_spend FROM Invoice;"
            },
            {
                "question": "Show top 5 vendors by spend",
                "sql": """SELECT v.name, ABS(SUM(i.invoice_total)) as total_spend 
                         FROM Vendor v 
                         JOIN Invoice i ON v.id = i.vendor_id 
                         GROUP BY v.name 
                         ORDER BY total_spend DESC 
                         LIMIT 5;"""
            },
            {
                "question": "What's the spend by category?",
                "sql": """SELECT li.category, ABS(SUM(li.total_price)) as total 
                         FROM LineItem li 
                         GROUP BY li.category 
                         ORDER BY total DESC;"""
            }
        ]
        
        for q in sample_questions:
            vn.train(question=q["question"], sql=q["sql"])
        
        print("✅ Vanna AI trained successfully")
    except Exception as e:
        print(f"⚠️  Training warning: {e}")

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    sql: str
    data: list
    error: str = None

@app.get("/")
def read_root():
    return {"status": "Vanna AI Service is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        query_lower = request.query.lower()
        sql = ""
        
        # Simple pattern matching for common queries
        if "total" in query_lower and "vendor" in query_lower:
            sql = """
            SELECT v.name as vendor, COUNT(i.id) as total_invoices, 
                   SUM(i."invoiceTotal") as total_amount
            FROM "Invoice" i
            JOIN "Vendor" v ON i."vendorId" = v.id
            GROUP BY v.name
            ORDER BY total_amount DESC
            """
        elif "top" in query_lower and ("vendor" in query_lower or "supplier" in query_lower):
            sql = """
            SELECT v.name as vendor, SUM(i."invoiceTotal") as total_spend
            FROM "Invoice" i
            JOIN "Vendor" v ON i."vendorId" = v.id
            GROUP BY v.name
            ORDER BY total_spend DESC
            LIMIT 10
            """
        elif "expensive" in query_lower or "highest" in query_lower:
            sql = """
            SELECT i."invoiceNumber", v.name as vendor, 
                   i."invoiceTotal", i."invoiceDate"
            FROM "Invoice" i
            JOIN "Vendor" v ON i."vendorId" = v.id
            ORDER BY i."invoiceTotal" DESC
            LIMIT 10
            """
        elif "category" in query_lower or "categories" in query_lower:
            sql = """
            SELECT li.category, COUNT(*) as count, 
                   SUM(li."totalPrice") as total_amount
            FROM "LineItem" li
            GROUP BY li.category
            ORDER BY total_amount DESC
            """
        elif "month" in query_lower or "monthly" in query_lower:
            sql = """
            SELECT DATE_TRUNC('month', i."invoiceDate") as month,
                   COUNT(*) as invoice_count,
                   SUM(i."invoiceTotal") as total_amount
            FROM "Invoice" i
            GROUP BY month
            ORDER BY month DESC
            """
        else:
            # Default: show all invoices
            sql = """
            SELECT i."invoiceNumber", v.name as vendor,
                   i."invoiceTotal", i."invoiceDate", i.status
            FROM "Invoice" i
            JOIN "Vendor" v ON i."vendorId" = v.id
            ORDER BY i."invoiceDate" DESC
            LIMIT 20
            """
        
        if not sql:
            raise HTTPException(status_code=400, detail="Could not generate SQL from query")
        
        # Execute the SQL
        result = vn.run_sql(sql)
        
        # Convert result to list of dicts
        if result is not None:
            data = result.to_dict('records') if hasattr(result, 'to_dict') else []
        else:
            data = []
        
        return QueryResponse(
            sql=sql.strip(),
            data=data
        )
    
    except Exception as e:
        return QueryResponse(
            sql="",
            data=[],
            error=str(e)
        )

@app.post("/train")
async def train_vanna(ddl: str = None, question: str = None, sql: str = None, documentation: str = None):
    try:
        if ddl:
            vn.train(ddl=ddl)
        if question and sql:
            vn.train(question=question, sql=sql)
        if documentation:
            vn.train(documentation=documentation)
        
        return {"status": "Training successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
