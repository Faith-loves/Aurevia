"use client"
import Link from "next/link"
import { useEffect, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { RESET_EMAIL_KEY } from "@/lib/auth/development-auth"
const subscribe=()=>()=>undefined; const serverSnapshot=()=>""; const snapshot=()=>window.sessionStorage.getItem(RESET_EMAIL_KEY)??""
function mask(email:string){const [name,domain]=email.split("@");return name&&domain?`${name[0]}${"*".repeat(Math.min(Math.max(name.length-1,1),4))}@${domain}`:""}
export function CheckEmail(){const email=useSyncExternalStore(subscribe,snapshot,serverSnapshot);const [cooldown,setCooldown]=useState(30);const [sent,setSent]=useState(false)
 useEffect(()=>{if(cooldown<=0)return;const id=window.setInterval(()=>setCooldown(v=>Math.max(v-1,0)),1000);return()=>window.clearInterval(id)},[cooldown])
 function resend(){setCooldown(30);setSent(true)}
 return <div className="space-y-6">{email&&<p className="text-sm text-muted-foreground">Sent to <span className="font-medium text-foreground">{mask(email)}</span></p>}<div aria-live="polite" className="text-sm text-muted-foreground">{sent&&<p className="mb-2 text-success">Instructions sent again.</p>}<p>Didn&apos;t receive it? {cooldown>0?<span>Resend in {cooldown}s</span>:<button type="button" onClick={resend} className="font-semibold text-primary hover:underline">Send again</button>}</p></div>
 {process.env.NODE_ENV === "development" && <Button asChild size="lg" className="h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]"><Link href="/reset-password">Continue to Reset Password</Link></Button>}
 <p className="text-center text-sm"><Link href="/sign-in" className="font-semibold text-primary hover:underline">Back to Sign In</Link></p></div>}
