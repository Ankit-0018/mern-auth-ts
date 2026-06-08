import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "@/pages/HomePage";
import ForgotPasswordPage from "@/pages/ForgotPassword";
import PublicRoute from "./PublicRoutes";
import VerifyEmail from "@/pages/VerifyEmail";
import ResetPassword from "@/pages/ResetPassword";
import SessionPage from "@/pages/Sessions";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/email/verify/:code" element={<VerifyEmail />} />
        <Route path="/password/reset" element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/sessions" element={<SessionPage />} />
      </Route>
    </Routes>
  );
}
