import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import z from "zod";

import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await api.post("/auth/password/forgot", {
        email: data.email,
      });
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>

        <p className="text-muted-foreground mb-6 text-sm">
          Enter your email and we'll send you a reset link.
        </p>
        {emailSent ? (
          <div className="space-y-4">
            <p className="text-center text-sm">
              Password reset instructions have been sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>

                  <FieldContent>
                    <Input placeholder="john@example.com" {...field} />

                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center text-sm">
          <Link
            to="/login"
            className="font-medium underline underline-offset-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
