import { cn } from "@/lib/utils"

type LoaderProps = {
  label?: string
  className?: string
}

function Loader({ label = "Loading", className }: LoaderProps) {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span aria-hidden="true" className="flex h-5 items-end gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-2 w-1 rounded-full bg-aurevia-gold motion-safe:animate-[pulse_1.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${index * 180}ms` }}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Loader }
