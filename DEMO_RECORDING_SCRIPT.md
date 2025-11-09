# 🎬 DEMO VIDEO RECORDING SCRIPT
## Flowbit AI Analytics Dashboard - 3-5 Minute Demo

---

## 📋 PRE-RECORDING CHECKLIST

### ✅ Technical Setup:
- [ ] Close unnecessary browser tabs
- [ ] Clear browser notifications
- [ ] Set browser zoom to 100%
- [ ] Close Slack, email, messaging apps
- [ ] Turn off phone/notifications
- [ ] Check microphone works
- [ ] Use headphones (avoid echo)
- [ ] Good lighting on face (if showing webcam)

### ✅ URLs to Have Ready:
1. **Frontend:** https://flowbit-ai-analytics-dashboard-web.vercel.app
2. **Backend API:** https://flowbit-ai-api.onrender.com/api/stats
3. **GitHub:** https://github.com/sagar-p-mtr/flowbit-ai-analytics-dashboard

### ✅ Test Queries for Chat:
```
1. "Show me total invoices by vendor"
2. "What are the top 5 vendors by spend?"
3. "Show me the most expensive invoices"
```

---

## 🎥 RECORDING SCRIPT (3-5 Minutes)

### **INTRO (0:00 - 0:30) - 30 seconds**

**[SHOW: GitHub Repository page]**

**YOU SAY:**
> "Hi! I'm [Your Name], and today I'm presenting my solution for the Flowbit AI Analytics Dashboard assignment. This is a full-stack application with AI-powered natural language querying built using Next.js, Express, PostgreSQL, and Vanna AI. Let me show you what it can do."

**[Click on the live demo URL or type it in browser]**

---

### **DASHBOARD OVERVIEW (0:30 - 2:00) - 90 seconds**

**[SHOW: Dashboard loading with all data visible]**

**YOU SAY:**
> "Here's the main analytics dashboard. At the top, we have four key metrics:"

**[Point to or hover over each card as you mention it]**
1. "Total Spend Year-to-Date: €5,046"
2. "Total Invoices Processed: 50 invoices"
3. "Documents Uploaded: 50"
4. "Average Invoice Value: €602"

**[Scroll down slowly]**

> "Below that, we have three interactive charts visualizing the data:"

**[Point to each chart]**
1. "Invoice Volume & Value Trend - showing monthly patterns"
2. "Top 10 Vendors by Spend - horizontal bar chart"
3. "Spend by Category - pie chart breakdown"

**[Scroll to invoice table]**

> "And here's our invoice table with all 50 records. Let me show you the search feature."

**[Type in search box: "Tech"]**

> "I can filter by vendor name..."

**[Clear search, click on a column header to sort]**

> "...and sort by any column."

**[Click "Export CSV" button]**

> "I can also export all data to CSV for further analysis."

**[Show the downloaded file in downloads folder]**

---

### **AI CHAT FEATURE (2:00 - 4:00) - 2 minutes**

**[Click "Chat with Data" tab in sidebar]**

**YOU SAY:**
> "Now, let me show you the AI-powered chat feature. This uses Vanna AI with Groq to convert natural language questions into SQL queries."

**[Type first query: "Show me total invoices by vendor"]**

**[Press Enter and wait for response]**

> "I asked 'Show me total invoices by vendor', and you can see it generated the SQL query here..."

**[Point to the SQL box]**

> "...and returned the results in this formatted table. Each vendor with their invoice count and total spend."

**[Scroll through results]**

**[Type second query: "What are the top 5 vendors by spend?"]**

**[Wait for response]**

> "Let me try another query: 'What are the top 5 vendors by spend?' Again, it generates the SQL and shows the results instantly."

**[Type third query: "Show me invoices over €100"]**

**[Wait for response]**

> "And one more: 'Show me invoices over €100'. The system understands the context and filters accordingly."

---

### **TECHNICAL ARCHITECTURE (4:00 - 4:45) - 45 seconds**

**[Open new tab, go to GitHub repository]**

**YOU SAY:**
> "Let me quickly show you the technical architecture."

**[Show repository structure]**

> "The project uses a monorepo structure with Turborepo. We have:"

**[Click through folders as you mention them]**
- "Apps/web - Next.js frontend with TypeScript and Tailwind"
- "Apps/api - Express backend with Prisma ORM"
- "Services/vanna - Python FastAPI for AI SQL generation"

**[Scroll to README]**

> "The frontend is deployed on Vercel, the backend API on Render, and we're using Neon for PostgreSQL hosting."

**[Show README features section]**

> "Key features include real-time analytics, CSV export, pattern matching fallback when Vanna AI isn't available, and comprehensive error handling."

---

### **CONCLUSION (4:45 - 5:00) - 15 seconds**

**[Back to dashboard tab]**

**YOU SAY:**
> "This project demonstrates a production-ready analytics platform with AI capabilities, proper deployment, comprehensive documentation, and bonus features like CSV export and Docker support. Thank you for watching!"

**[Smile and wave if showing webcam, or fade out]**

---

## 🎬 RECORDING TOOLS

### **Option 1: OBS Studio (FREE - Best Quality)**
1. Download: https://obsproject.com/
2. Setup:
   - Add "Display Capture" source
   - Settings → Output → Recording Quality: High Quality
   - Recording Format: MP4
   - Video Bitrate: 2500 Kbps
   - Audio: 128 Kbps
3. Click "Start Recording"
4. Do your demo
5. Click "Stop Recording"

### **Option 2: Loom (FREE - Easy)**
1. Go to: https://www.loom.com/
2. Sign up free
3. Install Chrome extension
4. Click Loom icon → "Start Recording"
5. Choose "Screen + Cam" or "Screen Only"
6. Record demo
7. Auto-uploads and gives you link

### **Option 3: Windows Game Bar (Built-in)**
1. Press `Windows + G`
2. Click "Capture" widget
3. Click record button (or `Windows + Alt + R`)
4. Do your demo
5. Stop recording (`Windows + Alt + R` again)
6. Video saved in: `C:\Users\[YourName]\Videos\Captures`

### **Option 4: Screen Recording (PowerPoint)**
1. Open PowerPoint
2. Insert → Screen Recording
3. Select area
4. Click record
5. Stop and save

---

## 📤 AFTER RECORDING

### 1. **Review Your Video**
- [ ] Watch entire video
- [ ] Check audio is clear
- [ ] Check no sensitive info visible
- [ ] Verify all features shown

### 2. **Upload to YouTube**
1. Go to: https://youtube.com/upload
2. Upload your video
3. Set to **"Unlisted"** (not public!)
4. Title: "Flowbit AI Analytics Dashboard - [Your Name]"
5. Description:
```
Full-stack analytics dashboard with AI-powered querying
Built with: Next.js, Express, PostgreSQL, Vanna AI, Groq
Deployed on: Vercel + Render
GitHub: https://github.com/sagar-p-mtr/flowbit-ai-analytics-dashboard
```
6. Click "Publish"
7. Copy the video URL

### 3. **Alternative: Upload to Google Drive**
1. Go to: https://drive.google.com/
2. Upload video
3. Right-click → Share → Anyone with link can view
4. Copy link

---

## ✅ FINAL CHECKLIST

- [ ] Video is 3-5 minutes long
- [ ] Shows dashboard with all charts
- [ ] Demonstrates search/filter
- [ ] Shows CSV export
- [ ] Shows AI chat with 3 queries
- [ ] Mentions technology stack
- [ ] Shows GitHub repository
- [ ] Audio is clear
- [ ] No personal/sensitive info visible
- [ ] Video uploaded and link ready
- [ ] Video set to Unlisted (not private)

---

## 📧 VIDEO LINK FOR SUBMISSION

Once uploaded, your video link will look like:
- **YouTube:** `https://youtu.be/YOUR_VIDEO_ID`
- **Google Drive:** `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

**Include this link in your submission email!**

---

## 💡 TIPS FOR GREAT DEMO

1. **Speak Clearly & Confidently** - You built something amazing!
2. **Go Slow** - Give viewers time to see what you're showing
3. **Explain What You're Doing** - Don't just click silently
4. **Show Real Data** - Your 50 invoices look professional
5. **Highlight Unique Features** - CSV export, pattern matching fallback
6. **Be Proud** - You completed 100% of requirements + bonuses!

---

## 🎯 YOU'VE GOT THIS!

Your project is impressive. The demo video is just showcasing what you've already built. Relax, be yourself, and show off your hard work!

**Estimated time to record:** 15-30 minutes (including 1-2 retakes)

**Good luck! 🚀**
