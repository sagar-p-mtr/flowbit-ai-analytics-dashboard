# Setup Instructions

## Local Development Setup

### 1. Install Prerequisites

**Node.js & npm:**
```powershell
# Download from nodejs.org and install
node --version  # Should be 20+
npm --version
```

**Python:**
```powershell
# Download from python.org and install
python --version  # Should be 3.10+
pip --version
```

**PostgreSQL:**
```powershell
# Download from postgresql.org and install
# Or use Docker:
docker run --name flowbit-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=flowbit_analytics -p 5432:5432 -d postgres:15
```

### 2. Clone Project

```powershell
cd "c:\Assignments by companies\Flowbit AI"
```

### 3. Install Dependencies

```powershell
# Root
npm install

# API
cd apps\api
npm install
cd ..\..

# Web
cd apps\web
npm install
cd ..\..

# Vanna
cd services\vanna
pip install -r requirements.txt
cd ..\..
```

### 4. Setup Environment Files

Create `.env` files in each service:

**apps/api/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowbit_analytics?schema=public"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**services/vanna/.env:**
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

### 5. Get Groq API Key

1. Go to https://console.groq.com
2. Sign up / Login
3. Create API key
4. Copy key to `services/vanna/.env`

### 6. Copy Data File

```powershell
mkdir data
copy "c:\Users\sagar\Downloads\Analytics_Test_Data.json" "data\Analytics_Test_Data.json"
```

### 7. Initialize Database

```powershell
cd apps\api

# Generate Prisma client
npx prisma generate

# Create tables
npx prisma db push

# Seed data (takes 2-3 minutes)
npm run db:seed

cd ..\..
```

### 8. Start Services

Open 3 separate PowerShell terminals:

**Terminal 1 - API:**
```powershell
cd apps\api
npm run dev
```

**Terminal 2 - Web:**
```powershell
cd apps\web
npm run dev
```

**Terminal 3 - Vanna:**
```powershell
cd services\vanna
python main.py
```

### 9. Access Application

- Frontend: http://localhost:3000
- API: http://localhost:3001
- Vanna: http://localhost:8000

## Docker Setup (Alternative)

```powershell
# Set Groq API key
$env:GROQ_API_KEY="your_key_here"

# Start all services
docker-compose up -d

# Seed database
docker-compose exec api npm run db:seed

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Deployment

### Vercel (Frontend + Backend)

1. Install Vercel CLI:
```powershell
npm i -g vercel
```

2. Deploy:
```powershell
cd apps\web
vercel --prod
```

3. Set environment variables in Vercel dashboard

### Render (Vanna AI)

1. Go to render.com
2. New Web Service → Connect repository
3. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
   - Root Directory: `services/vanna`
4. Add environment variables

### Database

**Option 1: Neon (Recommended)**
1. Go to neon.tech
2. Create project
3. Copy connection string
4. Update DATABASE_URL

**Option 2: Railway**
1. Go to railway.app
2. New Project → PostgreSQL
3. Copy connection string

**Option 3: Supabase**
1. Go to supabase.com
2. New project
3. Copy connection string

## Troubleshooting

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Failed

```powershell
# Test connection
psql -U user -d flowbit_analytics -h localhost

# Reset database
dropdb flowbit_analytics
createdb flowbit_analytics
cd apps\api
npm run db:push
npm run db:seed
```

### Prisma Issues

```powershell
cd apps\api
rm -r node_modules
rm -r prisma\generated
npm install
npx prisma generate
npx prisma db push
```

### Python Dependencies

```powershell
cd services\vanna
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

## Testing

### API Endpoints

```powershell
# Stats
curl http://localhost:3001/api/stats

# Invoices
curl http://localhost:3001/api/invoices

# Chat
curl -X POST http://localhost:3001/api/chat-with-data -H "Content-Type: application/json" -d "{\"query\":\"Total spend?\"}"
```

### Vanna Direct

```powershell
curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d "{\"query\":\"What is the total spend?\"}"
```

## Production Checklist

- [ ] Environment variables set
- [ ] Database deployed and accessible
- [ ] API deployed on Vercel
- [ ] Frontend deployed on Vercel
- [ ] Vanna deployed on Render/Railway
- [ ] CORS configured
- [ ] API keys secured
- [ ] Database seeded
- [ ] All services health checked
- [ ] Demo video recorded

## Support

For issues, contact: recruit@flowbitai.com
