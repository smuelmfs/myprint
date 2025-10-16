import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        categoria: true,
        unidade: true,
        extras: {
          include: { extra: true },
        },
      },
    })

    if (!produto) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: produto })
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao carregar produto" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar produto por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(params.id) },
      data: {
        nome: data.nome,
        referencia: data.referencia,
        descricao: data.descricao || null,
        categoriaId: data.categoriaId,
        unidadeId: data.unidadeId,
        tipoProduto: data.tipoProduto,
        custoBase: parseFloat(data.custoBase),
        margemPadrao: parseFloat(data.margemPadrao),
        precoBase: data.precoBase ? parseFloat(data.precoBase) : null,
        corTipo: data.corTipo || null,
        formato: data.formato || null,
        paginas: data.paginas || null,
        gramagem: data.gramagem || null,
        tipoPapel: data.tipoPapel || null,
        acabamento: data.acabamento || null,
        largura: data.largura || null,
        altura: data.altura || null,
        areaM2: data.areaM2 || null,
        material: data.material || null,
        metodoImpressao: data.metodoImpressao || null,
        frenteVerso: data.frenteVerso || null,
        possuiFoil: data.possuiFoil ?? false,
        corteEspecial: data.corteEspecial ?? false,
        plastificacao: data.plastificacao || null,
        dobraVinco: data.dobraVinco || null,
        espessura: data.espessura || null,
        suporteMaterial: data.suporteMaterial || null,
        pesoPapel: data.pesoPapel || null,
        mioloPapel: data.mioloPapel || null,
        capaPapel: data.capaPapel || null,
        encadernacao: data.encadernacao || null,
        laminacaoCapa: data.laminacaoCapa || null,
        precoPorM2: data.precoPorM2 || null,
        tipoTecido: data.tipoTecido || null,
        areaImpressao: data.areaImpressao || null,
        metodoImpressao2: data.metodoImpressao2 || null,
        materialObjeto: data.materialObjeto || null,
        dimensoes: data.dimensoes || null,
        materialSuporte: data.materialSuporte || null,
        espessura2: data.espessura2 || null,
        acabamento2: data.acabamento2 || null,
        atualizadoEm: new Date(),
      },
      include: {
        categoria: true,
        unidade: true,
        extras: {
          include: { extra: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: produtoAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

// DELETE - Inativar produto por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.produto.update({
      where: { id: parseInt(params.id) },
      data: { status: "INATIVO" },
    })

    return NextResponse.json({ success: true, message: "Produto inativado com sucesso" })
  } catch (error) {
    console.error("Erro ao inativar produto:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao inativar produto" },
      { status: 500 }
    )
  }
}
