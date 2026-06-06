import z from "zod";

export const emailSchema = z.string().email().min(5).max(255);
const passwordSchema = z.string().min(6).max(1024);

type PasswordType = z.infer<typeof passwordSchema>;
const matchPassword = ({
  password,
  confirmPassword,
}: {
  password: PasswordType;
  confirmPassword: PasswordType;
}) => password === confirmPassword;

const matchPasswordOptions = {
  message: "Passwords do not match",
  path: ["confirmPassword"],
};
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine(matchPassword, matchPasswordOptions);

export const verificationCodeSchema = z.string().min(1).max(55);

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    verificationCode: verificationCodeSchema,
  })
  .refine(matchPassword, matchPasswordOptions);
