import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Firebase REST API login
    const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY!;
    const firebaseRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await firebaseRes.json();
    if (data.error) {
      return NextResponse.json({ message: data.error.message || "Credenciais inválidas" }, { status: 400 });
    }

    // Pega role do usuário
    const auth = getAdminAuth();
    const user = await auth.getUserByEmail(email);
    const role = user.customClaims?.role || "user";

    // Retorna cookie httpOnly e role no JSON
    const res = NextResponse.json({ role });
    res.cookies.set({
      name: "token",
      value: data.idToken,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: "none",
    });

    return res;
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ message: "Erro inesperado ao fazer login" }, { status: 400 });
  }
}
