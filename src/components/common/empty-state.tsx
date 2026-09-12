import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {icon && (
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-heading-4 text-primary">{title}</h3>
      {description && (
        <p className="text-body-sm mt-2 max-w-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { EmptyState }
