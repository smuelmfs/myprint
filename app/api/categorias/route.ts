import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { status: "ATIVO" },
      orderBy: { ordem: "asc" },
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const { nome, tipo = "geral" } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se já existe categoria com este nome
    const categoriaExistente = await prisma.categoria.findFirst({
      where: { nome },
    })

    if (categoriaExistente) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      )
    }

    // Gerar slug baseado no nome
    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    // Calcular próxima ordem disponível para o tipo
    const ultimaOrdem = await prisma.categoria.findFirst({
      where: { 
        tipo,
        ordem: { not: null }
      },
      orderBy: { ordem: "desc" },
      select: { ordem: true },
    })
    
    const proximaOrdem = (ultimaOrdem?.ordem || 0) + 1

    const novaCategoria = await prisma.categoria.create({
      data: {
        nome,
        slug,
        tipo,
        ordem: proximaOrdem,
        status: "ATIVO",
      },
    })

    return NextResponse.json(novaCategoria)
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar categoria
export async function PUT(request: NextRequest) {
  try {
    const { id, nome, tipo, ordem } = await request.json()

    if (!id || !nome) {
      return NextResponse.json(
        { error: "ID e nome são obrigatórios" },
        { status: 400 }
      )
    }

    // Gerar slug baseado no nome
    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: { nome, slug, tipo, ordem },
    })

    return NextResponse.json(categoriaAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Remover categoria
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

    // Verificar se a categoria está sendo usada em produtos ou extras
    const produtosUsando = await prisma.produto.count({
      where: { categoriaId: parseInt(id) },
    })

    const extrasUsando = await prisma.extra.count({
      where: { categoriaId: parseInt(id) },
    })

    if (produtosUsando > 0 || extrasUsando > 0) {
      return NextResponse.json(
        { error: "Não é possível remover esta categoria pois está sendo usada em produtos ou extras" },
        { status: 400 }
      )
    }

    await prisma.categoria.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: "Categoria removida com sucesso" })
  } catch (error) {
    console.error("Erro ao remover categoria:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
