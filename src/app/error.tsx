"use client"
import Link from "next/link"
import {Button} from "@/components/ui/button"
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="flex min-h-screen items-center justify-center bg-aurevia-cream px-6 text-center"><div><p className="text-eyebrow text-aurevia-gold">Aurévia</p><h1 className="text-display mt-3 text-primary">Something went wrong.</h1><p className="mt-5 text-lg text-muted-foreground">We couldn&apos;t load this part of Aurévia.</p><div className="mt-8 flex justify-center gap-3"><Button onClick={reset}>Try Again</Button><Button asChild variant="outline"><Link href="/home">Go Home</Link></Button></div></div></main>}
