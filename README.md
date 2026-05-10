# AI Pregnancy Care & Gestational Diabetes Prediction System

Professional full-stack maternal healthcare app with authentication, AI chatbot, GDM prediction, health tracking, reminders, PDF reports, emergency support, and mobile-first UX.

## Tech Stack

- Frontend: React (Vite), Recharts
- Backend: FastAPI, SQLAlchemy, JWT auth
- AI/ML: Random Forest model for GDM risk prediction
- AI Chatbot: LLM API integration (OpenAI compatible)
- Database: SQLite (easy local setup; replaceable by PostgreSQL)
- External APIs: Google Maps search URL integration, browser speech APIs (STT/TTS)

## Features Delivered

- User registration/login/logout/forgot password with hashed password storage
- User profile + dashboard with auto pregnancy week calculation
- Informational modules:
  - Pregnancy overview
  - Trimester guidance
  - Baby growth and mother body changes
  - Dos/don'ts, nutrition, exercise, common care guidance
- AI chatbot:
  - Text input
  - Voice input (speech-to-text in browser)
  - Voice output (text-to-speech in browser)
  - Multilanguage-ready (`language` field supports `en`, `hi`, `kn`)
- GDM prediction using trained Random Forest model
- Health tracker with logs, trends, and warning-driven recommendations
- Diet and exercise recommendations
- Nearby hospital finder using Google Maps navigation
- Reminders and mood tracking endpoints
- One-click emergency endpoint
- PDF report generation
- Partner guidance/post-pregnancy care section in UI extras tab

## Project Structure

- `frontend/` - React mobile-first app
- `backend/` - FastAPI server, DB models, ML integration
- `backend/train_model.py` - model training script
- `backend/data/sample_gdm_data.csv` - starter dataset

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
uvicorn app.main:app --reload --port 8000
```

Optional environment variable for advanced chatbot:

```bash
cd backend
copy .env.example .env
```

Then edit `backend/.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.

If frontend is opened from another device or custom host, set API URL:

```bash
cd frontend
copy .env.example .env
```

Then edit `.env`:

```bash
VITE_API_BASE_URL=http://YOUR_PC_IP:8000
```

## API Overview

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `GET /users/me`
- `GET /dashboard`
- `POST /chatbot`
- `POST /predict-gdm`
- `POST /health/log`
- `GET /health/logs`
- `POST /recommendations`
- `POST /mood`
- `POST /reminders`, `GET /reminders`
- `GET /hospitals?lat=..&lng=..`
- `GET /emergency`
- `GET /report/pdf`

## Security Notes

- Passwords are hashed with bcrypt (`passlib`)
- Protected endpoints use JWT bearer tokens
- Sensitive API values should be moved to environment variables
- Add HTTPS, API rate limits, and encrypted database storage for production

## Deployment Notes

- Backend: deploy FastAPI on Render/Railway/Azure App Service
- Frontend: deploy Vite build on Netlify/Vercel
- Set CORS to production frontend domain
- Replace SQLite with PostgreSQL for production scale

