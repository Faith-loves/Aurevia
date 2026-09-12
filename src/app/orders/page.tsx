import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function OrdersPlaceholder(){return <main className="flex min-h-dvh items-center justify-center bg-aurevia-ivory px-6 text-center"><div><p className="text-eyebrow text-aurevia-gold">Account</p><h1 className="text-display mt-3 text-primary">Order history is coming soon.</h1><Button asChild className="mt-7"><Link href="/shop">Continue Shopping</Link></Button></div></main>}
