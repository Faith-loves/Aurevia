import { AuthShell } from "@/components/auth/auth-shell"
import { EmailVerification } from "@/components/auth/email-verification"

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="One last step"
      title="Verify your email"
      description="We sent a 6-digit verification code to your email address. Enter it below to confirm your account."
    >
      <div className="max-w-md">
        <EmailVerification />
      </div>
    </AuthShell>
  )
}
