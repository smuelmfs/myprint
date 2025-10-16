import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ─────────────────────────────────────────────
// GET → Lista todos os produtos ativos
// ─────────────────────────────────────────────
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { status: "ATIVO" },
      include: {
        categoria: true,
        unidade: true,
        extras: {
          include: { extra: true },
        },
      },
      orderBy: { id: "asc" },
    })

    return NextResponse.json({ success: true, data: produtos })
  } catch (error) {
    console.error("Erro ao listar produtos:", error)
    return NextResponse.json({ success: false, message: "Erro ao carregar produtos" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// POST → Cria um novo produto
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const novoProduto = await prisma.produto.create({
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
        // Campos adicionais do frontend
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
      },
    })

    return NextResponse.json({ success: true, data: novoProduto })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ success: false, message: "Erro ao criar produto" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// PUT → Atualiza um produto existente
// ─────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id } = data

    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
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
        // Campos adicionais do frontend (comentados temporariamente)
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
    })

    return NextResponse.json({ success: true, data: produtoAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar produto" }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// DELETE → Inativa um produto (soft delete)
// ─────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await prisma.produto.update({
      where: { id: Number(id) },
      data: { status: "INATIVO" },
    })

    return NextResponse.json({ success: true, message: "Produto inativado com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return NextResponse.json({ success: false, message: "Erro ao excluir produto" }, { status: 500 })
  }
}
