import { AuthShell } from "@/components/auth/auth-shell"
import { AuthSuccess } from "@/components/auth/auth-success"
export default function AccountCreatedPage() { return <AuthShell eyebrow="Welcome in" title="Your Aurévia account is ready." description=""><AuthSuccess body="Your account has been created successfully. You can now save your favorite fragrances, keep your scent profile, and enjoy a more personal shopping experience." cta="Continue" href="/home" /></AuthShell> }
