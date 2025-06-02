// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/dashboard";
import HistoryPage from "./components/HistoryPage";
import Navbar from "./components/Navbar";
import QuizPage from "./components/QuizPage";
import SignupPage from "./components/SignupPage";
import AdminDashboard from "./components/AdminDashboard";
import AddQuiz from "./components/AddQuiz";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/form", "/login", "/signup", "/admin", "/unauthorized", "/add-quiz"];
const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) || location.pathname.startsWith("/quiz/");


  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route
  path="/admin"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/add-quiz"
  element={
    <ProtectedRoute role="ADMIN">
      <AddQuiz />
    </ProtectedRoute>
  }
/>
<Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
