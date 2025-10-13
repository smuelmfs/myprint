export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import cookie from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });

    const auth = getAdminAuth();
    const userRecord = await auth.createUser({ email, password });

    await auth.setCustomUserClaims(userRecord.uid, { role: "user" });

    const token = await auth.createCustomToken(userRecord.uid);

    const res = NextResponse.json({ role: "user" });
    res.headers.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res;
  } catch (error: unknown) {
    let message = "Erro ao criar usuário";
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;
    if (code === "auth/email-already-exists") message = "Email já cadastrado";
    return NextResponse.json({ message }, { status: 400 });
  }
}
