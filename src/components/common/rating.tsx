import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

type RatingProps = {
  rating: number
  reviewCount?: number
  size?: "sm" | "md"
  className?: string
}

function Rating({ rating, reviewCount, size = "md", className }: RatingProps) {
  const normalizedRating = Math.min(5, Math.max(0, rating))
  const iconSize = size === "sm" ? "size-3.5" : "size-4"

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`${normalizedRating.toFixed(1)} out of 5 stars${reviewCount !== undefined ? `, ${reviewCount} reviews` : ""}`}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              iconSize,
              index < Math.round(normalizedRating)
                ? "fill-aurevia-gold text-aurevia-gold"
                : "fill-transparent text-border"
            )}
          />
        ))}
      </span>
      {reviewCount !== undefined && (
        <span className="text-caption text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  )
}

export { Rating }
