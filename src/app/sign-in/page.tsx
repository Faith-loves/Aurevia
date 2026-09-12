import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to Aurévia" description="Access your saved fragrances, scent profile, orders, and personalized recommendations.">
      <SignInForm />
    </AuthShell>
  )
}
