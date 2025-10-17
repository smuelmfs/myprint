import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    // Verificar se a referência já existe em outro produto ativo (exceto o atual)
    if (data.referencia && data.referencia.trim() !== "") {
      console.log("Verificando se referência já existe em outro produto:", data.referencia)
      
      const produtoComMesmaReferencia = await prisma.produto.findFirst({
        where: { 
          referencia: data.referencia.trim(),
          status: "ATIVO",
          id: { not: parseInt(id) }
        }
      })

      if (produtoComMesmaReferencia) {
        console.log("❌ Referência já existe em outro produto:", produtoComMesmaReferencia.id)
        return NextResponse.json({ 
          success: false, 
          message: "Já existe um produto ativo com esta referência. Por favor, escolha uma referência diferente.",
          error: "Referência duplicada"
        }, { status: 400 })
      }
      console.log("✅ Referência única")
    }

    // Atualizar produto com extras usando transação
    const produtoAtualizado = await prisma.$transaction(async (tx) => {
      // Atualizar dados do produto
      await tx.produto.update({
        where: { id: parseInt(id) },
        data: {
          nome: data.nome,
          referencia: data.referencia,
          descricao: data.descricao || null,
          categoriaId: data.categoriaId,
          unidadeId: data.unidadeId,
          tipoProduto: data.tipoProduto,
          custoBase: parseFloat(data.custoBase),
          margemPadrao: parseFloat(data.margemPadrao),
          // Características técnicas principais
          corTipo: data.corTipo || null,
          formato: data.formato || null,
          paginas: data.paginas || null,
          gramagem: data.gramagem || null,
          tipoPapel: data.tipoPapel || null,
          acabamento: data.acabamento || null,
          largura: data.largura || null,
          altura: data.altura || null,
          material: data.material || null,
          metodoImpressao: data.metodoImpressao || null,
          frenteVerso: data.frenteVerso || null,
          possuiFoil: data.possuiFoil ?? false,
          corteEspecial: data.corteEspecial ?? false,
          plastificacao: data.plastificacao || null,
          dobraVinco: data.dobraVinco || null,
          espessura: data.espessura || null,
          suporteMaterial: data.suporteMaterial || null,
          // Campos específicos por tipo de produto
          tipoTecido: data.tipoTecido || null,
          areaImpressao: data.areaImpressao || null,
          materialObjeto: data.materialObjeto || null,
          dimensoes: data.dimensoes || null,
          materialSuporte: data.materialSuporte || null,
          atualizadoEm: new Date(),
        },
      })

      // Atualizar relacionamentos com extras
      if (data.extrasIds !== undefined) {
        console.log("Atualizando relacionamentos com extras:", data.extrasIds)
        
        // Remover todos os relacionamentos existentes
        await tx.produtoExtra.deleteMany({
          where: { produtoId: parseInt(id) },
        })

        // Adicionar novos relacionamentos se houver extras
        if (data.extrasIds.length > 0) {
          await tx.produtoExtra.createMany({
            data: data.extrasIds.map((extraId: number) => ({
              produtoId: parseInt(id),
              extraId: extraId,
            })),
          })
        }
      }

      // Retornar produto com relacionamentos atualizados
      return await tx.produto.findUnique({
        where: { id: parseInt(id) },
        include: {
          categoria: true,
          unidade: true,
          extras: {
            include: { extra: true },
          },
        },
      })
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.produto.update({
      where: { id: parseInt(id) },
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
