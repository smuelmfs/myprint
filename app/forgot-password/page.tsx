"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao enviar link de redefinição")
        setLoading(false)
        return
      }

      setSuccess("Link de redefinição de senha enviado! Verifique seu email.")
    } catch {
      setError("Erro inesperado, tente novamente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            MYPRINT<span className="text-blue-600">.pt</span>
          </h1>
          <p className="text-sm text-slate-600">Redefinir sua senha</p>
        </div>

        <Card className="border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Esqueceu a senha?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Digite seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-slate-300 pl-10 focus-visible:ring-blue-600"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-label="Email"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-blue-600 text-base font-medium hover:bg-blue-700 focus-visible:ring-blue-600"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Enviando..." : "Enviar Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              disabled={loading}
            >
              Voltar para login
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
