import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/schemas/register.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Create Account</h1>
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>

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
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>

          <Link
            to="/login"
            className="font-medium underline underline-offset-4"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
