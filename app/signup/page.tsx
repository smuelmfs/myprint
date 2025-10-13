"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Mail, Lock } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "", color: "" }
    let strength = 0
    if (pass.length >= 8) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^a-zA-Z0-9]/.test(pass)) strength++

    const labels = ["Fraca", "Média", "Boa", "Forte"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
    return { strength, label: labels[strength - 1] || "", color: colors[strength - 1] || "" }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (email !== confirmEmail) {
      setError("Os emails não coincidem")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao criar conta")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      router.push("/dashboard")
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            MYPRINT<span className="text-blue-600">.pt</span>
          </h1>
          <p className="mt-2 text-balance text-sm text-slate-600">Crie sua conta para começar</p>
        </div>

        <Card className="border-slate-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus-visible:ring-blue-600"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-label="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmEmail" className="text-sm font-medium text-slate-700">
                Confirmar Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmEmail"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus-visible:ring-blue-600"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-label="Confirmar email"
                />
              </div>
              {confirmEmail && (
                <div className="flex items-center gap-1.5">
                  {email === confirmEmail ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">Os emails coincidem</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-red-600 font-medium">Os emails não coincidem</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-slate-300 focus-visible:ring-blue-600"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  aria-label="Senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength ? passwordStrength.color : "bg-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs text-slate-600">
                      Força da senha: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-slate-300 focus-visible:ring-blue-600"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  aria-label="Confirmar senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-1.5">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">As senhas coincidem</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-red-600 font-medium">As senhas não coincidem</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-blue-600 text-base font-medium hover:bg-blue-700 focus-visible:ring-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
                disabled={loading}
              >
                Fazer login
              </button>
            </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="/terms" className="underline hover:text-slate-700">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="/privacy" className="underline hover:text-slate-700">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  )
}
