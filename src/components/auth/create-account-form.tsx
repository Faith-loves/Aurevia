"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createAccountSchema,
  type CreateAccountValues,
} from "@/lib/validations/auth"

const VERIFICATION_EMAIL_KEY = "aurevia-verification-email"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  )
}

function CreateAccountForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  async function onSubmit(values: CreateAccountValues) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!response.ok) return

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    if (!result?.ok) return
    router.push("/account")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-5 overflow-x-clip">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Enter your full name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className="mt-2"
          {...register("fullName")}
        />
        <FieldError id="fullName-error" message={errors.fullName?.message} />
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-2"
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-guidance password-error"
              className="pr-12"
              {...register("password")}
            />
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-0.5 top-0.5 size-11 text-muted-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </IconButton>
          </div>
          <p id="password-guidance" className="mt-1.5 text-xs text-muted-foreground">
            Use at least 8 characters.
          </p>
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

        <div className="min-w-0">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative mt-2">
            <Input
              id="confirmPassword"
              type={showConfirmation ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              className="pr-12"
              {...register("confirmPassword")}
            />
            <IconButton
              aria-label={showConfirmation ? "Hide confirmed password" : "Show confirmed password"}
              onClick={() => setShowConfirmation((visible) => !visible)}
              className="absolute right-0.5 top-0.5 size-11 text-muted-foreground"
            >
              {showConfirmation ? <EyeOff /> : <Eye />}
            </IconButton>
          </div>
          <FieldError
            id="confirmPassword-error"
            message={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <Controller
        name="terms"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={Boolean(errors.terms)}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                className="mt-0.5 size-5"
              />
              <Label htmlFor="terms" className="block leading-6 font-normal">
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-primary underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-primary underline underline-offset-4">
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>
            <FieldError id="terms-error" message={errors.terms?.message} />
          </div>
        )}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]"
      >
        {isSubmitting && <LoaderCircle className="animate-spin motion-reduce:animate-none" />}
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>

      <div className="flex min-w-0 flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Link href="/welcome" className="text-muted-foreground hover:text-primary hover:underline">
          ← Back to welcome
        </Link>
        <span className="min-w-0 text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  )
}

export { CreateAccountForm, VERIFICATION_EMAIL_KEY }
