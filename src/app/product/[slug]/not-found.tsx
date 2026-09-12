import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function ProductNotFound(){return <main className="flex min-h-dvh items-center justify-center bg-aurevia-ivory px-6 text-center"><div><p className="text-eyebrow text-aurevia-gold">Lost note</p><h1 className="text-display mt-3 text-primary">This fragrance couldn&apos;t be found.</h1><Button asChild className="mt-7"><Link href="/shop">Explore the Collection</Link></Button></div></main>}
