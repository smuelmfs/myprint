import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar extra por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const extra = await prisma.extra.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        unidade: true,
      },
    })

    if (!extra) {
      return NextResponse.json(
        { success: false, message: "Extra não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: extra })
  } catch (error) {
    console.error("Erro ao buscar extra:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao carregar extra" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar extra por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const extraAtualizado = await prisma.extra.update({
      where: { id: parseInt(id) },
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        categoriaId: data.categoriaId,
        unidadeId: data.unidadeId,
        tipoAplicacao: data.tipoAplicacao || null,
        unidadeCobranca: data.unidadeCobranca || null,
        custoBase: data.custoBase ? parseFloat(data.custoBase) : null,
        margemPadrao: data.margemPadrao ? parseFloat(data.margemPadrao) : null,
        unidadeTipo: data.unidadeTipo || null,
        unidadeFaturamento: data.unidadeFaturamento || null,
        tipoAplicacao2: data.tipoAplicacao2 || null,
        custo: data.custo ? parseFloat(data.custo) : null,
        atualizadoEm: new Date(),
      },
      include: {
        categoria: true,
        unidade: true,
      },
    })

    return NextResponse.json({ success: true, data: extraAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar extra:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar extra" },
      { status: 500 }
    )
  }
}

// DELETE - Inativar extra por ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.extra.update({
      where: { id: parseInt(id) },
      data: { status: "INATIVO" },
    })

    return NextResponse.json({ success: true, message: "Extra inativado com sucesso" })
  } catch (error) {
    console.error("Erro ao inativar extra:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao inativar extra" },
      { status: 500 }
    )
  }
}
