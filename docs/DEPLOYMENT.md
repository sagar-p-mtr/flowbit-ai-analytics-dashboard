# Deployment Guide

## Overview

This guide covers deploying the Flowbit Analytics application to production.

**Architecture:**
- **Frontend + Backend API**: Vercel
- **Vanna AI Service**: Render / Railway / Fly.io
- **Database**: Neon / Supabase / Railway PostgreSQL

---

## 1. Database Deployment

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project
3. Project name: `flowbit-analytics`
4. Region: Select closest to your users
5. Copy connection string (starts with `postgresql://`)
6. Save as `DATABASE_URL`

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy connection string from Variables tab
4. Save as `DATABASE_URL`

### Option C: Supabase

1. Go to [supabase.com](https://supabase.com)
2. New Project
3. Database → Connection string → URI
4. Copy and save as `DATABASE_URL`

---

## 2. Backend API Deployment (Vercel)

### Prerequisites
```powershell
npm i -g vercel
```

### Steps

1. **Prepare Backend**
```powershell
cd apps\api
```

2. **Create `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

3. **Deploy**
```powershell
vercel --prod
```

4. **Set Environment Variables in Vercel Dashboard**
- `DATABASE_URL`: Your PostgreSQL connection string
- `VANNA_API_BASE_URL`: Your Vanna service URL (after step 3)

5. **Run Migrations**
```powershell
# From Vercel CLI or dashboard
vercel env pull .env.production
npx prisma db push
```

6. **Seed Database**
```powershell
npm run db:seed
```

---

## 3. Vanna AI Service Deployment

### Option A: Render (Recommended)

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repository
4. Settings:
   - **Name**: `flowbit-vanna`
   - **Region**: Same as database
   - **Root Directory**: `services/vanna`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

5. **Environment Variables**:
```
DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db
GROQ_API_KEY=your_groq_api_key
PORT=8000
DB_HOST=your_db_host
DB_NAME=flowbit_analytics
DB_USER=your_user
DB_PASSWORD=your_password
DB_PORT=5432
```

6. Deploy and copy service URL (e.g., `https://flowbit-vanna.onrender.com`)

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository and `services/vanna` directory
4. Add environment variables (same as above)
5. Deploy

### Option C: Fly.io

1. Install Fly CLI
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. Login and Launch
```powershell
cd services\vanna
fly auth login
fly launch
```

3. Set secrets
```powershell
fly secrets set DATABASE_URL="postgresql+psycopg://..."
fly secrets set GROQ_API_KEY="your_key"
```

4. Deploy
```powershell
fly deploy
```

---

## 4. Frontend Deployment (Vercel)

1. **Navigate to Frontend**
```powershell
cd apps\web
```

2. **Create `vercel.json`** (optional)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

3. **Deploy**
```powershell
vercel --prod
```

4. **Set Environment Variables in Vercel**
- `NEXT_PUBLIC_API_BASE`: Your backend API URL from step 2
- `NEXT_PUBLIC_APP_URL`: Your frontend URL

---

## 5. Update CORS Settings

Update `apps/api/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'  // Keep for local dev
  ]
}));
```

---

## 6. Post-Deployment Checklist

### Database
- [ ] Database created and accessible
- [ ] Schema pushed (`prisma db push`)
- [ ] Data seeded (`npm run db:seed`)
- [ ] Connection tested

### Backend API
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Health check passing: `https://your-api.vercel.app/health`
- [ ] Can query stats: `https://your-api.vercel.app/api/stats`

### Vanna AI
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Health check passing: `https://your-vanna.onrender.com/health`
- [ ] Can process queries: `POST https://your-vanna.onrender.com/query`

### Frontend
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Loads without errors
- [ ] Dashboard shows data
- [ ] Chat works

---

## 7. Testing Production

### Test Backend
```bash
curl https://your-api.vercel.app/api/stats
```

### Test Vanna
```bash
curl -X POST https://your-vanna.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the total spend?"}'
```

### Test Frontend
1. Open `https://your-app.vercel.app`
2. Verify dashboard loads
3. Check charts render
4. Test invoice search
5. Test chat functionality

---

## 8. Monitoring & Logs

### Vercel
- Logs: https://vercel.com/dashboard → Your Project → Logs
- Analytics: Built-in analytics dashboard

### Render
- Logs: Dashboard → Your Service → Logs
- Metrics: Built-in metrics

### Database
- Neon: Dashboard → Monitoring
- Railway: Dashboard → Metrics

---

## 9. Custom Domain (Optional)

### Vercel
1. Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render
1. Service Settings → Custom Domain
2. Add domain and configure DNS

---

## 10. CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm i -g vercel
      
      - name: Deploy Frontend
        run: |
          cd apps/web
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Backend
        run: |
          cd apps/api
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 11. Environment Variables Summary

### Backend API (Vercel)
```
DATABASE_URL=postgresql://...
VANNA_API_BASE_URL=https://your-vanna.onrender.com
PORT=3001
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_BASE=https://your-api.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Vanna (Render/Railway)
```
DATABASE_URL=postgresql+psycopg://...
GROQ_API_KEY=gsk_...
PORT=8000
DB_HOST=your-db-host
DB_NAME=flowbit_analytics
DB_USER=your-user
DB_PASSWORD=your-password
DB_PORT=5432
```

---

## 12. Rollback Strategy

### Vercel
```powershell
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Render
- Dashboard → Deployments → Select previous → Redeploy

---

## 13. Troubleshooting

### Database Connection Issues
- Verify connection string format
- Check firewall rules
- Test with `psql` or database client

### API Not Responding
- Check Vercel logs
- Verify environment variables
- Test health endpoint

### Vanna AI Errors
- Verify Groq API key
- Check database connection
- Review service logs

### CORS Errors
- Update allowed origins in API
- Check browser console for details

---

## 14. Cost Estimates

### Free Tier
- **Vercel**: Free for hobby projects
- **Render**: Free tier available (may sleep)
- **Neon**: 0.5GB free forever
- **Railway**: $5 credit/month

### Paid (Estimated)
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **Neon Pro**: $19/month
- **Total**: ~$46/month

---

## 15. Security Recommendations

- [ ] Enable HTTPS everywhere
- [ ] Rotate API keys regularly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Implement authentication
- [ ] Regular security audits
- [ ] Monitor for suspicious activity

---

## Support

For deployment issues, contact: recruit@flowbitai.com
