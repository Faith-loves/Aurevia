"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { FieldError } from "@/components/auth/form-parts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestDevelopmentPasswordReset } from "@/lib/auth/development-auth"
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth"
export function ForgotPasswordForm() {
 const router=useRouter(); const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<ForgotPasswordValues>({resolver:zodResolver(forgotPasswordSchema),defaultValues:{email:""}})
 async function onSubmit(values:ForgotPasswordValues){await requestDevelopmentPasswordReset(values.email);router.push("/check-email")}
 return <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5"><div><Label htmlFor="email">Email address</Label><Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" className="mt-2" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email?"email-error":undefined} {...register("email")}/><FieldError id="email-error" message={errors.email?.message}/></div><Button type="submit" size="lg" disabled={isSubmitting} className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]">{isSubmitting&&<LoaderCircle className="animate-spin motion-reduce:animate-none"/>}{isSubmitting?"Sending…":"Send Reset Link"}</Button><p className="text-center text-sm"><Link href="/sign-in" className="font-semibold text-primary hover:underline">← Back to Sign In</Link></p></form>
}
