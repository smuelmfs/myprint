import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar unidades
export async function GET() {
  try {
    const unidades = await prisma.unidade.findMany({
      where: { status: "ATIVO" },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(unidades)
  } catch (error) {
    console.error("Erro ao buscar unidades:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar nova unidade
export async function POST(request: NextRequest) {
  try {
    const { nome, sigla } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se já existe unidade com este nome
    const unidadeExistente = await prisma.unidade.findFirst({
      where: { nome },
    })

    if (unidadeExistente) {
      return NextResponse.json(
        { error: "Já existe uma unidade com este nome" },
        { status: 400 }
      )
    }

    const novaUnidade = await prisma.unidade.create({
      data: {
        nome,
        sigla,
        status: "ATIVO",
      },
    })

    return NextResponse.json(novaUnidade)
  } catch (error) {
    console.error("Erro ao criar unidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar unidade
export async function PUT(request: NextRequest) {
  try {
    const { id, nome, sigla } = await request.json()

    if (!id || !nome) {
      return NextResponse.json(
        { error: "ID e nome são obrigatórios" },
        { status: 400 }
      )
    }

    const unidadeAtualizada = await prisma.unidade.update({
      where: { id },
      data: { nome, sigla },
    })

    return NextResponse.json(unidadeAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar unidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Remover unidade
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

    // Verificar se a unidade está sendo usada em produtos ou extras
    const produtosUsando = await prisma.produto.count({
      where: { unidadeId: parseInt(id) },
    })

    const extrasUsando = await prisma.extra.count({
      where: { unidadeId: parseInt(id) },
    })

    if (produtosUsando > 0 || extrasUsando > 0) {
      return NextResponse.json(
        { error: "Não é possível remover esta unidade pois está sendo usada em produtos ou extras" },
        { status: 400 }
      )
    }

    await prisma.unidade.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: "Unidade removida com sucesso" })
  } catch (error) {
    console.error("Erro ao remover unidade:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
