import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ─────────────────────────────────────────────
// GET → Lista todos os extras ativos
// ─────────────────────────────────────────────
export async function GET() {
  try {
    const extras = await prisma.extra.findMany({
      where: { status: "ATIVO" },
      include: {
        categoria: true,
        unidade: true,
      },
      orderBy: { id: "asc" },
    })

    return NextResponse.json({ success: true, data: extras })
  } catch (error) {
    console.error("Erro ao listar extras:", error)
    return NextResponse.json({ success: false, message: "Erro ao carregar extras" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// POST → Cria um novo extra
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const novoExtra = await prisma.extra.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        categoriaId: data.categoriaId,
        unidadeId: data.unidadeId,
        tipoAplicacao: data.tipoAplicacao || null,
        unidadeCobranca: data.unidadeCobranca || null,
        custoBase: parseFloat(data.custoBase),
        margemPadrao: data.margemPadrao ? parseFloat(data.margemPadrao) : 0,
        // Campos adicionais do frontend
        unidadeTipo: data.unidadeTipo || null,
        unidadeFaturamento: data.unidadeFaturamento || null,
        tipoAplicacao2: data.tipoAplicacao2 || null,
      },
    })

    return NextResponse.json({ success: true, data: novoExtra })
  } catch (error) {
    console.error("Erro ao criar extra:", error)
    return NextResponse.json({ success: false, message: "Erro ao criar extra" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// PUT → Atualiza um extra existente
// ─────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id } = data

    const extraAtualizado = await prisma.extra.update({
      where: { id: Number(id) },
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        categoriaId: data.categoriaId,
        unidadeId: data.unidadeId,
        tipoAplicacao: data.tipoAplicacao || null,
        unidadeCobranca: data.unidadeCobranca || null,
        custoBase: parseFloat(data.custoBase),
        margemPadrao: data.margemPadrao ? parseFloat(data.margemPadrao) : 0,
        // Campos adicionais do frontend
        unidadeTipo: data.unidadeTipo || null,
        unidadeFaturamento: data.unidadeFaturamento || null,
        tipoAplicacao2: data.tipoAplicacao2 || null,
        atualizadoEm: new Date(),
      },
    })

    return NextResponse.json({ success: true, data: extraAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar extra:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar extra" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// DELETE → Inativa um extra (soft delete)
// ─────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await prisma.extra.update({
      where: { id: Number(id) },
      data: { status: "INATIVO" },
    })

    return NextResponse.json({ success: true, message: "Extra inativado com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir extra:", error)
    return NextResponse.json({ success: false, message: "Erro ao excluir extra" }, { status: 500 })
  }
}
