# 🎯 PlacementAI - AI-Powered Career Intelligence Platform

A complete, hackathon-winning MERN + Machine Learning web application for college students to track placement readiness, improve their profiles, and connect with opportunities.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 Placement Predictor | AI-powered skill matching with 12+ companies |
| 📊 Skill Gap Analysis | Company-wise missing skills + improvement roadmap |
| 📄 Resume Optimizer | ML scoring (0-100) with detailed feedback |
| 🗺️ Animated Roadmaps | Visual learning paths for 5 career tracks |
| 📚 Practice Mode | MCQ tests for Aptitude, DSA, Python, SQL, Java |
| 💼 Internship Board | Filtered opportunities by domain |
| 🏆 Leaderboard | College-wide ranking system |
| 👥 Alumni Network | Connect with placed seniors |
| 🤖 AI Chatbot | Career guidance chatbot |
| 🌙 Dark Mode | Full dark/light theme toggle |

## 🛠️ Tech Stack

**Frontend:** React.js + Tailwind CSS + React Router
**Backend:** Node.js + Express.js + MongoDB + JWT Auth
**ML Service:** Python + Flask + NumPy + Scikit-learn
**Database:** MongoDB (with Mongoose)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.9+ (for ML service, optional)

### 1. Clone & Setup

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# Opens http://localhost:3000
```

**Terminal 3 - ML Service (Optional):**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
# Starts on http://localhost:5001
```

---

## 📁 Project Structure

```
ai-placement-platform/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── common/
│       │       └── Layout.jsx       # Main sidebar layout
│       ├── context/
│       │   ├── AuthContext.jsx      # JWT auth + API
│       │   └── ThemeContext.jsx     # Dark/light mode
│       ├── pages/
│       │   ├── Dashboard.jsx        # Main dashboard
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ProfilePage.jsx      # Skills, projects, internships
│       │   ├── PlacementPredictor.jsx
│       │   ├── ResumeOptimizer.jsx
│       │   ├── RoadmapPage.jsx      # Animated roadmaps
│       │   ├── LearningPage.jsx     # MCQ practice
│       │   ├── InternshipsPage.jsx
│       │   ├── LeaderboardPage.jsx
│       │   ├── AlumniPage.jsx
│       │   └── ChatbotPage.jsx
│       └── styles/
│           └── globals.css
│
├── server/                 # Node.js Backend
│   ├── data/
│   │   └── database.js     # Gujarat colleges + companies
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── models/
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── placement.js    # Skill matching algorithm
│   │   ├── resume.js       # Resume scoring
│   │   ├── roadmap.js      # Career roadmaps
│   │   ├── learning.js     # MCQ questions
│   │   ├── internships.js
│   │   ├── leaderboard.js
│   │   ├── alumni.js
│   │   ├── chatbot.js
│   │   └── colleges.js
│   └── index.js
│
└── ml-service/             # Python ML Service
    ├── app.py              # Flask API
    └── requirements.txt
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update skills, projects, internships

### Placement
- `GET /api/placement/predict` - Get all company predictions
- `GET /api/placement/skill-gap/:companyId` - Company-specific gap analysis

### Resume
- `POST /api/resume/analyze` - Analyze uploaded PDF
- `GET /api/resume/score` - Score based on profile

### Other
- `GET /api/roadmap/streams` - Available career paths
- `GET /api/roadmap/:stream` - Get roadmap
- `GET /api/learning/questions/:topic` - Get MCQs
- `POST /api/learning/submit/:topic` - Submit answers
- `GET /api/internships` - Get internships
- `GET /api/leaderboard` - College rankings
- `GET /api/alumni` - Alumni network
- `POST /api/chatbot/message` - Chat with AI

---

## 🎨 Design System

- **Font:** Syne (headings) + DM Sans (body) + JetBrains Mono (code)
- **Primary:** `#4f6ef7` (indigo-blue)
- **Accent:** `#f97316` (orange)
- **Success:** `#10b981` (emerald)
- **Dark bg:** `#0c0e1c`
- **Glass morphism + gradient borders**

---

## 📊 ML Algorithms

### Placement Probability
Multi-feature weighted model:
- Required skill match: **40%**
- Preferred skill match: **20%**
- CGPA factor: **15%**
- Project count: **10%**
- Internship count: **10%**
- Certifications: **5%**

### Resume Scoring
Rule-based + ML hybrid:
- Action verbs detection
- Quantification analysis (regex)
- Section completeness check
- Technical keyword density
- Gaussian noise for uniqueness

---

## 🏆 Hackathon-Ready Features

1. **Real-time skill gap** with probability increase calculator
2. **Animated roadmap** with progress tracking (localStorage)
3. **Dark/Light mode** with smooth transitions
4. **Responsive design** for mobile + desktop
5. **Glass morphism UI** with gradient borders
6. **Leaderboard** based on composite score
7. **Rule-based chatbot** with placement domain knowledge
8. **PDF resume upload** and text-based analysis

---

## 📝 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_placement
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

Built with ❤️ for Hackathon Winners
