# System Architecture

Mobile Web App (React) -> FastAPI Backend -> Services Layer -> Database + AI

## Data Flow

1. User authenticates with email/password.
2. JWT token is attached to secure API requests.
3. Backend stores/retrieves health records from database.
4. GDM module sends feature vector to trained Random Forest model.
5. Chatbot module sends user question to LLM service and returns safe response.
6. Recommendation engine generates diet/exercise and warning alerts.
7. Reporting service compiles profile + logs into downloadable PDF.

## Components

- Frontend UI
  - Auth screens
  - Dashboard and informational content
  - Chatbot with text + voice
  - Tracker graphs and prediction modules
- Backend APIs
  - Auth and profile
  - Health tracker, reminder, mood logs
  - GDM prediction and chatbot endpoints
  - PDF report endpoint
- AI Layer
  - Random Forest binary classifier (`Low Risk` / `High Risk`)
  - LLM-powered Q&A assistant with multilingual prompting
- Storage
  - SQL database for user and health data

