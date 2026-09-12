import Image from "next/image"
import type { ReactNode } from "react"

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-dvh overflow-x-clip bg-aurevia-ivory lg:grid lg:grid-cols-[42%_58%]">
      <aside className="relative hidden overflow-hidden bg-aurevia-plum p-12 text-aurevia-ivory lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Image
          src="/images/aurevia-onboarding-three.png"
          alt=""
          fill
          priority
          sizes="42vw"
          className="object-cover object-left"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-aurevia-plum/35 via-transparent to-aurevia-plum/55" />
        <div
          aria-hidden="true"
          className="absolute -left-36 -top-36 size-96 rounded-full border border-aurevia-rose/20"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -right-32 size-[30rem] rounded-full border border-aurevia-gold/20"
        />
        <Image
          src="/images/aurevia-logo.png"
          alt="Aurévia"
          width={2172}
          height={724}
          preload
          sizes="220px"
          className="relative h-auto w-52"
        />
        <div className="relative max-w-sm">
          <p className="text-eyebrow text-aurevia-gold">A personal ritual</p>
          <p className="mt-4 font-display text-4xl leading-tight">
            Fragrance discovery, made beautifully yours.
          </p>
        </div>
      </aside>

      <section className="flex min-h-dvh min-w-0 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-20">
        <div className="w-full min-w-0 max-w-xl">
          <Image
            src="/images/aurevia-logo.png"
            alt="Aurévia"
            width={2172}
            height={724}
            preload
            sizes="160px"
            className="mb-10 h-auto w-36 lg:hidden"
          />
          <p className="text-eyebrow text-aurevia-gold">{eyebrow}</p>
          <h1 className="text-heading-1 mt-3 text-primary">{title}</h1>
          <p className="text-body mt-4 max-w-lg text-muted-foreground">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}

export { AuthShell }
