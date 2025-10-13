import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email e role são obrigatórios" },
        { status: 400 }
      );
    }

    const auth = getAdminAuth();

    // Busca o usuário pelo e-mail
    const user = await auth.getUserByEmail(email);

    // Define a role (ex: "admin" ou "user")
    await auth.setCustomUserClaims(user.uid, { role });

    return NextResponse.json({
      message: `Usuário ${email} agora é ${role}`,
    });
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Erro ao definir role";
    console.error("Erro ao definir role:", error);
    return NextResponse.json(
      { message: "Erro ao definir role", error: message },
      { status: 500 }
    );
  }
}
