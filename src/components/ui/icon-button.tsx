import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function IconButton({
  className,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & {
  "aria-label": string
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={ariaLabel}
      className={cn("rounded-full", className)}
      {...props}
    />
  )
}

export { IconButton }
