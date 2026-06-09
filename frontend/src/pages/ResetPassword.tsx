import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError("");

      const code = searchParams.get("code");

      if (!code) {
        setError("Invalid reset link.");
        return;
      }

      await api.post("/auth/password/reset", {
        password: data.password,
        confirmPassword: data.confirmPassword,
        verificationCode: code,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid or expired reset link.",
      );
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border p-6 text-center shadow-sm">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-green-600">
            Password Reset Successfully
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
      </div>
    );
  }
  if (error && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Reset Failed</h1>

          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Create New Password</FieldLabel>
                <FieldContent>
                  <Input type="password" placeholder="********" {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Confirm New Password</FieldLabel>
                <FieldContent>
                  <Input type="password" placeholder="********" {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
