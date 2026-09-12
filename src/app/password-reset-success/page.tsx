import { AuthShell } from "@/components/auth/auth-shell"
import { AuthSuccess } from "@/components/auth/auth-success"
export default function PasswordResetSuccessPage() { return <AuthShell eyebrow="Password updated" title="Your password has been reset." description=""><AuthSuccess body="You can now sign in to Aurévia using your new password." cta="Sign In" href="/sign-in" /></AuthShell> }
