"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSyncExternalStore } from "react"
import { useForm } from "react-hook-form"
import { PasswordField } from "@/components/auth/form-parts"
import { Button } from "@/components/ui/button"
import { RESET_REQUEST_KEY, completeDevelopmentPasswordReset } from "@/lib/auth/development-auth"
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth"
const subscribe=()=>()=>undefined;const serverSnapshot=()=>false;const snapshot=()=>window.sessionStorage.getItem(RESET_REQUEST_KEY)==="true"
export function ResetPasswordForm(){const valid=useSyncExternalStore(subscribe,snapshot,serverSnapshot);const router=useRouter();const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<ResetPasswordValues>({resolver:zodResolver(resetPasswordSchema),defaultValues:{password:"",confirmPassword:""}})
 async function onSubmit(){await completeDevelopmentPasswordReset();router.push("/password-reset-success")}
 if(!valid)return <div role="status" className="rounded-xl border border-border bg-aurevia-cream p-5"><p className="font-medium text-primary">This reset link is missing or has expired.</p><p className="mt-2 text-sm text-muted-foreground">Request a new link to continue securely.</p><Button asChild className="mt-5"><Link href="/forgot-password">Request a new link</Link></Button></div>
 return <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5"><PasswordField id="password" label="New password" placeholder="Create a new password" autoComplete="new-password" registration={register("password")} error={errors.password?.message}/><PasswordField id="confirmPassword" label="Confirm new password" placeholder="Repeat your new password" autoComplete="new-password" registration={register("confirmPassword")} error={errors.confirmPassword?.message}/><Button type="submit" size="lg" disabled={isSubmitting} className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]">{isSubmitting&&<LoaderCircle className="animate-spin motion-reduce:animate-none"/>}{isSubmitting?"Resetting…":"Reset Password"}</Button></form>}
