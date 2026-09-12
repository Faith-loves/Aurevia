import { cn } from "@/lib/utils"

type PriceProps = {
  amount: number
  currency?: "NGN" | "USD"
  originalAmount?: number
  className?: string
}

function formatPrice(amount: number, currency: "NGN" | "USD") {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount)
}

function Price({
  amount,
  currency = "NGN",
  originalAmount,
  className,
}: PriceProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-semibold text-foreground">
        {formatPrice(amount, currency)}
      </span>
      {originalAmount !== undefined && originalAmount > amount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalAmount, currency)}
        </span>
      )}
    </span>
  )
}

export { Price }
