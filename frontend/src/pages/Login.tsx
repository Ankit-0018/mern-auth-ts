import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "@/lib/schemas/login.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

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

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>

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
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Forgot Password?
          </Link>

          <Link
            to="/register"
            className="font-medium underline underline-offset-4"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
