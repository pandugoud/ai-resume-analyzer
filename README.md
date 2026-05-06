# AI Resume Analyzer & Job Matcher

An AI-powered full stack web application that analyzes resumes, extracts skills from PDF files, matches them against job descriptions, calculates a compatibility score, and provides suggestions to improve the resume.

## Tech Stack

### Frontend
- React
- Vite
- Recharts
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer

### AI Microservice
- Flask
- Python
- pdfplumber
- sentence-transformers

### DevOps
- Docker
- Docker Compose

---

## Features

- Upload resume in PDF format
- Extract resume text using Python
- Detect and extract technical skills
- Compare resume with job description
- Generate job-match score
- Show missing skills
- Give suggestions to improve resume
- Dashboard with analytics
- Recent analysis history
- Microservice-based architecture

---

## Project Architecture

This project uses 4 services:

1. **Client** → React frontend
2. **Server** → Node.js + Express backend
3. **AI Service** → Flask NLP microservice
4. **MongoDB** → Database

### Flow
- User uploads a resume PDF and enters a job description
- Node.js backend receives the file
- Node.js sends file path and job description to Flask AI service
- Flask extracts text, skills, score, and suggestions
- Node.js stores the final result in MongoDB
- React dashboard displays analysis and analytics

---

## Folder Structure

```bash
ai-resume-analyzer/
├── .gitignore
├── docker-compose.yml
├── README.md
├── uploads/
│   └── .gitkeep
├── client/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── UploadForm.jsx
│       │   ├── ScoreCard.jsx
│       │   └── Analytics.jsx
│       └── pages/
│           └── Dashboard.jsx
├── server/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── resumeController.js
│       ├── middleware/
│       │   └── upload.js
│       ├── models/
│       │   └── ResumeAnalysis.js
│       ├── routes/
│       │   └── resumeRoutes.js
│       └── services/
│           └── aiService.js
└── ai-service/
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── app.py
        └── skill_data.py
```

---

## Environment Variables

### Client `.env`
```env
VITE_API_URL=http://localhost:5001/api
```

### Server `.env`
```env
PORT=5001
MONGO_URI=mongodb://mongo:27017/ai_resume_analyzer
AI_SERVICE_URL=http://ai-service:5000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

---

## Installation and Setup

### Option 1: Run with Docker

Make sure Docker Desktop is installed and running.

```bash
docker compose up --build
```

### App URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- AI Service: http://localhost:5000

---

## Local Development Without Docker

### 1. Start MongoDB
Make sure MongoDB is running locally.

### 2. Run Flask AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app/app.py
```

### 3. Run Node Server
```bash
cd server
npm install
npm run dev
```

### 4. Run React Client
```bash
cd client
npm install
npm run dev
```

---

## API Endpoints

### Analyze Resume
**POST** `/api/resume/analyze`

Form Data:
- `resume` → PDF file
- `jobDescription` → Job description text

### Get All Analyses
**GET** `/api/resume/all`

### Get Dashboard Stats
**GET** `/api/resume/stats`

---

## Sample Use Case

- Upload a software developer resume PDF
- Paste a React / Node.js / Python job description
- App extracts skills like React, Node.js, MongoDB, Python
- AI compares job description with extracted resume content
- Dashboard displays:
  - Match score
  - Matched skills
  - Missing skills
  - Suggestions for improvement

---

## Future Improvements

- User authentication with JWT
- Resume history by user account
- Admin dashboard
- OCR support for scanned PDFs
- ATS-friendly resume tips
- Export analysis as PDF
- Role-based job matching
- Email notification system

---

## GitHub Upload Commands

```bash
git init
git add .
git commit -m "Initial commit - AI Resume Analyzer"
git branch -M main
git remote add origin https://github.com/pandugoud/ai-resume-analyzer.git
git push -u origin main
```

If remote already exists:
```bash
git remote set-url origin https://github.com/pandugoud/ai-resume-analyzer.git
git push -u origin main
```

---

## Author

**Pandu Goud**

GitHub: [https://github.com/pandugoud](https://github.com/pandugoud)

---

## License

This project is for educational and portfolio purposes.
