import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";


export default function HomePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      {!user?.verified && (
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <h3 className="font-semibold text-yellow-800">
            Email Verification Required
          </h3>

          <p className="mt-1 text-sm text-yellow-700">
            A verification email has been sent to your email address. Please
            verify your email to access all features of your account.
          </p>

         

  
        </div>
      )}
      <div className="rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Account Details</h2>

        <div className="space-y-3">
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>

          <p>
            <span className="font-medium">Verified:</span>{" "}
            {user?.verified ? "Yes ✅" : "No ❌"}
          </p>

          <p>
            <span className="font-medium">User ID:</span> {user?._id}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link to="/sessions">Manage Sessions</Link>
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
