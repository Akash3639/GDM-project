import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./api";
import AppLayout from "./components/AppLayout";
import AuthPage from "./pages/AuthPage";
import ChatbotPage from "./pages/ChatbotPage";
import DashboardPage from "./pages/DashboardPage";
import EducationPage from "./pages/EducationPage";
import ExtrasPage from "./pages/ExtrasPage";
import HospitalsPage from "./pages/HospitalsPage";
import LifestylePage from "./pages/LifestylePage";
import PredictionPage from "./pages/PredictionPage";
import TrackerPage from "./pages/TrackerPage";

function ProtectedRoute({ children }) {
  if (!getToken()) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="tracker" element={<TrackerPage />} />
        <Route path="lifestyle" element={<LifestylePage />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="extras" element={<ExtrasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
