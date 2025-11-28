# 🚀 Job Portal MERN (Full-Stack)

A modern, production-ready **Job Portal** built using the **MERN Stack** with complete job posting, company management, applicant tracking, dashboards, and **full AI-powered resume analysis + ATS scoring** using **Google Gemini 2.5 Flash**.

## ✨ Features

### 👥 User Features

- 🔐 Login / Register
- 👤 Update profile
- 📄 Upload resume (PDF)
- 🔎 Browse & filter jobs
- 🚀 Apply for jobs
- 📊 Track job applications
- 🤖 AI Resume Analyzer (Match %, Skills, Strengths, Rewrite)
- 🧾 ATS Score Checker (Keywords, Score, Suggestions, Summary)

### 🏢 Admin / Recruiter Features

- 🏭 Create & manage companies
- 📝 Post and update jobs
- 👀 View applicants list
- ✔ Accept / ❌ Reject applicants

### 🌟 Extra Features

- ☁ Cloudinary uploads
- 🎨 TailwindCSS + ShadCN UI
- 🧱 GSAP animated loaders + typewriter effects
- 🧠 Gemini 2.5 Flash for AI & ATS
- 🔐 JWT Auth
- 📱 Fully responsive
- ⚡ MongoDB caching (AI & ATS)
- 🚦 Rate-limiting for AI & ATS

## 🛠 Tech Stack

### Frontend

- React.js
- Redux Toolkit
- TailwindCSS
- ShadCN UI
- GSAP
- Axios

### Backend

- Node.js
- Express.js
- MongoDB / Mongoose
- Multer
- Cloudinary
- Google Gemini
- PDF-Parse v2
- JWT Auth

## 📁 Project Structure

```
Job-Portal-MERN/
│
├── backend/
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── ats.controller.js
│   │   └── other controllers…
│   │
│   ├── models/
│   │   ├── aiCache.model.js
│   │   ├── atsAICache.model.js
│   │   └── other models…
│   │
│   ├── middlewares/
│   │   ├── aiRateLimit.js
│   │   ├── atsRateLimit.js
│   │   ├── multer.js
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── ai.route.js
│   │   ├── ats.route.js
│   │   └── other routes…
│   │
│   ├── utils/
│   │   ├── cacheHash.js
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/AI/
│   │   │   ├── ATSScoreModal.jsx
│   │   │   └── AIModal.jsx
│   │   ├── shared/Navbar.jsx
│   │   ├── redux/
│   │   ├── pages/
│   │   ├── utils/constants.js
│   │   └── styles/
│   │
│   └── index.html
│
└── README.md
```

## ⚙️ Installation

### Backend

```
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongo
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
GEMINI_API_KEY=xxxx
```

Start:

```
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### AI

- `/ai/analyze`
- `/ai/check-ats-score`

## 🚀 Deployment (Render)

The backend of this project is live and hosted on **Render**.

### 🔗 Live Backend URL
https://ai-job-portal-ky06.onrender.com

### 🛠 Technologies Used in Deployment
- Render Web Services (Node + Express)
- MongoDB Atlas as cloud database
- Cloudinary for file uploads
- Environment variables: JWT, MongoDB, AI API keys

### 📌 Notes
- Render Free Tier sleeps after inactivity, so the first request may take a few seconds (cold start).
- All REST API routes are available under `/api/v1/*`.


## ⭐ Support

If this project helped you, please ⭐ the repository!
