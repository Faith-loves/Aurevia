import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
export default function ForgotPasswordPage() { return <AuthShell eyebrow="Account recovery" title="Forgot your password?" description="Enter the email associated with your Aurévia account and we'll send you instructions to reset your password."><ForgotPasswordForm /></AuthShell> }
