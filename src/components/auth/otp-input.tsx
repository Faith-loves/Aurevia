"use client"

import { cn } from "@/lib/utils"

type OtpInputProps = {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  disabled?: boolean
}

function OtpInput({ value, onChange, invalid, disabled }: OtpInputProps) {
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "")

  return (
    <div className="group relative">
      <label htmlFor="verification-code" className="sr-only">
        Six-digit verification code
      </label>
      <input
        id="verification-code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        disabled={disabled}
        autoComplete="one-time-code"
        aria-invalid={invalid}
        aria-describedby={invalid ? "verification-error" : undefined}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
      />
      <div aria-hidden="true" className="grid grid-cols-6 gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <span
            key={index}
            className={cn(
              "flex aspect-square min-w-0 items-center justify-center rounded-md border border-input bg-white text-xl font-semibold text-foreground transition-colors group-focus-within:ring-2 group-focus-within:ring-aurevia-gold/20",
              index === Math.min(value.length, 5) &&
                value.length < 6 &&
                "group-focus-within:border-aurevia-gold",
              invalid && "border-destructive ring-2 ring-destructive/15",
              disabled && "opacity-50"
            )}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  )
}

export { OtpInput }
