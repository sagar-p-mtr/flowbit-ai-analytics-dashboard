# System Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                     (http://localhost:3000)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│                  (React + TypeScript)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Charts     │  │  Chat UI     │     │
│  │   Cards      │  │ (Chart.js)   │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ (axios)
┌────────────────────────────▼────────────────────────────────┐
│                   EXPRESS BACKEND API                        │
│                  (Node.js + TypeScript)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes:                                         │   │
│  │  • GET  /api/stats                                   │   │
│  │  • GET  /api/invoice-trends                          │   │
│  │  • GET  /api/vendors/top10                           │   │
│  │  • GET  /api/category-spend                          │   │
│  │  • GET  /api/cash-outflow                            │   │
│  │  • GET  /api/invoices                                │   │
│  │  • POST /api/chat-with-data                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────┬──────────────────────────────────┬────────────────┘
          │                                  │
          │ Prisma ORM                       │ HTTP POST
          │                                  │
          │                                  │
┌─────────▼──────────────┐         ┌────────▼────────────────┐
│   POSTGRESQL DATABASE  │         │   VANNA AI SERVICE      │
│                        │         │   (Python + FastAPI)    │
│  Tables:               │         │                         │
│  • Document            │         │  ┌──────────────────┐   │
│  • Invoice             │◄────────┤  │  Vanna AI Core   │   │
│  • Vendor              │ Queries │  │  • SQL Generator │   │
│  • Customer            │         │  │  • ChromaDB      │   │
│  • LineItem            │         │  └────────┬─────────┘   │
│  • Payment             │         │           │             │
└────────────────────────┘         │           │ API Call    │
                                   │           │             │
                                   │  ┌────────▼─────────┐   │
                                   │  │   GROQ LLM       │   │
                                   │  │  (llama3-70b)    │   │
                                   │  └──────────────────┘   │
                                   └─────────────────────────┘
```

## Data Flow Diagrams

### 1. Dashboard Load Flow

```
User opens http://localhost:3000
        ↓
Frontend renders React components
        ↓
useEffect hook triggers on mount
        ↓
Parallel API calls made:
  ├─→ GET /api/stats
  ├─→ GET /api/invoice-trends
  ├─→ GET /api/vendors/top10
  ├─→ GET /api/category-spend
  └─→ GET /api/invoices?limit=50
        ↓
Backend receives requests
        ↓
Prisma queries PostgreSQL
  ├─→ Aggregate total spend
  ├─→ Count invoices
  ├─→ Group by month
  ├─→ Join vendors with invoices
  └─→ Sum by category
        ↓
PostgreSQL returns data
        ↓
Backend formats & sends JSON
        ↓
Frontend receives data
        ↓
React state updates
        ↓
Charts render with data
        ↓
User sees dashboard! ✅
```

### 2. Chat Query Flow

```
User types: "What's the total spend?"
        ↓
Click Send button
        ↓
Frontend: POST /api/chat-with-data
  Body: { query: "What's the total spend?" }
        ↓
Backend receives request
        ↓
Backend forwards to Vanna AI
  POST http://localhost:8000/query
        ↓
Vanna AI Service receives query
        ↓
Vanna preprocesses query
        ↓
Calls Groq LLM API
  Prompt: "Convert to SQL: What's the total spend?"
  + Database schema context
        ↓
Groq LLM (llama3-70b) generates SQL
  Returns: "SELECT ABS(SUM(invoice_total)) as total_spend FROM Invoice;"
        ↓
Vanna receives SQL
        ↓
Vanna executes SQL on PostgreSQL
        ↓
PostgreSQL returns results
  [{ "total_spend": 125000.50 }]
        ↓
Vanna formats response
        ↓
Backend receives from Vanna
        ↓
Backend sends to Frontend
  {
    "sql": "SELECT...",
    "data": [...]
  }
        ↓
Frontend displays:
  • Generated SQL (in code block)
  • Results (formatted table)
        ↓
User sees answer! ✅
```

### 3. Data Ingestion Flow (Seed)

```
npm run db:seed
        ↓
Read Analytics_Test_Data.json
        ↓
Parse JSON (450 documents)
        ↓
For each document:
  ├─→ Extract vendor info
  │   └─→ Upsert Vendor (check if exists)
  │
  ├─→ Extract customer info
  │   └─→ Upsert Customer
  │
  ├─→ Create Document record
  │
  ├─→ Create Invoice record
  │   ├─→ Link to Vendor
  │   ├─→ Link to Customer
  │   └─→ Link to Document
  │
  ├─→ Create Payment record
  │   └─→ Link to Invoice
  │
  └─→ Create LineItem records
      ├─→ Map Sachkonto to Category
      └─→ Link to Invoice
        ↓
Commit to PostgreSQL
        ↓
Print statistics
        ↓
Database ready! ✅
```

## Database Relationships

```
┌─────────────┐
│  Document   │
│ (450 rows)  │
└──────┬──────┘
       │ 1:1
       │
┌──────▼──────┐           ┌──────────┐
│   Invoice   │───N:1────→│  Vendor  │
│ (450 rows)  │           │ (~200)   │
└──────┬──────┘           └──────────┘
       │                   
       │ N:1              ┌──────────┐
       ├─────────────────→│ Customer │
       │                  │ (~200)   │
       │                  └──────────┘
       │
       │ 1:1              ┌──────────┐
       ├─────────────────→│ Payment  │
       │                  │ (450)    │
       │                  └──────────┘
       │
       │ 1:N              ┌──────────┐
       └─────────────────→│ LineItem │
                          │ (~900)   │
                          └──────────┘
```

## Technology Stack Layers

```
┌───────────────────────────────────────────────┐
│               DEPLOYMENT                       │
│  Vercel (Frontend + API) | Render (Vanna)     │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│            FRONTEND LAYER                      │
│  Next.js 14 | React 18 | TypeScript            │
│  Tailwind CSS | shadcn/ui | Chart.js           │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│             API LAYER                          │
│  Express.js | TypeScript | CORS                │
│  REST Endpoints | JSON Responses               │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│          DATABASE LAYER                        │
│  Prisma ORM | PostgreSQL 15                    │
│  Normalized Schema | Indexed Queries           │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│            AI LAYER                            │
│  Vanna AI | FastAPI | Python                   │
│  Groq LLM | ChromaDB | psycopg                 │
└───────────────────────────────────────────────┘
```

## Request/Response Examples

### Dashboard Stats Request

```http
GET http://localhost:3001/api/stats
```

**Response:**
```json
{
  "totalSpend": 125000.50,
  "totalInvoices": 450,
  "documentsUploaded": 450,
  "averageInvoiceValue": 277.78
}
```

**Time:** ~50ms

---

### Chat Query Request

```http
POST http://localhost:3001/api/chat-with-data
Content-Type: application/json

{
  "query": "Show top 5 vendors by spend"
}
```

**Response:**
```json
{
  "sql": "SELECT v.name, ABS(SUM(i.invoice_total)) as total_spend FROM \"Vendor\" v JOIN \"Invoice\" i ON v.id = i.vendor_id GROUP BY v.name ORDER BY total_spend DESC LIMIT 5;",
  "data": [
    { "name": "Musterfirma Müller", "total_spend": 25000.00 },
    { "name": "ABC GmbH", "total_spend": 18500.75 },
    { "name": "Tech Solutions AG", "total_spend": 15200.50 },
    { "name": "Office Supplies Co", "total_spend": 12300.25 },
    { "name": "Logistics GmbH", "total_spend": 9800.00 }
  ]
}
```

**Time:** ~2-3 seconds (includes LLM inference)

## Performance Metrics

### Database Queries
- Stats query: ~50ms
- Invoice list (100): ~80ms
- Trends aggregation: ~120ms
- Top vendors: ~100ms

### API Endpoints
- Average response: 50-150ms
- Chat endpoint: 2-3s (LLM dependent)

### Frontend
- Initial load: ~1s
- Chart render: ~200ms
- Table render (50 rows): ~100ms

## Security Flow

```
User Request
    ↓
Frontend (Origin check)
    ↓
CORS Middleware (Allowed origins)
    ↓
Backend API (Request validation)
    ↓
Prisma (SQL injection prevention)
    ↓
PostgreSQL (Authenticated connection)
```

## Error Handling Flow

```
Error occurs in:
  ├─→ Database
  │   └─→ Catch in Prisma
  │       └─→ Return 500 with message
  │
  ├─→ Vanna AI
  │   └─→ Catch in FastAPI
  │       └─→ Return error in JSON
  │
  └─→ Frontend
      └─→ Catch in try/catch
          └─→ Display error to user
```

## Monitoring Points

1. **Frontend**: Browser console + React DevTools
2. **Backend**: Terminal logs + Response times
3. **Database**: Query logs + Connection pool
4. **Vanna AI**: FastAPI logs + Groq API status
5. **Deployment**: Vercel Analytics + Render logs

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Type safety
- ✅ Error resilience
- ✅ Fast performance
- ✅ Easy debugging
