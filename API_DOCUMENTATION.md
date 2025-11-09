# 📡 API Documentation

Complete API reference for the Flowbit AI Analytics Dashboard backend services.

---

## Base URLs

- **Backend API**: `http://localhost:3001/api`
- **Vanna AI Service**: `http://localhost:8000`

---

## Backend API Endpoints

### 1. Get Dashboard Statistics

Retrieve overall statistics for the dashboard overview cards.

**Endpoint:**
```
GET /api/stats
```

**Description:**  
Returns aggregated statistics including total spend, invoice count, document count, and average invoice value.

**Request:**
```bash
curl http://localhost:3001/api/stats
```

**Response:**
```json
{
  "totalSpend": 5046.42,
  "invoiceCount": 50,
  "documentCount": 50,
  "averageInvoice": 602.59
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `totalSpend` | number | Sum of all invoice totals (absolute value) |
| `invoiceCount` | number | Total number of invoices in database |
| `documentCount` | number | Total number of documents processed |
| `averageInvoice` | number | Average invoice amount (totalSpend / invoiceCount) |

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 2. Get Invoice Trends

Retrieve monthly invoice trends for time-series visualization.

**Endpoint:**
```
GET /api/trends
```

**Description:**  
Returns monthly aggregated data showing total spending per month.

**Request:**
```bash
curl http://localhost:3001/api/trends
```

**Response:**
```json
[
  {
    "month": "2024-01",
    "total": 1250.50
  },
  {
    "month": "2024-02",
    "total": 1580.30
  },
  {
    "month": "2024-03",
    "total": 2215.62
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `month` | string | Month in YYYY-MM format |
| `total` | number | Total spending for that month (absolute value) |

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

**Notes:**
- Data is ordered chronologically
- Only months with invoices are included
- Amounts are aggregated from `Invoice.invoiceTotal`

---

### 3. Get Top Vendors

Retrieve top vendors ranked by total spending.

**Endpoint:**
```
GET /api/vendors
```

**Description:**  
Returns vendors sorted by total invoice amounts, with count of invoices per vendor.

**Request:**
```bash
curl http://localhost:3001/api/vendors
```

**Response:**
```json
[
  {
    "name": "ABC Company GmbH",
    "total": 1500.00,
    "count": 8
  },
  {
    "name": "XYZ Supplies Ltd",
    "total": 1200.50,
    "count": 6
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Vendor company name |
| `total` | number | Total amount spent with this vendor |
| `count` | number | Number of invoices from this vendor |

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

**Notes:**
- Limited to top 10 vendors by default
- Sorted by `total` descending
- Includes only vendors with at least one invoice

---

### 4. Get Category Breakdown

Retrieve spending breakdown by category.

**Endpoint:**
```
GET /api/categories
```

**Description:**  
Returns aggregated spending grouped by category from line items.

**Request:**
```bash
curl http://localhost:3001/api/categories
```

**Response:**
```json
[
  {
    "category": "Office Supplies",
    "total": 850.50
  },
  {
    "category": "Materials",
    "total": 720.30
  },
  {
    "category": "Services",
    "total": 650.00
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `category` | string | Category name (derived from sachkonto) |
| `total` | number | Total spending in this category |

**Category Mapping:**
- **4400** → Services
- **4300** → Materials
- **4500** → Shipping
- **4600** → Utilities
- **4700** → Office Supplies
- **Other** → General

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 5. Get All Invoices

Retrieve list of all invoices with vendor details.

**Endpoint:**
```
GET /api/invoices
```

**Description:**  
Returns complete list of invoices with related vendor information.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Max number of results | 100 |
| `offset` | number | Number to skip (pagination) | 0 |
| `status` | string | Filter by status (PAID, PENDING, etc.) | all |

**Request:**
```bash
# Get first 10 invoices
curl "http://localhost:3001/api/invoices?limit=10&offset=0"

# Filter by status
curl "http://localhost:3001/api/invoices?status=PAID"
```

**Response:**
```json
[
  {
    "id": "uuid-1234",
    "invoiceNumber": "INV-2024-001",
    "invoiceTotal": 250.50,
    "invoiceDate": "2024-01-15T00:00:00.000Z",
    "status": "PAID",
    "vendor": {
      "id": "vendor-uuid",
      "name": "ABC Company GmbH",
      "taxId": "DE123456789"
    },
    "customer": {
      "id": "customer-uuid",
      "name": "My Business Inc"
    }
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique invoice identifier |
| `invoiceNumber` | string | Human-readable invoice number |
| `invoiceTotal` | number | Total invoice amount |
| `invoiceDate` | string (ISO) | Invoice date |
| `status` | string | Invoice status (enum) |
| `vendor` | object | Vendor information |
| `customer` | object | Customer information |

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Database error

---

## Vanna AI Service Endpoints

### 1. Query with Natural Language

Convert natural language questions to SQL and execute them.

**Endpoint:**
```
POST /query
```

**Description:**  
Accepts natural language questions, generates SQL, executes query, and returns results.

**Request:**
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me total invoices by vendor"}'
```

**Request Body:**
```json
{
  "question": "Show me total invoices by vendor"
}
```

**Response:**
```json
{
  "sql": "SELECT v.name, SUM(i.\"invoiceTotal\") as total, COUNT(*) as count FROM \"Invoice\" i JOIN \"Vendor\" v ON i.\"vendorId\" = v.id GROUP BY v.name ORDER BY total DESC",
  "results": [
    ["ABC Company", 1500.00, 8],
    ["XYZ Supplies", 1200.50, 6]
  ],
  "columns": ["name", "total", "count"]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `sql` | string | Generated SQL query |
| `results` | array | Query results as 2D array |
| `columns` | array | Column names |

**Supported Query Patterns:**
- "Show me total invoices by vendor"
- "What are the top 5 vendors?"
- "Show me the most expensive invoices"
- "Show spending by category"
- "How many invoices per month?"

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid question format
- `500 Internal Server Error` - SQL generation or execution error

**Error Response:**
```json
{
  "error": "Failed to generate SQL",
  "details": "Invalid table name"
}
```

---

### 2. Health Check

Check if Vanna AI service is running.

**Endpoint:**
```
GET /health
```

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "vanna-ai",
  "database": "connected"
}
```

**Status Codes:**
- `200 OK` - Service healthy
- `503 Service Unavailable` - Service issues

---

## Authentication

Currently, the API does not require authentication for local development.

**For Production:**
- Implement JWT authentication
- Add API key validation
- Use environment-based secrets

---

## Rate Limiting

**Local Development:**
- No rate limits

**Production Recommendations:**
- 100 requests/minute per IP
- 1000 requests/hour per user
- Use Redis for distributed rate limiting

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/invoices"
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check request parameters |
| 404 | Not Found | Verify endpoint URL |
| 500 | Internal Server Error | Check server logs |
| 503 | Service Unavailable | Service may be starting |

---

## Database Schema Reference

### Invoice Table

```sql
CREATE TABLE "Invoice" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "documentId" UUID NOT NULL,
  "invoiceNumber" TEXT NOT NULL UNIQUE,
  "invoiceTotal" DECIMAL(10,2) NOT NULL,
  "invoiceDate" TIMESTAMP NOT NULL,
  "vendorId" UUID NOT NULL,
  "customerId" UUID,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("documentId") REFERENCES "Document"(id),
  FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id),
  FOREIGN KEY ("customerId") REFERENCES "Customer"(id)
);
```

### Vendor Table

```sql
CREATE TABLE "Vendor" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "taxId" TEXT,
  address TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "Vendor_name_taxId_key" UNIQUE (name, "taxId")
);
```

---

## Sample API Workflow

### Complete Dashboard Data Fetch

```javascript
// Fetch all dashboard data
async function loadDashboard() {
  try {
    // 1. Get statistics
    const stats = await fetch('http://localhost:3001/api/stats')
      .then(res => res.json());
    
    // 2. Get trends
    const trends = await fetch('http://localhost:3001/api/trends')
      .then(res => res.json());
    
    // 3. Get top vendors
    const vendors = await fetch('http://localhost:3001/api/vendors')
      .then(res => res.json());
    
    // 4. Get categories
    const categories = await fetch('http://localhost:3001/api/categories')
      .then(res => res.json());
    
    // 5. Get recent invoices
    const invoices = await fetch('http://localhost:3001/api/invoices?limit=10')
      .then(res => res.json());
    
    return { stats, trends, vendors, categories, invoices };
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}
```

### Chat Query Workflow

```javascript
// Send natural language query
async function askQuestion(question) {
  try {
    const response = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    const data = await response.json();
    
    console.log('Generated SQL:', data.sql);
    console.log('Results:', data.results);
    
    return data;
  } catch (error) {
    console.error('Query failed:', error);
  }
}

// Example usage
askQuestion('Show me top 5 vendors by spend');
```

---

## Testing with cURL

### Get Statistics
```bash
curl http://localhost:3001/api/stats
```

### Get Trends
```bash
curl http://localhost:3001/api/trends
```

### Get Vendors
```bash
curl http://localhost:3001/api/vendors
```

### Query with AI
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are my top 3 vendors?"
  }'
```

---

## Performance Considerations

### Backend API
- Uses connection pooling (Prisma)
- Indexes on frequently queried columns
- Response time: < 100ms average

### Vanna AI
- First query may be slower (model loading)
- Subsequent queries: < 2s average
- Uses ChromaDB for vector search caching

### Optimization Tips
- Use pagination for large datasets
- Cache frequently accessed data
- Implement Redis for session storage

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial API release |
| 1.1.0 | 2024-02 | Added Vanna AI integration |

---

**For Support:** Create an issue in the repository or contact the development team.
