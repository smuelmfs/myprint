"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, XCircle, Info, CheckCircle } from "lucide-react"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "error" | "warning" | "info" | "success"
  showRetry?: boolean
  onRetry?: () => void
}

export function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
  showRetry = false,
  onRetry,
}: ErrorModalProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getTitleColor = () => {
    switch (type) {
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      default:
        return "text-red-600"
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className={`text-lg font-semibold ${getTitleColor()}`}>
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          {showRetry && onRetry && (
            <AlertDialogAction
              onClick={onRetry}
              className="bg-primary hover:bg-primary/90"
            >
              Tentar Novamente
            </AlertDialogAction>
          )}
          <AlertDialogCancel onClick={onClose}>
            {type === "error" ? "Entendi" : "Fechar"}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
