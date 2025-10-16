import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar mínimos de faturação
export async function GET() {
  try {
    const configuracao = await prisma.configuracao.findFirst({
      include: {
        minimos: true,
      },
    })

    if (!configuracao) {
      return NextResponse.json([])
    }

    return NextResponse.json(configuracao.minimos)
  } catch (error) {
    console.error("Erro ao buscar mínimos de faturação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar novo mínimo de faturação
export async function POST(request: NextRequest) {
  try {
    const { tipo, valor } = await request.json()

    if (!tipo || typeof valor !== "number" || valor < 0) {
      return NextResponse.json(
        { error: "Tipo e valor são obrigatórios. Valor deve ser um número positivo." },
        { status: 400 }
      )
    }

    // Buscar ou criar configuração
    let configuracao = await prisma.configuracao.findFirst()
    if (!configuracao) {
      configuracao = await prisma.configuracao.create({
        data: { margemPadrao: 100 },
      })
    }

    // Verificar se já existe mínimo para este tipo
    const minimoExistente = await prisma.minimoFaturacao.findFirst({
      where: {
        tipo,
        configuracaoId: configuracao.id,
      },
    })

    if (minimoExistente) {
      return NextResponse.json(
        { error: "Já existe um mínimo configurado para este tipo" },
        { status: 400 }
      )
    }

    const novoMinimo = await prisma.minimoFaturacao.create({
      data: {
        tipo,
        valor,
        configuracaoId: configuracao.id,
      },
    })

    return NextResponse.json(novoMinimo)
  } catch (error) {
    console.error("Erro ao criar mínimo de faturação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar mínimo de faturação
export async function PUT(request: NextRequest) {
  try {
    const { id, tipo, valor } = await request.json()

    if (!id || !tipo || typeof valor !== "number" || valor < 0) {
      return NextResponse.json(
        { error: "ID, tipo e valor são obrigatórios. Valor deve ser um número positivo." },
        { status: 400 }
      )
    }

    const minimoAtualizado = await prisma.minimoFaturacao.update({
      where: { id },
      data: { tipo, valor },
    })

    return NextResponse.json(minimoAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar mínimo de faturação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Remover mínimo de faturação
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      )
    }

    await prisma.minimoFaturacao.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: "Mínimo removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover mínimo de faturação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
