# API Documentation

Base URL: `http://localhost:3001/api` (Development)

## Endpoints

### 1. GET /stats

Get overview statistics for the dashboard.

**Response:**
```json
{
  "totalSpend": 125000.50,
  "totalInvoices": 450,
  "documentsUploaded": 450,
  "averageInvoiceValue": 277.78
}
```

**Example:**
```bash
curl http://localhost:3001/api/stats
```

---

### 2. GET /invoice-trends

Get monthly invoice count and spend trends.

**Response:**
```json
[
  {
    "month": "2025-01",
    "count": 45,
    "total": 12500.00
  },
  {
    "month": "2025-02",
    "count": 52,
    "total": 14200.50
  }
]
```

**Example:**
```bash
curl http://localhost:3001/api/invoice-trends
```

---

### 3. GET /vendors/top10

Get top 10 vendors by total spend.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Musterfirma Müller",
    "totalSpend": 25000.00
  },
  {
    "id": "uuid",
    "name": "ABC GmbH",
    "totalSpend": 18500.75
  }
]
```

**Example:**
```bash
curl http://localhost:3001/api/vendors/top10
```

---

### 4. GET /category-spend

Get spend grouped by category.

**Response:**
```json
[
  {
    "category": "Services",
    "total": 45000.00
  },
  {
    "category": "Materials",
    "total": 32000.50
  },
  {
    "category": "General",
    "total": 15000.00
  }
]
```

**Example:**
```bash
curl http://localhost:3001/api/category-spend
```

---

### 5. GET /cash-outflow

Get expected cash outflow by date.

**Response:**
```json
[
  {
    "date": "2025-11-15",
    "amount": 5000.00
  },
  {
    "date": "2025-11-20",
    "amount": 7500.50
  }
]
```

**Example:**
```bash
curl http://localhost:3001/api/cash-outflow
```

---

### 6. GET /invoices

Get list of invoices with optional filters.

**Query Parameters:**
- `search` (optional): Search by invoice number or vendor name
- `status` (optional): Filter by status (processed, pending, rejected)
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "invoiceNumber": "1234",
      "invoiceDate": "2025-11-04T00:00:00.000Z",
      "vendorName": "Musterfirma Müller",
      "amount": 358.79,
      "status": "processed",
      "dueDate": "2025-12-04T00:00:00.000Z"
    }
  ],
  "total": 450,
  "limit": 100,
  "offset": 0
}
```

**Examples:**
```bash
# Get all invoices
curl http://localhost:3001/api/invoices

# Search invoices
curl "http://localhost:3001/api/invoices?search=Müller"

# Filter by status
curl "http://localhost:3001/api/invoices?status=processed"

# Pagination
curl "http://localhost:3001/api/invoices?limit=20&offset=20"
```

---

### 7. POST /chat-with-data

Process natural language queries using Vanna AI.

**Request Body:**
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response (Success):**
```json
{
  "sql": "SELECT ABS(SUM(invoice_total)) as total_spend FROM Invoice WHERE invoice_date >= NOW() - INTERVAL '90 days';",
  "data": [
    {
      "total_spend": 45000.50
    }
  ]
}
```

**Response (Error):**
```json
{
  "sql": "",
  "data": [],
  "error": "Failed to generate SQL from query"
}
```

**Examples:**
```bash
# Total spend
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the total spend?"}'

# Top vendors
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query":"List top 5 vendors by spend"}'

# Overdue invoices
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query":"Show overdue invoices as of today"}'
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

---

## Vanna AI Service

Base URL: `http://localhost:8000`

### GET /health

Check service health.

**Response:**
```json
{
  "status": "healthy"
}
```

---

### POST /query

Direct query to Vanna AI (used by backend).

**Request:**
```json
{
  "query": "What is the total spend?"
}
```

**Response:**
```json
{
  "sql": "SELECT ABS(SUM(invoice_total)) as total_spend FROM Invoice;",
  "data": [
    {
      "total_spend": 125000.50
    }
  ],
  "error": null
}
```

---

### POST /train

Train Vanna AI with new data (admin use).

**Request:**
```json
{
  "ddl": "CREATE TABLE ...",
  "question": "What is X?",
  "sql": "SELECT ...",
  "documentation": "Field X represents..."
}
```

**Response:**
```json
{
  "status": "Training successful"
}
```

---

## Rate Limits

- No rate limits in development
- Production: 100 requests/minute per IP

## Authentication

- No authentication required for this assignment
- In production, implement JWT tokens or API keys

## CORS

Enabled for all origins in development.

Production origins:
- `https://your-app.vercel.app`
- `https://your-api.vercel.app`

## Data Format Notes

1. **Dates**: ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)
2. **Currency**: All amounts in EUR
3. **Negative Values**: Credits/refunds are negative, use `ABS()` for totals
4. **Status Values**: `processed`, `pending`, `rejected`
5. **Categories**: `Services`, `Materials`, `Shipping`, `Utilities`, `Office Supplies`, `General`

## Sample Integration

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// Get stats
const stats = await axios.get(`${API_BASE}/stats`);
console.log(stats.data);

// Search invoices
const invoices = await axios.get(`${API_BASE}/invoices`, {
  params: { search: 'Müller', limit: 10 }
});

// Chat query
const response = await axios.post(`${API_BASE}/chat-with-data`, {
  query: 'What is the total spend?'
});
console.log(response.data.sql);
console.log(response.data.data);
```

### Python

```python
import requests

API_BASE = 'http://localhost:3001/api'

# Get stats
response = requests.get(f'{API_BASE}/stats')
stats = response.json()

# Chat query
response = requests.post(f'{API_BASE}/chat-with-data', json={
    'query': 'What is the total spend?'
})
result = response.json()
print(result['sql'])
print(result['data'])
```

## Websocket Support

Not implemented in this version. For real-time updates, poll endpoints or implement Server-Sent Events (SSE).

## Monitoring

Health check endpoints:
- Backend: `GET http://localhost:3001/health`
- Vanna: `GET http://localhost:8000/health`
