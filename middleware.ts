export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import cookie from "cookie";

export async function middleware(req: NextRequest) {
  const cookies = req.headers.get("cookie") || "";
  const { token } = cookie.parse(cookies);
  const { pathname } = req.nextUrl;
  const auth = getAdminAuth();

  const publicRoutes = ["/login", "/signup", "/forgot-password", "/_next", "/api"];
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // Se não há token
  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    const role = decoded.role || "user";

    // Se usuário logado tenta acessar login/signup
    if (isPublic && (pathname === "/login" || pathname === "/signup")) {
      const redirectUrl = role === "admin" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Controle de roles
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (pathname.startsWith("/dashboard") && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    // Cookie inválido → limpa
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
      sameSite: "none",
    });
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
