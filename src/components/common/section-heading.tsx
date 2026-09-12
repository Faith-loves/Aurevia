import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="text-eyebrow text-aurevia-gold">{eyebrow}</p>}
      <h2 className="text-heading-2 mt-2 text-primary">{title}</h2>
      {description && (
        <p className="text-body mt-4 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export { SectionHeading }
