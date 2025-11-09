# 🎥 Demo Video Recording Guide

Complete guide and script for recording your 3-5 minute demo video for Flowbit AI submission.

---

## 📋 Pre-Recording Checklist

### Technical Setup
- [ ] All services running (API, Web, Vanna)
- [ ] Database seeded with 50 invoices
- [ ] Browser window clean (close unnecessary tabs)
- [ ] Screen resolution: 1920×1080 recommended
- [ ] Clear browser cache and cookies
- [ ] Test audio levels
- [ ] Close notification pop-ups

### What to Prepare
- [ ] Open http://localhost:3000 in Chrome/Edge
- [ ] Have these queries ready to copy-paste:
  - "Show me total invoices by vendor"
  - "What are the top 5 vendors?"
  - "Show me the most expensive invoices"
- [ ] Test CSV export beforehand
- [ ] Practice the script 2-3 times

### Recording Tools

**Recommended:**
- **OBS Studio** (Free, professional) - [obsproject.com](https://obsproject.com)
- **Loom** (Easy, browser-based) - [loom.com](https://loom.com)
- **Camtasia** (Paid, with editing) - [techsmith.com/camtasia](https://techsmith.com/camtasia)

**Settings:**
- Resolution: 1920×1080 (1080p)
- Frame Rate: 30 FPS
- Audio: Clear voice, no background noise
- Format: MP4 (H.264)

---

## 🎬 Video Script (3-5 minutes)

### Introduction (30 seconds)

**[Camera on OR just voice]**

> "Hello! I'm [Your Name], and I'm excited to present my submission for the Flowbit AI Analytics Dashboard assignment."
>
> "I've built a full-stack application that transforms complex invoice data into actionable business insights. Let's take a look."

**[Switch to screen recording]**

---

### Dashboard Overview (90 seconds)

**[Show homepage at localhost:3000]**

> "Here's the main dashboard. At the top, we have four key metrics:"

**[Hover over each card]**

> - "Total Spend: €5,046 across all invoices"
> - "50 invoices processed"
> - "50 documents uploaded"
> - "Average invoice value of €602"

**[Scroll down slowly]**

> "Below, we have three interactive charts:"

**[Point to each chart]**

> "First, the Invoice Trends chart shows spending patterns over time. You can see how our expenses vary month by month."

> "Next, the Top 10 Vendors bar chart shows which suppliers we're spending the most with. This helps identify our key business relationships."

> "The Spending by Category pie chart breaks down expenses into categories like Services, Materials, and Office Supplies."

**[Scroll to table]**

> "Finally, the Recent Invoices table displays all our invoice data with vendor names, amounts, dates, and status. You can search and filter these easily."

**[Type "ABC" in search box and press Enter]**

> "For example, I can search for specific vendors..."

**[Click Export CSV button]**

> "And export this data to CSV for further analysis in Excel or other tools."

**[Show downloaded file briefly]**

> "Here's the exported file ready to use."

---

### Chat with Data Feature (90 seconds)

**[Click on "Chat with Data" tab]**

> "Now, let's look at the AI-powered Chat feature. This is where things get really interesting."

> "Instead of writing complex SQL queries, business users can ask questions in plain English."

**[Type: "Show me total invoices by vendor"]**

> "Let me ask: 'Show me total invoices by vendor'"

**[Click Send or press Enter]**

**[Wait for results]**

> "The system uses Vanna AI to convert my question into SQL, executes it against our PostgreSQL database, and returns the results in a clean table format."

> "Here we can see each vendor with their total spending and invoice count."

**[Scroll through results]**

> "This is incredibly powerful for accountants, managers, or anyone who needs quick insights without technical SQL knowledge."

**[Type: "What are the top 5 vendors?"]**

> "Let's try another query: 'What are the top 5 vendors?'"

**[Wait for results]**

> "And instantly, we get our top 5 vendors ranked by total spend."

**[Type: "Show me the most expensive invoices"]**

> "One more: 'Show me the most expensive invoices'"

**[Wait for results]**

> "Perfect! The system identifies our highest-value invoices, which could indicate large purchases or potential anomalies worth investigating."

---

### Technical Overview (60 seconds)

**[Optional: Show VS Code with project structure, or skip to conclusion]**

> "From a technical perspective, this application uses a modern, production-ready stack:"

**[Show file tree OR just narrate]**

> - "Frontend: Next.js 14 with TypeScript and TailwindCSS for a responsive, type-safe interface"
> - "Backend: Express.js with Prisma ORM connecting to PostgreSQL"
> - "AI Layer: Vanna AI with Groq's LLM for natural language to SQL conversion"
> - "Database: Neon PostgreSQL with properly normalized tables and relationships"
> - "All organized in a monorepo structure with Turborepo for efficient development"

> "The database schema includes proper normalization with separate tables for Documents, Invoices, Vendors, Customers, Line Items, and Payments, all connected with foreign key relationships."

> "I've also implemented bonus features like CSV export, Docker containerization for easy deployment, and comprehensive documentation."

---

### Conclusion (30 seconds)

**[Back to Dashboard OR just voice]**

> "This project demonstrates my ability to:"
> - "Design and implement full-stack applications"
> - "Integrate AI technologies for real business problems"
> - "Create clean, maintainable code with proper architecture"
> - "Build user-friendly interfaces that non-technical users can navigate"

> "Thank you for considering my submission. I'm excited about the opportunity to join Flowbit AI and contribute to your team."

> "All the code, documentation, and deployment guides are available in the repository. I look forward to hearing from you!"

**[End recording]**

---

## 🎯 Key Points to Emphasize

### Technical Skills
✅ Full-stack development (Frontend + Backend + AI)  
✅ Modern tech stack (Next.js, TypeScript, Express, Python)  
✅ Database design and SQL  
✅ API development and integration  
✅ AI/ML integration (Vanna AI)  

### Business Understanding
✅ Solving real business problems  
✅ User-friendly interface for non-technical users  
✅ Data visualization for insights  
✅ Export functionality for further analysis  

### Code Quality
✅ Clean, modular architecture  
✅ Type safety with TypeScript  
✅ Comprehensive documentation  
✅ Docker support  
✅ Production-ready deployment  

---

## 🎨 Visual Tips

### Do's ✅
- **Clean desktop** - Remove clutter
- **Full screen browser** - Hide bookmarks bar
- **Smooth mouse movements** - Don't move too fast
- **Pause between actions** - Let things load
- **Zoom in on important parts** - Use browser zoom if needed
- **Show real results** - Don't fake data

### Don'ts ❌
- Don't show personal information
- Don't have distracting tabs open
- Don't rush through explanations
- Don't apologize for bugs (fix them first!)
- Don't show unrelated files
- Don't have notifications pop up

---

## 🎙️ Audio Tips

### Voice Recording
- **Speak clearly** - Enunciate words
- **Moderate pace** - Not too fast or slow
- **Enthusiasm** - Show you're excited about the project
- **Professionalism** - Use professional tone
- **No filler words** - Avoid "um", "uh", "like"

### Audio Quality
- **Quiet room** - No background noise
- **Good microphone** - Use headset mic if available
- **Test recording** - Do a 30-second test first
- **Audio level** - Not too loud, not too quiet

---

## ✂️ Editing (Optional)

If you have time, edit the video to:

### Add
- **Title screen** - "Flowbit AI Analytics Dashboard by [Your Name]"
- **Smooth transitions** - Between sections
- **Zooms/highlights** - On important features
- **Background music** - Subtle, professional (optional)
- **End screen** - Contact info, GitHub link

### Remove
- **Long loading times** - Speed up or cut
- **Mistakes** - Cut and re-record
- **Silence** - Trim dead air
- **Redundancy** - Keep it concise

---

## 📤 Export Settings

### Video Settings
```
Format: MP4
Codec: H.264
Resolution: 1920×1080 (1080p)
Frame Rate: 30 FPS
Bitrate: 5000 kbps (high quality)
```

### Audio Settings
```
Codec: AAC
Sample Rate: 44100 Hz
Bitrate: 192 kbps
Channels: Stereo
```

### File Size
Target: 50-200 MB for 3-5 minutes

---

## 📁 Upload Options

### YouTube (Unlisted)
1. Upload to YouTube
2. Set visibility to "Unlisted"
3. Copy link
4. Include in submission email

**Pros:** Reliable, easy to share, no size limits

### Loom
1. Record directly with Loom
2. Get shareable link
3. No download needed

**Pros:** Simple, no editing needed, instant share

### Google Drive
1. Upload MP4 file
2. Set sharing to "Anyone with link"
3. Copy link

**Pros:** No compression, original quality

### Dropbox
Similar to Google Drive

---

## ✅ Final Checklist Before Sending

- [ ] Video is 3-5 minutes long
- [ ] Audio is clear and professional
- [ ] All features demonstrated
- [ ] No personal information shown
- [ ] Video uploaded and link works
- [ ] Link accessibility set to public/unlisted
- [ ] Tested link in incognito mode

---

## 📧 Submission Email Template

```
Subject: Flowbit AI Analytics Dashboard Submission - [Your Name]

Dear Flowbit AI Recruitment Team,

I am excited to submit my completed Analytics Dashboard assignment. 

🔗 Repository: [GitHub Link]
🎥 Demo Video: [YouTube/Loom Link]
🌐 Live Demo: [Vercel Link - if deployed]

Key Features Implemented:
✅ Interactive analytics dashboard with real-time data
✅ AI-powered chat interface using Vanna AI
✅ 50 invoices from 13 vendors successfully processed
✅ CSV export functionality
✅ Docker containerization
✅ Comprehensive documentation
✅ Production-ready deployment configuration

Tech Stack:
- Frontend: Next.js 14, TypeScript, TailwindCSS
- Backend: Express.js, Prisma ORM, PostgreSQL
- AI: Vanna AI, Groq LLM, ChromaDB
- Infrastructure: Docker, Vercel-ready

The application is fully functional and ready for review. All setup instructions are in the README.md.

Thank you for this opportunity. I look forward to discussing the project further.

Best regards,
[Your Name]
[Your Email]
[Your Phone]
[LinkedIn Profile]
[GitHub Profile]
```

---

## 🎓 Pro Tips

1. **Practice makes perfect** - Record 2-3 takes, keep the best
2. **Time yourself** - Stick to 3-5 minutes
3. **Be yourself** - Show your personality
4. **Show confidence** - You built something awesome!
5. **Highlight unique features** - What makes yours special?

---

## ⏱️ Timing Breakdown

| Section | Duration | What to Show |
|---------|----------|--------------|
| Intro | 30s | Who you are, what you built |
| Dashboard | 90s | Stats, charts, table, export |
| Chat | 90s | 3 queries with results |
| Technical | 60s | Tech stack, architecture |
| Conclusion | 30s | Skills, next steps |
| **Total** | **5:00** | **Complete demo** |

---

**Good luck with your recording! You've built something impressive - now show it off! 🌟**
