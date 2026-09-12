"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} role="alert" className="mt-1.5 text-sm text-destructive">{message}</p>
}

type PasswordFieldProps = {
  id: string
  label: string
  placeholder: string
  autoComplete: "current-password" | "new-password"
  registration: UseFormRegisterReturn
  error?: string
}

function PasswordField({ id, label, placeholder, autoComplete, registration, error }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2">
        <Input id={id} type={visible ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder}
          aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="pr-12" {...registration} />
        <IconButton type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((value) => !value)} className="absolute right-0.5 top-0.5 size-11 text-muted-foreground">
          {visible ? <EyeOff /> : <Eye />}
        </IconButton>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export { FieldError, PasswordField }
