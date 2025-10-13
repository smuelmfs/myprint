"use client"

import { toast } from "sonner"

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  }
}

export type UseToastReturn = ReturnType<typeof useToast>


