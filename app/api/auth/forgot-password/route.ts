export const runtime = "nodejs";

import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/firebaseAdmin"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email é obrigatório" }, { status: 400 })
    }

    const auth = getAdminAuth()
    const link = await auth.generatePasswordResetLink(email, {
      url: "https://myprint.pt/login", // URL para redirecionar após redefinir
      handleCodeInApp: true,
    })

    // AQUI você pode futuramente integrar um SendGrid, Resend, etc.
    // Por enquanto, só retorna o link no response (para debug)
    return NextResponse.json({ success: true, resetLink: link })
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Erro ao enviar link de redefinição";
    console.error("Erro ao enviar redefinição:", error)
    return NextResponse.json({ message }, { status: 500 })
  }
}
