"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldError, PasswordField } from "@/components/auth/form-parts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";

export function SignInForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: false },
  });
  async function onSubmit(values: SignInValues) {
    setFormError("");
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (!result?.ok) return setFormError("We couldn't sign you in with those credentials.");
    router.push("/account");
    router.refresh();
  }
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        registration={register("password")}
        error={errors.password?.message}
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value === true)}
              />
              <Label htmlFor="remember" className="font-normal">
                Remember me
              </Label>
            </div>
          )}
        />
        <Link
          href="/forgot-password"
          className="font-semibold text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      {formError && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]"
      >
        {isSubmitting && (
          <LoaderCircle className="animate-spin motion-reduce:animate-none" />
        )}
        {isSubmitting ? "Signing in…" : "Sign In"}
      </Button>
      <div className="space-y-3 text-center text-sm text-muted-foreground">
        <p>
          New to Aurévia?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
        <Link
          href="/home"
          className="inline-block font-semibold text-primary hover:underline"
        >
          Continue as Guest
        </Link>
      </div>
    </form>
  );
}
