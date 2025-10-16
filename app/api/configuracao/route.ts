import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar configurações
export async function GET() {
  try {
    const configuracao = await prisma.configuracao.findFirst({
      include: {
        margensCategoria: true,
        minimos: true,
        temposPadrao: true,
      },
    })

    if (!configuracao) {
      // Se não existir configuração, criar uma padrão
      const novaConfiguracao = await prisma.configuracao.create({
        data: {
          margemPadrao: 100,
        },
        include: {
          margensCategoria: true,
          minimos: true,
          temposPadrao: true,
        },
      })
      return NextResponse.json(novaConfiguracao)
    }

    return NextResponse.json(configuracao)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar margem padrão
export async function PUT(request: NextRequest) {
  try {
    const { margemPadrao } = await request.json()

    if (typeof margemPadrao !== "number" || margemPadrao < 0) {
      return NextResponse.json(
        { error: "Margem padrão deve ser um número positivo" },
        { status: 400 }
      )
    }

    let configuracao = await prisma.configuracao.findFirst()

    if (!configuracao) {
      configuracao = await prisma.configuracao.create({
        data: { margemPadrao },
      })
    } else {
      configuracao = await prisma.configuracao.update({
        where: { id: configuracao.id },
        data: { margemPadrao },
      })
    }

    return NextResponse.json(configuracao)
  } catch (error) {
    console.error("Erro ao atualizar margem padrão:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
