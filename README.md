# weather-assistant-fullstack
A full-stack weather application featuring a Glassmorphism UI, AI-powered insights, and full CRUD functionality. Built with FastAPI and React.
created for the Assessment of PM ACCELERATION




# 🌌 Smart Weather Assistant & AI Insights (2026 Edition)

A high-performance, full-stack weather application featuring a **Glassmorphism UI**, real-time data fetching, and persistent storage. Developed for the **AI Engineer Intern Technical Assessment** at PM Accelerator.

## 🚀 Live Demo & Video
- **Project Walkthrough:** [INSERT YOUR LOOM/YOUTUBE LINK HERE]
- **Repository:** `https://github.com/hassankhan390/weather-assistant-fullstack`

---

## ✨ Key Features

### 🎨 Premium Glassmorphism UI
Inspired by modern mobile weather aesthetics, the interface uses:
- **Translucent Cards:** Utilizing `backdrop-blur` and high-contrast white text for a premium feel.
- **Responsive Layout:** A fluid experience across desktop and mobile devices.
- **Dynamic Animations:** Smooth component entry using Tailwind CSS `animate-in`.

### 🛠️ Full CRUD Functionality
- **Create:** Real-time weather data retrieval via external APIs.
- **Read:** A centralized dashboard showing the current search and a historical record table.
- **Update:** **Inline Annotations**—users can update weather records with custom notes (e.g., "Holiday plans").
- **Delete:** Effortless search history management with immediate UI updates.

### 📊 Data Portability & Tools
- **CSV Export:** Download your entire search history as a CSV file for offline analysis.
- **Geolocation:** Browser-level API integration for one-click "Current Location" search.
- **AI-Driven Insights:** Contextual recommendations based on current weather conditions.

---

## 🛠️ Technical Stack

- **Frontend:** React.js, Tailwind CSS v4 (Glassmorphism design system).
- **Backend:** FastAPI (Python 3.x), SQLAlchemy ORM.
- **Database:** SQLite (Relational data persistence).
- **API:** RESTful architecture with Axios.

---

## 📦 Local Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

 💡 Design Philosophy
The goal was to move beyond a standard "weather app" by focusing on **Product Management** values: 
1. Utility: Is the data actionable? (Added Smart Insights).
2. Engagement:Is it beautiful? (Implemented Glassmorphism).
3. Control: Does the user own their data? (Implemented Update & Export functionality).

---
Developed by **Hassan Khan** as part of the AI Engineer Intern Assessment.
```

---



**You're all set! Would you like me to review the video script one last time, or are you ready to hit 'Commit' and finish this?**
