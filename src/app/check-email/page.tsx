import { AuthShell } from "@/components/auth/auth-shell"
import { CheckEmail } from "@/components/auth/check-email"
export default function CheckEmailPage() { return <AuthShell eyebrow="Check your inbox" title="Reset link sent" description="If an Aurévia account exists for that email, we've sent password reset instructions."><CheckEmail /></AuthShell> }
