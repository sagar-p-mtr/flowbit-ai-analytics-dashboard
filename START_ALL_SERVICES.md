# 🚀 How to Start All Services

## Quick Start (3 Terminals Required)

### Terminal 1: Start Backend API
```powershell
cd "C:\Assignments by companies\Flowbit AI\apps\api"
npm run dev
```
✅ **API will run at:** http://localhost:3001

---

### Terminal 2: Start Frontend
```powershell
cd "C:\Assignments by companies\Flowbit AI\apps\web"
npm run dev
```
✅ **Frontend will run at:** http://localhost:3000

---

### Terminal 3: Start Vanna AI (Optional - Chat feature)
```powershell
cd "C:\Assignments by companies\Flowbit AI\services\vanna"
python main.py
```
✅ **Vanna AI will run at:** http://localhost:8000

---

## Access Your Application

### 🌐 Open in Browser:
**Main Application:** http://localhost:3000

**What you'll see:**
- Dashboard tab with statistics and charts
- Chat with Data tab for AI queries

### 🔧 API Endpoints (Backend):
- http://localhost:3001/api/stats
- http://localhost:3001/api/invoice-trends
- http://localhost:3001/api/vendors/top10
- http://localhost:3001/api/category-spend
- http://localhost:3001/api/invoices

### 🤖 AI Service (Vanna):
- http://localhost:8000/health

---

## ⚠️ Troubleshooting

### If port is already in use:

**Kill process on port 3000 (Frontend):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

**Kill process on port 3001 (API):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

**Kill process on port 8000 (Vanna):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
```

---

## 📝 Note:

**The Vanna AI service (Terminal 3) is OPTIONAL.**

The application will work without it because:
- Chat feature uses pattern matching as fallback
- All dashboard features work independently

**You only need:**
- Terminal 1 (API) - Required ✅
- Terminal 2 (Frontend) - Required ✅
- Terminal 3 (Vanna) - Optional ⚠️

---

## ✅ Quick Test

Once services are running:

1. **Open:** http://localhost:3000
2. **Check Dashboard Tab:**
   - See 4 stat cards
   - See 3 charts
   - See invoice table
3. **Check Chat Tab:**
   - Type: "Show me total invoices by vendor"
   - Click Send

---

**All set! Your application is running! 🎉**
