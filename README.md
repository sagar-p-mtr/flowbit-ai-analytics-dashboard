# 📊 AI Analytics Dashboard

> A production-ready full-stack analytics platform with AI-powered natural language querying

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.19-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 📊 **Interactive Dashboard** - Real-time statistics, trends, and visualizations
- 🤖 **AI Chat Interface** - Ask questions in plain English, get instant SQL-powered answers
- 📈 **Data Visualization** - Beautiful charts using Chart.js (Line, Bar, Pie)
- 📥 **CSV Export** - Download invoice data for further analysis
- 🔍 **Smart Search** - Filter and search through invoices
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose
- 🚀 **Production Ready** - Deployed to Vercel (Frontend) & Render (Backend)

## � Live Demo

- **Frontend:** [Coming Soon - Deploy to Vercel]
- **Demo Video:** [Coming Soon - Upload to YouTube]

## 📸 Screenshots

### Dashboard Overview
![Dashboard](docs/screenshots/dashboard.png)
*Real-time analytics with statistics cards, trend charts, and top vendors*

### AI Chat Interface
![Chat](docs/screenshots/chat.png)
*Ask questions in natural language and get instant SQL-powered results*

### Invoice Management
![Invoices](docs/screenshots/invoices.png)
*Search, filter, and export invoice data*

## �🏗️ Architecture

```
flowbit-ai-analytics/
├── apps/
│   ├── api/                    # Express Backend (Port 3001)
│   │   ├── src/
│   │   │   ├── index.ts       # API routes & endpoints
│   │   │   └── seed.ts        # Database seeding script
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   └── Dockerfile
│   └── web/                    # Next.js Frontend (Port 3000)
│       ├── src/app/
│       │   └── page.tsx       # Main dashboard UI
│       └── Dockerfile
├── services/
│   └── vanna/                  # Python AI Service (Port 8000)
│       ├── main.py            # FastAPI + Vanna AI
│       └── Dockerfile
├── docs/                       # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   └── DEMO_VIDEO_GUIDE.md
└── docker-compose.yml          # Full stack deployment
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Chart.js** - Data visualization

### Backend
- **Express.js** - Node.js web framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database (Neon)
- **TypeScript** - End-to-end type safety

### AI Layer
- **Python FastAPI** - High-performance API
- **Vanna AI** - Text-to-SQL generation
- **Groq API** - LLM inference
- **ChromaDB** - Vector store

### DevOps
- **Docker** - Containerization
- **Turborepo** - Monorepo management
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://python.org/))
- **PostgreSQL** 15+ or [Neon](https://neon.tech) account (Free tier available)
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/flowbit-ai-analytics.git
cd flowbit-ai-analytics
```

### 2️⃣ Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Install Python dependencies for AI service
cd services/vanna
pip install -r requirements.txt
cd ../..
```

### 3️⃣ Setup Database

**Option A: Using Neon (Recommended - Free)**

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

**Option B: Local PostgreSQL**

```bash
createdb flowbit_analytics
```

### 4️⃣ Configure Environment Variables

Create `.env` files from examples:

```bash
# Backend API
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local

# Vanna AI Service (optional)
cp services/vanna/.env.example services/vanna/.env
```

**Edit `apps/api/.env`:**
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
PORT=3001
```

**Edit `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

### 5️⃣ Initialize Database

```bash
cd apps/api

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with 50 sample invoices
npm run db:seed

cd ../..
```

Expected output:
```
✅ Seeded 50 invoices
✅ Created 13 vendors
✅ Created 11 customers
✅ Created 665 line items
Total: €5,046.42
```

### 6️⃣ Start All Services

**Terminal 1 - Backend API:**
```bash
cd apps/api
npm run dev
```
✅ Running at http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```
✅ Running at http://localhost:3000

**Terminal 3 - Vanna AI (Optional):**
```bash
cd services/vanna
python main.py
```
✅ Running at http://localhost:8000

**Note:** Vanna AI service is optional. Chat feature has built-in fallback with pattern matching.

### 7️⃣ Open Application

Visit **http://localhost:3000** in your browser!

---

## 📖 Usage Guide

### Dashboard Tab

**Statistics Cards:**
- Total Spend: €5,046.42
- Total Invoices: 50
- Documents: 50
- Average Invoice: €602.59

**Charts:**
- **Invoice Trends** (Line) - Monthly spending patterns
- **Top 10 Vendors** (Bar) - Highest suppliers by spend
- **Category Breakdown** (Pie) - Spending distribution

**Invoice Table:**
- Search by vendor, invoice number, or amount
- Click "Export CSV" to download data

### Chat Tab

Ask questions in plain English:

```
✅ "Show me total invoices by vendor"
✅ "What are the top 5 vendors?"
✅ "Show me the most expensive invoices"
✅ "Show spending by category"
✅ "How many invoices per month?"
✅ "What's the total spend in the last 90 days?"
```

The AI will:
1. Convert your question to SQL
2. Execute the query safely
3. Display results in a formatted table

---

## 🚀 Deployment

### Quick Deploy with Docker

```bash
# Build and run all services
docker-compose up --build

# Access at http://localhost:3000
```

### Deploy to Production

**Frontend (Vercel):**

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Root directory: `apps/web`
4. Framework: Next.js
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-api.onrender.com/api
   ```
6. Deploy!

**Backend (Render):**

1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repo
3. Root directory: `apps/api`
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npx prisma migrate deploy && npm start`
6. Add environment variable:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
7. Deploy!

**Database (Neon):**

1. Create project on [Neon](https://neon.tech)
2. Copy connection string
3. Use in backend environment variables

📚 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## � API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard statistics |
| `/api/invoice-trends` | GET | Monthly trends |
| `/api/vendors/top10` | GET | Top vendors |
| `/api/category-spend` | GET | Category breakdown |
| `/api/invoices` | GET | List all invoices |
| `/api/chat-with-data` | POST | AI chat queries |

📚 **Full API documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🐳 Docker Deployment

Run entire stack with one command:

```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Vanna AI: http://localhost:8000
- PostgreSQL: localhost:5432

---

## 🧪 Testing

```bash
# Test API endpoints
curl http://localhost:3001/api/stats

# Test with sample query
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me top vendors"}'
```

---

## 📊 Database Schema

```sql
Document (id, name, status, organizationId)
  ↓
Invoice (id, documentId, vendorId, customerId, invoiceTotal, invoiceDate)
  ↓
LineItem (id, invoiceId, description, totalPrice, category)

Vendor (id, name, taxId, address)
Customer (id, name, address)
Payment (id, invoiceId, amount, paymentDate)
```

**Sample Data:**
- 50 invoices
- 13 unique vendors
- 11 customers
- 665 line items
- Total value: €5,046.42

---

## 🛠️ Development

### Project Structure

```
apps/
├── api/                 # Backend API
│   ├── src/
│   │   ├── index.ts    # Express routes
│   │   └── seed.ts     # Data seeding
│   └── prisma/
│       └── schema.prisma
└── web/                 # Frontend
    └── src/app/
        └── page.tsx     # Main dashboard

services/
└── vanna/               # AI Service
    └── main.py          # FastAPI + Vanna AI
```

### Available Scripts

```bash
# Root
npm install              # Install all dependencies
npm run build            # Build all packages

# Backend API (apps/api)
npm run dev              # Start development server
npm run build            # Build for production
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Frontend (apps/web)
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Vanna AI (services/vanna)
python main.py           # Start FastAPI server
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Windows
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Database connection failed:**
- Check DATABASE_URL is correct
- Ensure database exists
- Verify network access (for cloud databases)

**Prisma errors:**
```bash
cd apps/api
npx prisma generate
npx prisma migrate deploy
```

**Charts not displaying:**
- Clear browser cache
- Check console for errors
- Verify API returns data

---

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Vercel/Render
- [Demo Video Guide](./DEMO_VIDEO_GUIDE.md) - Recording instructions
- [Submission Checklist](./SUBMISSION_CHECKLIST.md) - Pre-submission checks

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project was created as part of the Flowbit AI technical assessment.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Flowbit AI](https://flowbitai.com) for the opportunity
- [Vanna AI](https://vanna.ai) for text-to-SQL capabilities
- [Neon](https://neon.tech) for PostgreSQL hosting
- [Vercel](https://vercel.com) for frontend deployment

---

## 📞 Support

For questions or issues:
- Create an [Issue](https://github.com/yourusername/flowbit-ai-analytics/issues)
- Email: recruit@flowbitai.com

---

**Built with ❤️ for Flowbit AI** | **© 2024 All Rights Reserved**
  "sql": "SELECT ABS(SUM(invoice_total)) as total_spend FROM Invoice;",
  "data": [
    { "total_spend": 125000.50 }
  ]
}
```

## 📦 Database Schema

### Tables

1. **Document** - Uploaded files metadata
2. **Invoice** - Invoice records with amounts
3. **Vendor** - Vendor/supplier information
4. **Customer** - Customer information
5. **LineItem** - Individual invoice line items
6. **Payment** - Payment terms and details

See [ER Diagram](./docs/ER_Diagram.md) for detailed schema.

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Chart.js & react-chartjs-2
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL

**AI Layer:**
- Python FastAPI
- Vanna AI
- Groq LLM (llama3-70b-8192)
- ChromaDB (Vector Store)

**DevOps:**
- Turborepo (Monorepo)
- Docker
- Vercel (Frontend/Backend)
- Render/Railway (Vanna AI)

## 🚢 Deployment

### Frontend & Backend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy:
   - **Frontend**: `apps/web`
   - **Backend**: `apps/api` (as Serverless Functions)

### Vanna AI Service (Render/Railway)

1. Create new Web Service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python main.py`
5. Add environment variables

### Database (Neon/Supabase/Railway)

1. Create PostgreSQL instance
2. Copy connection string
3. Update `DATABASE_URL` in all services

## 🧪 Testing

```powershell
# Test Backend API
curl http://localhost:3001/api/stats

# Test Vanna AI
curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d "{\"query\":\"What is the total spend?\"}"
```

## 📝 Development Notes

### Data Ingestion

The seed script (`apps/api/src/seed.ts`) processes the JSON file:
- Normalizes nested structures
- Creates vendor/customer records
- Maps line items to categories
- Handles data cleaning

### Category Mapping

Line items are categorized based on Sachkonto (account codes):
- 4400 → Services
- 4300 → Materials
- 4500 → Shipping
- 4600 → Utilities
- 4700 → Office Supplies
- default → General

### AI Training

Vanna AI is trained with:
- Database DDL schemas
- Documentation strings
- Sample question-SQL pairs

## 🐛 Troubleshooting

**Database connection errors:**
```powershell
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify connection string format
```

**Vanna AI errors:**
```powershell
# Check Groq API key is valid
# Ensure database connection is working
# Verify Python dependencies are installed
```

**Frontend build errors:**
```powershell
# Clear Next.js cache
cd apps\web
rm -r .next
npm run build
```

## 🏆 Bonus Features Implemented

✅ Clean, modular code structure
✅ TypeScript throughout
✅ Comprehensive error handling
✅ Loading states
✅ Responsive design
✅ Real-time data updates
✅ Searchable tables
✅ Chat history
✅ Docker support (see docker-compose.yml)
✅ Complete documentation

## � Acknowledgments

This project was built using these amazing open-source tools and services:

- **[Vanna AI](https://vanna.ai/)** - Text-to-SQL capabilities
- **[Groq](https://groq.com/)** - Fast LLM inference
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL
- **[Vercel](https://vercel.com/)** - Frontend deployment
- **[Render](https://render.com/)** - Backend hosting
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Chart.js](https://www.chartjs.org/)** - Data visualizations

## 👤 Author

**GitHub:** [@sagar-p-mtr](https://github.com/sagar-p-mtr)

## �📜 License

MIT License - Open Source Project
