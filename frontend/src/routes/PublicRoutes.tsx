import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute() {
  const { user } = useAuth();
  const location = useLocation();

  const allowedPaths = ["/password/reset"];

  const isVerificationPage = location.pathname.startsWith("/email/verify/");

  const isAllowedPage =
    allowedPaths.includes(location.pathname) || isVerificationPage;

  if (user && !isAllowedPage) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
