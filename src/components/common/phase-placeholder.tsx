import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

type PhasePlaceholderProps = {
  eyebrow: string
  title: string
  description: string
  backHref?: string
  backLabel?: string
}

function PhasePlaceholder({
  eyebrow,
  title,
  description,
  backHref = "/welcome",
  backLabel = "Back to welcome",
}: PhasePlaceholderProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-aurevia-plum px-6 py-12 text-center text-aurevia-ivory">
      <div className="max-w-xl">
        <Image
          src="/images/aurevia-logo.png"
          alt="Aurévia"
          width={2172}
          height={724}
          preload
          sizes="240px"
          className="mx-auto h-auto w-60 max-w-full"
        />
        <p className="text-eyebrow mt-10 text-aurevia-gold">{eyebrow}</p>
        <h1 className="text-heading-1 mt-3">{title}</h1>
        <p className="text-body mx-auto mt-5 max-w-lg text-aurevia-ivory/70">
          {description}
        </p>
        <Button asChild variant="luxury" size="lg" className="mt-8 text-aurevia-gold hover:text-aurevia-ivory">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </main>
  )
}

export { PhasePlaceholder }
