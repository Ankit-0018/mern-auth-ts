import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { api } from "@/lib/axios";

export default function VerifyEmail() {
  const { code } = useParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!code) {
        setSuccess(false);
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/auth/email/verify/${code}`);

        setSuccess(true);
        setMessage(
          data.message || "Your email has been verified successfully.",
        );
      } catch (error: any) {
        setSuccess(false);
        setMessage(
          error?.response?.data?.message ||
            "Failed to verify your email. The link may be invalid or expired.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        {loading ? (
          <>
            <Loader2 className="mx-auto mb-4 h-14 w-14 animate-spin" />
            <h1 className="text-2xl font-semibold">Verifying Email</h1>
            <p className="mt-2 text-muted-foreground">
              Please wait while we verify your account.
            </p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-semibold text-green-600">
              Email Verified 🎉
            </h1>
            <p className="mt-2 text-muted-foreground">{message}</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-semibold text-red-600">
              Verification Failed
            </h1>
            <p className="mt-2 text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
