import { AuthShell } from "@/components/auth/auth-shell"
import { CreateAccountForm } from "@/components/auth/create-account-form"

export default function CreateAccountPage() {
  return (
    <AuthShell
      eyebrow="Join Aurévia"
      title="Create your account"
      description="Save your favorites, keep your scent profile, track your orders, and enjoy a more personal fragrance experience."
    >
      <CreateAccountForm />
    </AuthShell>
  )
}
