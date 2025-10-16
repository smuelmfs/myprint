import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar tempos padrão
export async function GET() {
  try {
    const configuracao = await prisma.configuracao.findFirst({
      include: {
        temposPadrao: true,
      },
    })

    if (!configuracao) {
      return NextResponse.json([])
    }

    return NextResponse.json(configuracao.temposPadrao)
  } catch (error) {
    console.error("Erro ao buscar tempos padrão:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST - Criar novo tempo padrão
export async function POST(request: NextRequest) {
  try {
    const { operacao, tempoMin, valorHora } = await request.json()

    if (!operacao || typeof tempoMin !== "number" || typeof valorHora !== "number" || tempoMin < 0 || valorHora < 0) {
      return NextResponse.json(
        { error: "Operação, tempo e valor por hora são obrigatórios. Valores devem ser números positivos." },
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

    // Verificar se já existe tempo para esta operação
    const tempoExistente = await prisma.tempoPadrao.findFirst({
      where: {
        operacao,
        configuracaoId: configuracao.id,
      },
    })

    if (tempoExistente) {
      return NextResponse.json(
        { error: "Já existe um tempo configurado para esta operação" },
        { status: 400 }
      )
    }

    const novoTempo = await prisma.tempoPadrao.create({
      data: {
        operacao,
        tempoMin,
        valorHora,
        configuracaoId: configuracao.id,
      },
    })

    return NextResponse.json(novoTempo)
  } catch (error) {
    console.error("Erro ao criar tempo padrão:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar tempo padrão
export async function PUT(request: NextRequest) {
  try {
    const { id, operacao, tempoMin, valorHora } = await request.json()

    if (!id || !operacao || typeof tempoMin !== "number" || typeof valorHora !== "number" || tempoMin < 0 || valorHora < 0) {
      return NextResponse.json(
        { error: "ID, operação, tempo e valor por hora são obrigatórios. Valores devem ser números positivos." },
        { status: 400 }
      )
    }

    const tempoAtualizado = await prisma.tempoPadrao.update({
      where: { id },
      data: { operacao, tempoMin, valorHora },
    })

    return NextResponse.json(tempoAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar tempo padrão:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Remover tempo padrão
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

    await prisma.tempoPadrao.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: "Tempo removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover tempo padrão:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
