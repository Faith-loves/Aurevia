import { Check } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

function AuthSuccess({ body, cta, href }: { body: string; cta: string; href: string }) {
  return (
    <div>
      <div aria-hidden="true" className="flex size-14 items-center justify-center rounded-full border border-aurevia-gold/50 bg-aurevia-gold/10 text-aurevia-plum">
        <Check className="size-6" />
      </div>
      <p className="text-body mt-6 text-muted-foreground">{body}</p>
      <Button asChild size="lg" className="mt-8 h-14 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d]">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  )
}

export { AuthSuccess }
