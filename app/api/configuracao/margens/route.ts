import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar margens por categoria
export async function GET() {
  try {
    const configuracao = await prisma.configuracao.findFirst({
      include: {
        margensCategoria: true,
      },
    })

    if (!configuracao) {
      return NextResponse.json([])
    }

    return NextResponse.json(configuracao.margensCategoria)
  } catch (error) {
    console.error("Erro ao buscar margens por categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar nova margem por categoria
export async function POST(request: NextRequest) {
  try {
    const { categoria, margem } = await request.json()

    if (!categoria || typeof margem !== "number" || margem < 0) {
      return NextResponse.json(
        { error: "Categoria e margem são obrigatórios. Margem deve ser um número positivo." },
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

    // Verificar se já existe margem para esta categoria
    const margemExistente = await prisma.margemCategoria.findFirst({
      where: {
        categoria,
        configuracaoId: configuracao.id,
      },
    })

    if (margemExistente) {
      return NextResponse.json(
        { error: "Já existe uma margem configurada para esta categoria" },
        { status: 400 }
      )
    }

    const novaMargem = await prisma.margemCategoria.create({
      data: {
        categoria,
        margem,
        configuracaoId: configuracao.id,
      },
    })

    return NextResponse.json(novaMargem)
  } catch (error) {
    console.error("Erro ao criar margem por categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar margem por categoria
export async function PUT(request: NextRequest) {
  try {
    const { id, categoria, margem } = await request.json()

    if (!id || !categoria || typeof margem !== "number" || margem < 0) {
      return NextResponse.json(
        { error: "ID, categoria e margem são obrigatórios. Margem deve ser um número positivo." },
        { status: 400 }
      )
    }

    const margemAtualizada = await prisma.margemCategoria.update({
      where: { id },
      data: { categoria, margem },
    })

    return NextResponse.json(margemAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar margem por categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Remover margem por categoria
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

    await prisma.margemCategoria.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: "Margem removida com sucesso" })
  } catch (error) {
    console.error("Erro ao remover margem por categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
