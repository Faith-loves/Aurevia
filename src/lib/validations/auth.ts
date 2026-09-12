import { z } from "zod"

const createAccountSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(80, "Name must be 80 characters or fewer."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    terms: z.boolean().refine((accepted) => accepted, {
      message: "Accept the Terms of Service and Privacy Policy to continue.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type CreateAccountValues = z.infer<typeof createAccountSchema>

const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean(),
})

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
})

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type SignInValues = z.infer<typeof signInSchema>
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export { createAccountSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema }
export type { CreateAccountValues, ForgotPasswordValues, ResetPasswordValues, SignInValues }
