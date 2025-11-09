# 🚀 Deployment Guide

Complete guide for deploying Flowbit AI Analytics Dashboard to production.

---

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Vercel Deployment (Frontend)](#vercel-deployment)
3. [Render Deployment (Backend)](#render-deployment)
4. [Database Setup (Neon)](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Docker Deployment](#docker-deployment)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Deployment Options

### Recommended Stack

| Component | Service | Why |
|-----------|---------|-----|
| Frontend | Vercel | Zero-config Next.js deployment, CDN, auto-scaling |
| Backend API | Render / Railway | Easy Node.js hosting, automatic deploys |
| Vanna AI | Render / Railway | Python support, background workers |
| Database | Neon / Supabase | Serverless PostgreSQL, free tier, excellent performance |

---

## Vercel Deployment (Frontend)

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub/GitLab/Bitbucket.

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New Project"

### Step 3: Import Project

```bash
# Select your repository
# Root Directory: apps/web
# Framework Preset: Next.js
```

### Step 4: Configure Build Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
.next
```

**Install Command:**
```bash
npm install
```

### Step 5: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_BASE=https://your-api.onrender.com/api
NEXT_PUBLIC_VANNA_URL=https://your-vanna.onrender.com
```

### Step 6: Deploy

Click "Deploy" button. Your frontend will be live at:
```
https://your-project.vercel.app
```

### Step 7: Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Render Deployment (Backend API)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Configure Service

**Settings:**
```yaml
Name: flowbit-api
Environment: Node
Region: Oregon (or closest to you)
Branch: main
Root Directory: apps/api
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm start
```

### Step 3: Environment Variables

Add in Render Dashboard → Environment:

```env
DATABASE_URL=postgresql://user:password@host/database
PORT=3001
NODE_ENV=production
```

### Step 4: Deploy

Click "Create Web Service". Deployment takes 3-5 minutes.

Your API will be available at:
```
https://your-service.onrender.com
```

### Step 5: Test Endpoints

```bash
curl https://your-api.onrender.com/api/stats
```

---

## Render Deployment (Vanna AI Service)

### Step 1: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect repository

### Step 2: Configure Python Service

**Settings:**
```yaml
Name: flowbit-vanna
Environment: Python 3
Region: Same as API
Branch: main
Root Directory: services/vanna
Build Command: pip install -r requirements.txt
Start Command: python main.py
```

### Step 3: Environment Variables

```env
DATABASE_URL=postgresql://user:password@host/database
DB_HOST=your-neon-host
DB_NAME=neondb
DB_USER=your-user
DB_PASSWORD=your-password
DB_PORT=5432
GROQ_API_KEY=gsk_your_api_key_here
PORT=8000
```

### Step 4: Deploy

Service will be available at:
```
https://your-vanna.onrender.com
```

---

## Database Setup (Neon)

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier available)
3. Click "Create Project"

### Step 2: Configure Project

**Settings:**
```
Project Name: flowbit-analytics
Region: US East (or closest)
PostgreSQL Version: 15
```

### Step 3: Get Connection String

Copy the connection string from dashboard:
```
postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Run Migrations

From your local machine:

```bash
# Set DATABASE_URL
export DATABASE_URL="your-neon-connection-string"

# Run migrations
cd apps/api
npx prisma migrate deploy

# Seed database
npm run db:seed
```

### Step 5: Verify Data

```bash
# Connect with psql
psql "your-connection-string"

# Check tables
\dt

# Count invoices
SELECT COUNT(*) FROM "Invoice";
```

---

## Environment Variables

### Complete Environment Variable List

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE=https://your-api.onrender.com/api
NEXT_PUBLIC_VANNA_URL=https://your-vanna.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Backend API (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

#### Vanna AI (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DB_HOST=ep-xxx.us-east-1.aws.neon.tech
DB_NAME=neondb
DB_USER=your-user
DB_PASSWORD=your-password
DB_PORT=5432
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
```

---

## Docker Deployment

### Option 1: Docker Compose (Local/VPS)

**Prerequisites:**
- Docker 20+
- Docker Compose 2+

**Steps:**

1. **Clone Repository**
```bash
git clone <your-repo>
cd "Flowbit AI"
```

2. **Create .env file**
```bash
# Create .env in root directory
echo "GROQ_API_KEY=your_key_here" > .env
```

3. **Start All Services**
```bash
docker-compose up --build
```

4. **Access Application**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Vanna: http://localhost:8000
- PostgreSQL: localhost:5432

5. **Stop Services**
```bash
docker-compose down
```

6. **View Logs**
```bash
docker-compose logs -f
```

### Option 2: Docker Hub (Production)

**Build and Push:**

```bash
# Login to Docker Hub
docker login

# Build images
docker build -t yourusername/flowbit-web:latest -f apps/web/Dockerfile .
docker build -t yourusername/flowbit-api:latest -f apps/api/Dockerfile .
docker build -t yourusername/flowbit-vanna:latest -f services/vanna/Dockerfile .

# Push images
docker push yourusername/flowbit-web:latest
docker push yourusername/flowbit-api:latest
docker push yourusername/flowbit-vanna:latest
```

**Deploy to VPS:**

```bash
# On your server
docker pull yourusername/flowbit-web:latest
docker pull yourusername/flowbit-api:latest
docker pull yourusername/flowbit-vanna:latest

# Run with docker-compose
docker-compose up -d
```

---

## Alternative Platforms

### Railway

**Pros:**
- Easy setup
- Free tier
- Good for all services

**Deploy:**
1. Connect GitHub
2. Select repository
3. Railway auto-detects services
4. Add environment variables
5. Deploy

### Fly.io

**Pros:**
- Global edge network
- Good free tier
- Excellent for APIs

**Deploy:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
flyctl launch
```

### Heroku

**Pros:**
- Familiar platform
- Easy Postgres add-on

**Deploy:**
```bash
# Login
heroku login

# Create apps
heroku create flowbit-api
heroku create flowbit-web

# Add Postgres
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

---

## Post-Deployment Checklist

### ✅ Functional Testing

- [ ] Frontend loads at production URL
- [ ] Dashboard displays statistics
- [ ] Charts render correctly
- [ ] Invoice table shows data
- [ ] Chat feature works
- [ ] CSV export functions

### ✅ API Testing

```bash
# Test stats
curl https://your-api.onrender.com/api/stats

# Test trends
curl https://your-api.onrender.com/api/trends

# Test chat
curl -X POST https://your-vanna.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Show top vendors"}'
```

### ✅ Performance

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Chat queries complete < 5 seconds
- [ ] No console errors

### ✅ Security

- [ ] Environment variables not exposed
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Database uses SSL
- [ ] API keys secured

### ✅ Monitoring

Set up monitoring:
- **Vercel Analytics** - Frontend performance
- **Render Metrics** - Backend health
- **Sentry** - Error tracking (optional)
- **LogRocket** - Session replay (optional)

---

## Troubleshooting

### Frontend Not Loading

**Check:**
1. Environment variables set correctly
2. API URL is accessible
3. CORS headers configured
4. Build completed successfully

**Fix:**
```bash
# Rebuild on Vercel
vercel --prod --force
```

### API Errors

**Check:**
1. Database connection string
2. Prisma migrations applied
3. Logs for specific errors

**Fix:**
```bash
# On Render, go to Shell and run:
npx prisma migrate deploy
npx prisma generate
```

### Vanna AI Not Responding

**Check:**
1. GROQ_API_KEY is valid
2. Database connection works
3. Python dependencies installed

**Fix:**
```bash
# Restart service on Render
# Or rebuild with:
pip install --upgrade vanna
```

### Database Connection Issues

**Check:**
1. Connection string format
2. IP whitelisting (Neon)
3. SSL mode required

**Fix:**
```
postgresql://user:pass@host/db?sslmode=require
```

---

## Cost Estimation

### Free Tier (Hobby Projects)

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| Vercel | ✅ Yes | 100GB bandwidth/month |
| Render | ✅ Yes | 750 hours/month, sleeps after 15min |
| Neon | ✅ Yes | 3GB storage, 1 project |
| **Total** | **$0/month** | Suitable for demo/portfolio |

### Production Tier (Small Business)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Render | Starter | $7/month per service × 2 = $14 |
| Neon | Launch | $19/month |
| **Total** | | **$53/month** |

---

## Scaling Recommendations

### When to Scale

**Scale if:**
- Response time > 2 seconds
- More than 1000 users/day
- Database queries slow
- Out of free tier limits

**How to Scale:**

1. **Frontend**: Vercel auto-scales
2. **Backend**: Upgrade Render plan or add instances
3. **Database**: Upgrade Neon plan or migrate to dedicated
4. **Caching**: Add Redis for frequently accessed data

---

## Support

**Deployment Issues:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Render: [community.render.com](https://community.render.com)
- Neon: [neon.tech/docs](https://neon.tech/docs)

**Project Issues:**
- Create GitHub issue
- Email: recruit@flowbitai.com

---

**Last Updated:** November 2024  
**Version:** 1.0
