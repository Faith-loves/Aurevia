import { cn } from "@/lib/utils"

const sizeClasses = {
  sm: { mark: "size-8", wordmark: "text-xl" },
  md: { mark: "size-10", wordmark: "text-2xl" },
  lg: { mark: "size-14", wordmark: "text-4xl" },
}

type LogoProps = {
  variant?: "full" | "mark"
  size?: "sm" | "md" | "lg"
  tone?: "default" | "light"
  className?: string
}

function Logo({
  variant = "full",
  size = "md",
  tone = "default",
  className,
}: LogoProps) {
  const color = tone === "light" ? "text-aurevia-ivory" : "text-primary"
  const mark = (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-current font-display text-lg font-semibold",
        sizeClasses[size].mark,
        color
      )}
    >
      A
      <span className="absolute -bottom-px left-1/2 size-1.5 -translate-x-1/2 rotate-45 rounded-tl-full bg-aurevia-gold" />
    </span>
  )

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex", className)} aria-label="Aurévia">
        {mark}
      </span>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center gap-3", color, className)}
      aria-label="Aurévia"
    >
      {mark}
      <span
        className={cn(
          "font-display font-semibold tracking-[0.08em] leading-none",
          sizeClasses[size].wordmark
        )}
      >
        AURÉVIA
      </span>
    </span>
  )
}

export { Logo }
export type { LogoProps }
