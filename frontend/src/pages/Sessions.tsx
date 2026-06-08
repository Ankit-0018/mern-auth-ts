import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button";

type Session = {
  _id: string;
  userAgent: string;
  createdAt: string;
  isCurrent?: boolean;
};

export default function SessionPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fetchSessions = async () => {
    try {
      const { data } = await api.get("/sessions");
      setSessions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setError("");
      setDeletingId(id);
      

      const res = await api.delete(`/sessions/${id}`);
      console.log(res)

      setSessions((prev) => prev.filter((session) => session._id !== id));
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Failed to delete session. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Active Sessions</h1>

      <p className="mb-8 text-muted-foreground">
        Manage devices where your account is currently signed in.
      </p>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session._id} className="rounded-lg border p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-medium">
                  {session.isCurrent ? "Current Session" : "Active Session"}
                </h2>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {session.userAgent}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Signed in on {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>

              {!session.isCurrent && (
                <Button
                  variant="destructive"
                  disabled={deletingId === session._id}
                  onClick={() => handleDelete(session._id)}
                >
                  {deletingId === session._id ? "Removing..." : "Sign Out"}
                </Button>
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {sessions.length === 0 && (
          <div className="rounded-lg border p-6 text-center">
            No active sessions found.
          </div>
        )}
      </div>
    </div>
  );
}
