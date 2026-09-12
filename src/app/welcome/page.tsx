import { ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function WelcomePage() {
  return (
    <AuthShell
      eyebrow="Welcome to Aurévia"
      title="Your fragrance journey starts here."
      description="Create an account for a more personalized experience, sign in if you already have one, or continue exploring as a guest."
    >
      <div className="max-w-md space-y-3">
        <Button asChild size="lg" className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]">
          <Link href="/create-account">Create Account</Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="h-14 w-full">
          <Link href="/sign-in">Sign In</Link>
        </Button>

        <div className="flex items-center gap-4 py-3" aria-hidden="true">
          <Separator className="min-w-0 flex-1" />
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">or</span>
          <Separator className="min-w-0 flex-1" />
        </div>

        <Button asChild size="lg" variant="luxury" className="group h-14 w-full text-primary">
          <Link href="/home">
            Continue as Guest
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>

        <p className="flex items-start gap-2 pt-4 text-sm leading-6 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-aurevia-gold" />
          Create an account to save favorites, keep your scent profile, and view your orders anytime.
        </p>
      </div>
    </AuthShell>
  )
}
