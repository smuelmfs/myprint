"use client"

import { toast } from "sonner"

type AppToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  function showToast(options: AppToastOptions) {
    const { title, description, variant } = options
    const message = title ?? description ?? ""
    const opts = description ? { description } : undefined
    if (variant === "destructive") {
      return toast.error(message, opts as any)
    }
    return toast(message, opts as any)
  }

  return {
    toast: showToast,
    dismiss: toast.dismiss,
  }
}

export type UseToastReturn = ReturnType<typeof useToast>


