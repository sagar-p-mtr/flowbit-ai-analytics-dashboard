# 🚀 QUICK START - Run This Now!

## ✅ Prerequisites Check

You have:
- ✅ Node.js v24.11.0 
- ✅ Python 3.13.5
- ❌ PostgreSQL (not installed - we'll use Docker)

## 🎯 FASTEST WAY: Using Docker

### Step 1: Install Docker Desktop (if not installed)
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Get Groq API Key (2 minutes)
1. Go to: https://console.groq.com
2. Sign up with Google/GitHub
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### Step 3: Create Environment File for Vanna

Create `services\vanna\.env`:
```env
GROQ_API_KEY=your_key_here_paste_it
DATABASE_URL=postgresql+psycopg://user:password@postgres:5432/flowbit_analytics
PORT=8000
DB_HOST=postgres
DB_NAME=flowbit_analytics
DB_USER=user
DB_PASSWORD=password
DB_PORT=5432
```

### Step 4: Start Everything with Docker

```powershell
# In PowerShell, from project root:
cd "c:\Assignments by companies\Flowbit AI"

# Start all services
docker-compose up -d

# Wait 30 seconds for database to start, then seed it
timeout /t 30
docker-compose exec api npm run db:seed

# Check logs
docker-compose logs -f
```

### Step 5: Open Your Browser
http://localhost:3000

---

## 🎯 ALTERNATIVE: Without Docker (Manual Setup)

### Option A: Install PostgreSQL

1. Download from: https://www.postgresql.org/download/windows/
2. Install with these settings:
   - Username: postgres
   - Password: password
   - Port: 5432
3. Create database:
   ```powershell
   psql -U postgres
   CREATE DATABASE flowbit_analytics;
   \q
   ```

### Option B: Use Online Database (Easiest!)

1. Go to https://neon.tech
2. Sign up (free)
3. Create new project: "flowbit-analytics"
4. Copy connection string

Then create these `.env` files:

**apps/api/.env**
```env
DATABASE_URL="your_neon_connection_string_here"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
```

**apps/web/.env.local**
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**services/vanna/.env**
```env
DATABASE_URL=your_neon_connection_string_here
GROQ_API_KEY=your_groq_key_here
PORT=8000
DB_HOST=your_neon_host
DB_NAME=flowbit_analytics
DB_USER=your_neon_user
DB_PASSWORD=your_neon_password
DB_PORT=5432
```

### Run Setup

```powershell
cd "c:\Assignments by companies\Flowbit AI"

# Setup database
cd apps\api
npx prisma generate
npx prisma db push
npm run db:seed
cd ..\..

# Install Python packages manually
cd services\vanna
pip install fastapi uvicorn python-dotenv vanna psycopg pandas chromadb pydantic
cd ..\..
```

### Start Services (3 Terminals)

**Terminal 1 - Backend:**
```powershell
cd "c:\Assignments by companies\Flowbit AI\apps\api"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Assignments by companies\Flowbit AI\apps\web"
npm run dev
```

**Terminal 3 - Vanna AI:**
```powershell
cd "c:\Assignments by companies\Flowbit AI\services\vanna"
python main.py
```

---

## 🧪 Test It Works

Open browser: http://localhost:3000

You should see:
- ✅ Dashboard with numbers
- ✅ Charts
- ✅ Invoice table
- ✅ Switch to "Chat with Data"
- ✅ Type: "What is the total spend?"
- ✅ See SQL and results!

---

## ❗ Quick Fixes

### Port 3000 already in use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Python packages fail
```powershell
pip install --upgrade pip
pip install fastapi uvicorn python-dotenv vanna psycopg pandas chromadb pydantic --user
```

### Database connection fails
Use Neon.tech (free online database) instead of local PostgreSQL

---

## 🎯 RECOMMENDED: Docker Approach

Docker is the easiest way because:
- ✅ No PostgreSQL installation needed
- ✅ Everything in one command
- ✅ Consistent environment
- ✅ Easy cleanup

Just need:
1. Docker Desktop installed
2. Groq API key
3. One command: `docker-compose up`

---

## 📞 Next Steps After Testing

1. ✅ Test locally (now)
2. 📝 Read `docs/DEPLOYMENT.md` for deploying to production
3. 🎥 Record 3-5 min demo video
4. 📧 Submit to recruit@flowbitai.com

**Deadline: Tomorrow (10.11.2025)**

---

## 💡 Stuck? 

Check these files:
- `QUICKSTART.md` - Quick reference
- `docs/SETUP.md` - Detailed setup
- `docs/API.md` - API documentation
- `PROJECT_SUMMARY.md` - Complete overview

Good luck! 🚀
