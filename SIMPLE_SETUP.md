# 🚀 Simple Setup - No Docker, No Local PostgreSQL

## Step 1: Get Free Database (2 minutes)

1. Go to: **https://neon.tech**
2. Sign up with GitHub/Google
3. Click **"Create Project"**
   - Name: `flowbit-analytics`
   - Region: Choose closest
4. Click **"Connection Details"** → Copy the **Connection String**
   - It looks like: `postgresql://user:pass@host.neon.tech/dbname`

## Step 2: Get Groq API Key (2 minutes)

1. Go to: **https://console.groq.com**
2. Sign up with GitHub/Google
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_`)

## Step 3: Create Environment Files (2 minutes)

### File 1: `apps/api/.env`
```env
DATABASE_URL="YOUR_NEON_CONNECTION_STRING_HERE"
VANNA_API_BASE_URL="http://localhost:8000"
PORT=3001
```

### File 2: `apps/web/.env.local`
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### File 3: `services/vanna/.env`
```env
DATABASE_URL=YOUR_NEON_CONNECTION_STRING_HERE
GROQ_API_KEY=YOUR_GROQ_KEY_HERE
PORT=8000
```

**Replace:**
- `YOUR_NEON_CONNECTION_STRING_HERE` with your Neon connection string
- `YOUR_GROQ_KEY_HERE` with your Groq API key

## Step 4: Setup Database (2 minutes)

```powershell
cd apps\api
npx prisma generate
npx prisma db push
npm run db:seed
```

Wait for "✅ Seed completed!"

## Step 5: Install Python Packages (1 minute)

```powershell
cd ..\..\services\vanna
pip install fastapi uvicorn python-dotenv vanna psycopg pandas chromadb pydantic
```

## Step 6: Start Everything (Open 3 PowerShell Windows)

### Window 1 - Backend API
```powershell
cd "c:\Assignments by companies\Flowbit AI\apps\api"
npm run dev
```
Wait for: ✅ API Server running on http://localhost:3001

### Window 2 - Frontend
```powershell
cd "c:\Assignments by companies\Flowbit AI\apps\web"
npm run dev
```
Wait for: ✓ Ready on http://localhost:3000

### Window 3 - Vanna AI
```powershell
cd "c:\Assignments by companies\Flowbit AI\services\vanna"
python main.py
```
Wait for: ✅ Vanna AI trained successfully

## Step 7: Open Browser

Go to: **http://localhost:3000**

You should see the dashboard with data!

---

## ✅ Quick Test

1. Dashboard shows numbers in cards
2. Charts are visible
3. Invoice table has data
4. Click "Chat with Data" tab
5. Type: "What is the total spend?"
6. See SQL and results!

---

## 🔧 Troubleshooting

### If port 3000 is in use:
```powershell
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### If Python packages fail:
```powershell
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn python-dotenv vanna psycopg pandas chromadb pydantic --user
```

### If database connection fails:
- Check your Neon connection string is correct
- Make sure it includes `?sslmode=require` at the end
- Example: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`

---

## 📧 Ready to Submit?

After testing works locally:
1. Read `docs/DEPLOYMENT.md` to deploy online
2. Record 3-5 min demo video
3. Email to: **recruit@flowbitai.com** by **10.11.2025**

Include:
- GitHub repo link
- Deployed URLs
- Demo video link

---

**That's it! 9 steps, ~10 minutes, no Docker needed!** 🎉
