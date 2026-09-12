"use client"

import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"

import { OtpInput } from "@/components/auth/otp-input"
import { Button } from "@/components/ui/button"
import { VERIFICATION_EMAIL_KEY } from "@/components/auth/create-account-form"
import { useAccountStore } from "@/store/account-store"

function maskEmail(email: string) {
  const [name, domain] = email.split("@")
  if (!name || !domain) return "your email address"
  return `${name.slice(0, 1)}${"*".repeat(Math.min(Math.max(name.length - 1, 1), 4))}@${domain}`
}

const subscribeToSessionStorage = () => () => undefined
const getServerEmailSnapshot = () => ""
const getEmailSnapshot = () =>
  window.sessionStorage.getItem(VERIFICATION_EMAIL_KEY) ?? ""

function EmailVerification() {
  const email = useSyncExternalStore(
    subscribeToSessionStorage,
    getEmailSnapshot,
    getServerEmailSnapshot
  )
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const signIn = useAccountStore((state) => state.signIn)
  const [cooldown, setCooldown] = useState(30)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(
      () => setCooldown((seconds) => Math.max(seconds - 1, 0)),
      1000
    )
    return () => window.clearInterval(timer)
  }, [cooldown])

  async function verify() {
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the complete 6-digit verification code.")
      return
    }

    setError("")
    setIsVerifying(true)
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    setIsVerifying(false)
    signIn(email)
    router.push("/account-created")
  }

  function resend() {
    setCooldown(30)
    setCode("")
    setError("")
  }

  if (!email) {
    return (
      <div role="status" className="rounded-xl border border-border bg-aurevia-cream p-5">
        <p className="font-medium text-primary">We don&apos;t have an email to verify yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">Create your account first and we&apos;ll send a verification code.</p>
        <Button asChild className="mt-5"><Link href="/create-account">Create Account</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Code sent to <span className="font-medium text-foreground">{maskEmail(email)}</span>
      </p>

      <OtpInput
        value={code}
        onChange={(nextCode) => {
          setCode(nextCode)
          if (error) setError("")
        }}
        invalid={Boolean(error)}
        disabled={isVerifying}
      />
      {error && (
        <p id="verification-error" role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="lg"
        onClick={verify}
        disabled={isVerifying}
        className="mt-7 h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]"
      >
        {isVerifying && <LoaderCircle className="animate-spin motion-reduce:animate-none" />}
        {isVerifying ? "Verifying…" : "Verify Account"}
      </Button>

      <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
        <p>
          Didn&apos;t receive a code?{" "}
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={resend}
              className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Resend code
            </button>
          )}
        </p>
        <Link href="/create-account" className="inline-block font-medium text-primary hover:underline">
          Use a different email
        </Link>
      </div>
    </div>
  )
}

export { EmailVerification }
