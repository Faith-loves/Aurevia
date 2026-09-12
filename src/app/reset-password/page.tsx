import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
export default function ResetPasswordPage(){return <AuthShell eyebrow="Account recovery" title="Create a new password" description="Choose a new password for your Aurévia account."><ResetPasswordForm/></AuthShell>}
