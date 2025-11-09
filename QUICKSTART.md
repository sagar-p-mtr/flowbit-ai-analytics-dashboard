# 🎯 Flowbit AI Assignment - Quick Start Guide

## ✅ What's Been Built

### 1. **Backend API** (Node.js + Express + Prisma + PostgreSQL)
- ✅ 7 REST endpoints (stats, trends, vendors, categories, cash-outflow, invoices, chat)
- ✅ Normalized database schema (6 tables)
- ✅ Data ingestion script for JSON parsing
- ✅ TypeScript throughout
- ✅ Error handling

### 2. **Frontend** (Next.js 14 + TypeScript + Tailwind + shadcn/ui)
- ✅ Dashboard tab with overview cards
- ✅ Charts (Line, Bar, Pie)
- ✅ Searchable invoices table
- ✅ Chat with Data interface
- ✅ Responsive design
- ✅ Real-time data updates

### 3. **Vanna AI Service** (Python + FastAPI + Groq)
- ✅ Natural language to SQL conversion
- ✅ Groq LLM integration (llama3-70b-8192)
- ✅ Database query execution
- ✅ Pre-trained with schema and samples
- ✅ REST API

### 4. **Documentation**
- ✅ Comprehensive README
- ✅ Setup instructions
- ✅ API documentation
- ✅ ER diagram
- ✅ Deployment guide
- ✅ Docker configuration

---

## 🚀 30-Second Start

### Prerequisites
- Node.js 20+
- Python 3.10+
- PostgreSQL 15+
- Groq API Key (from https://console.groq.com)

### Quick Commands

```powershell
# 1. Setup database
createdb flowbit_analytics

# 2. Copy data file
mkdir data
copy "c:\Users\sagar\Downloads\Analytics_Test_Data.json" "data\Analytics_Test_Data.json"

# 3. Install dependencies
npm install
cd apps\api && npm install && cd ..\..
cd apps\web && npm install && cd ..\..
cd services\vanna && pip install -r requirements.txt && cd ..\..

# 4. Configure environment
# Create .env files (see below)

# 5. Setup database
cd apps\api
npx prisma generate
npx prisma db push
npm run db:seed
cd ..\..

# 6. Start services (3 terminals)
# Terminal 1: cd apps\api && npm run dev
# Terminal 2: cd apps\web && npm run dev
# Terminal 3: cd services\vanna && python main.py

# 7. Open browser
# http://localhost:3000
```

---

## ⚙️ Environment Files

### `apps/api/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `services/vanna/.env`
```env
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/flowbit_analytics
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
DB_HOST=localhost
DB_NAME=flowbit_analytics
DB_USER=user
DB_PASSWORD=password
DB_PORT=5432
```

---

## 📋 Project Structure

```
flowbit-analytics/
├── apps/
│   ├── api/                    # Backend Express API
│   │   ├── src/
│   │   │   ├── index.ts       # Main API server
│   │   │   └── seed.ts        # Data ingestion
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx   # Main dashboard
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   │   └── ui/        # shadcn/ui components
│       │   └── lib/
│       └── package.json
│
├── services/
│   └── vanna/                  # Vanna AI Service
│       ├── main.py            # FastAPI server
│       ├── requirements.txt
│       └── Dockerfile
│
├── data/
│   └── Analytics_Test_Data.json
│
├── docs/
│   ├── API.md                 # API documentation
│   ├── SETUP.md               # Setup instructions
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── ER_Diagram.md          # Database schema
│
├── docker-compose.yml
├── package.json               # Root monorepo config
├── turbo.json                 # Turborepo config
└── README.md
```

---

## 🎨 Features Implemented

### Dashboard
- [x] Total Spend (YTD)
- [x] Total Invoices Processed
- [x] Documents Uploaded
- [x] Average Invoice Value
- [x] Invoice Volume & Value Trend (Line Chart)
- [x] Top 10 Vendors by Spend (Bar Chart)
- [x] Spend by Category (Pie Chart)
- [x] Searchable Invoices Table

### Chat with Data
- [x] Natural language query input
- [x] AI-powered SQL generation (Vanna + Groq)
- [x] Display generated SQL
- [x] Show query results
- [x] Chat history
- [x] Loading states
- [x] Error handling

---

## 🧪 Test Commands

```powershell
# Test Backend
curl http://localhost:3001/api/stats

# Test Vanna
curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d "{\"query\":\"Total spend?\"}"

# Test Full Flow
curl -X POST http://localhost:3001/api/chat-with-data -H "Content-Type: application/json" -d "{\"query\":\"What is the total spend?\"}"
```

---

## 🚢 Deployment URLs

After deployment, you'll have:

1. **Frontend**: `https://your-app.vercel.app`
2. **Backend API**: `https://your-api.vercel.app/api`
3. **Vanna AI**: `https://your-vanna.onrender.com`

See `docs/DEPLOYMENT.md` for detailed deployment steps.

---

## 📊 Database Statistics (After Seeding)

Expected results:
- Documents: ~450
- Invoices: ~450
- Vendors: ~200
- Customers: ~200
- Line Items: ~900
- Payments: ~450

---

## 🎥 Demo Video Checklist

When recording demo video (3-5 min):

1. ✅ Dashboard loading with all cards populated
2. ✅ Line chart showing invoice trends
3. ✅ Bar chart showing top vendors
4. ✅ Pie chart showing categories
5. ✅ Table with invoice data
6. ✅ Search functionality in table
7. ✅ Switch to "Chat with Data" tab
8. ✅ Ask question: "What's the total spend?"
9. ✅ Show generated SQL
10. ✅ Show results
11. ✅ Ask another question: "Top 5 vendors"
12. ✅ Show results update

---

## 🏆 Bonus Features

- ✅ Docker Compose for easy deployment
- ✅ Comprehensive documentation
- ✅ TypeScript throughout
- ✅ Clean code structure
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ ER diagram
- ✅ API documentation
- ✅ Setup guide

---

## 📞 Support

Questions? Email: recruit@flowbitai.com

---

## ⏱️ Time Saved

This complete implementation includes:
- ✅ Full monorepo setup (30 min)
- ✅ Database design & schema (45 min)
- ✅ Backend API with 7 endpoints (2 hours)
- ✅ Data ingestion script (1 hour)
- ✅ Frontend dashboard (3 hours)
- ✅ Vanna AI integration (1.5 hours)
- ✅ Documentation (1.5 hours)
- ✅ Docker & deployment configs (1 hour)

**Total: ~10 hours of work** ✨

---

## 🎯 Next Steps

1. ✅ Copy data file to `data/` folder
2. ✅ Create `.env` files
3. ✅ Get Groq API key
4. ✅ Run setup commands
5. ✅ Start all services
6. ✅ Test application
7. ✅ Deploy to production
8. ✅ Record demo video
9. ✅ Submit to recruit@flowbitai.com

---

## 🐛 Common Issues & Fixes

### Port already in use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database connection failed
```powershell
psql -U postgres
CREATE DATABASE flowbit_analytics;
```

### Prisma errors
```powershell
cd apps\api
rm -r node_modules
npm install
npx prisma generate
```

---

**Built with ❤️ for Flowbit AI Assignment**

Good luck! 🚀
