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
    console.log("🚀 Iniciando POST /api/produtos")
    
    const data = await request.json()
    console.log("📥 Dados recebidos:", JSON.stringify(data, null, 2))

    // Validação dos campos obrigatórios
    console.log("Iniciando validações...")
    
    if (!data.nome || data.nome.trim() === "") {
      console.log("❌ Validação falhou: Nome é obrigatório")
      const errorResponse = {
        success: false,
        message: "Nome é obrigatório",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Nome válido")

    if (!data.referencia || data.referencia.trim() === "") {
      console.log("❌ Validação falhou: Referência é obrigatória")
      const errorResponse = {
        success: false,
        message: "Referência é obrigatória",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Referência válida")

    if (!data.categoriaId) {
      console.log("❌ Validação falhou: Categoria é obrigatória")
      const errorResponse = {
        success: false,
        message: "Categoria é obrigatória",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Categoria válida")

    if (!data.unidadeId) {
      console.log("❌ Validação falhou: Unidade é obrigatória")
      const errorResponse = {
        success: false,
        message: "Unidade é obrigatória",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Unidade válida")

    if (!data.tipoProduto || data.tipoProduto.trim() === "") {
      console.log("❌ Validação falhou: Tipo de produto é obrigatório")
      const errorResponse = {
        success: false,
        message: "Tipo de produto é obrigatório",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Tipo de produto válido")

    if (!data.custoBase || isNaN(parseFloat(data.custoBase))) {
      console.log("❌ Validação falhou: Custo base é obrigatório e deve ser um número válido")
      const errorResponse = {
        success: false,
        message: "Custo base é obrigatório e deve ser um número válido",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Custo base válido")

    if (!data.margemPadrao || isNaN(parseFloat(data.margemPadrao))) {
      console.log("❌ Validação falhou: Margem padrão é obrigatória e deve ser um número válido")
      const errorResponse = {
        success: false,
        message: "Margem padrão é obrigatória e deve ser um número válido",
        error: "Campo obrigatório"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Margem padrão válida")

    // Verificar se a categoria existe
    console.log("Verificando se categoria existe...")
    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: data.categoriaId }
    })

    if (!categoriaExiste) {
      console.log("❌ Categoria não encontrada")
      const errorResponse = {
        success: false,
        message: "Categoria não encontrada. Por favor, selecione uma categoria válida.",
        error: "Referência inválida"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Categoria existe")

    // Verificar se a unidade existe
    console.log("Verificando se unidade existe...")
    const unidadeExiste = await prisma.unidade.findUnique({
      where: { id: data.unidadeId }
    })

    if (!unidadeExiste) {
      console.log("❌ Unidade não encontrada")
      const errorResponse = {
        success: false,
        message: "Unidade não encontrada. Por favor, selecione uma unidade válida.",
        error: "Referência inválida"
      }
      console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Unidade existe")

    // Verificar se os extras existem (se fornecidos)
    if (data.extrasIds && data.extrasIds.length > 0) {
      console.log("Verificando extras...")
      const extrasExistentes = await prisma.extra.findMany({
        where: { 
          id: { in: data.extrasIds },
          status: "ATIVO"
        }
      })

      if (extrasExistentes.length !== data.extrasIds.length) {
        console.log("❌ Um ou mais extras não foram encontrados ou estão inativos")
        return NextResponse.json({ 
          success: false, 
          message: "Um ou mais extras não foram encontrados ou estão inativos" 
        }, { status: 400 })
      }
      console.log("✅ Extras válidos")
    }

    // Verificar se a referência já existe (apenas produtos ativos)
    console.log("Verificando se referência já existe...")
    const produtoExistente = await prisma.produto.findFirst({
      where: { 
        referencia: data.referencia,
        status: "ATIVO"
      }
    })

    if (produtoExistente) {
      console.log("❌ Já existe um produto ativo com esta referência")
      const errorResponse = {
        success: false,
        message: "Já existe um produto ativo com esta referência. Por favor, escolha uma referência diferente.",
        error: "Referência duplicada"
      }
      console.log("📤 Enviando resposta de erro de referência:", JSON.stringify(errorResponse, null, 2))
      return NextResponse.json(errorResponse, { status: 400 })
    }
    console.log("✅ Referência única (considerando apenas produtos ativos)")

    console.log("Tentando criar produto...")
    
    const produtoData = {
      nome: data.nome,
      referencia: data.referencia,
      descricao: data.descricao || null,
      categoriaId: data.categoriaId,
      unidadeId: data.unidadeId,
      tipoProduto: data.tipoProduto,
      custoBase: parseFloat(data.custoBase),
      margemPadrao: parseFloat(data.margemPadrao),
      // Características técnicas principais
      corTipo: data.corTipo && data.corTipo.trim() !== "" ? data.corTipo : null,
      formato: data.formato && data.formato.trim() !== "" ? data.formato : null,
      paginas: data.paginas ? parseInt(data.paginas) : null,
      gramagem: data.gramagem ? parseInt(data.gramagem) : null,
      tipoPapel: data.tipoPapel && data.tipoPapel.trim() !== "" ? data.tipoPapel : null,
      acabamento: data.acabamento && data.acabamento.trim() !== "" ? data.acabamento : null,
      largura: data.largura ? parseFloat(data.largura) : null,
      altura: data.altura ? parseFloat(data.altura) : null,
      material: data.material && data.material.trim() !== "" ? data.material : null,
      metodoImpressao: data.metodoImpressao && data.metodoImpressao.trim() !== "" ? data.metodoImpressao : null,
      frenteVerso: data.frenteVerso && data.frenteVerso.trim() !== "" ? data.frenteVerso : null,
      possuiFoil: data.possuiFoil ?? false,
      corteEspecial: data.corteEspecial ?? false,
      plastificacao: data.plastificacao && data.plastificacao.trim() !== "" ? data.plastificacao : null,
      dobraVinco: data.dobraVinco && data.dobraVinco.trim() !== "" ? data.dobraVinco : null,
      espessura: data.espessura ? parseFloat(data.espessura) : null,
      suporteMaterial: data.suporteMaterial && data.suporteMaterial.trim() !== "" ? data.suporteMaterial : null,
      // Campos específicos por tipo de produto
      tipoTecido: data.tipoTecido && data.tipoTecido.trim() !== "" ? data.tipoTecido : null,
      areaImpressao: data.areaImpressao && data.areaImpressao.trim() !== "" ? data.areaImpressao : null,
      materialObjeto: data.materialObjeto && data.materialObjeto.trim() !== "" ? data.materialObjeto : null,
      dimensoes: data.dimensoes && data.dimensoes.trim() !== "" ? data.dimensoes : null,
      materialSuporte: data.materialSuporte && data.materialSuporte.trim() !== "" ? data.materialSuporte : null,
    }

    console.log("Dados do produto preparados:", JSON.stringify(produtoData, null, 2))
    console.log("Extras IDs recebidos:", data.extrasIds)

    // Criar produto primeiro (sem transação para debug)
    console.log("Criando produto com dados:", JSON.stringify(produtoData, null, 2))
    
    const produto = await prisma.produto.create({
      data: produtoData,
    })

    console.log("Produto criado com ID:", produto.id)

    // Adicionar relacionamentos com extras se fornecidos
    if (data.extrasIds && data.extrasIds.length > 0) {
      console.log("Criando relacionamentos com extras:", data.extrasIds)
      await prisma.produtoExtra.createMany({
        data: data.extrasIds.map((extraId: number) => ({
          produtoId: produto.id,
          extraId: extraId,
        })),
      })
    }

    // Retornar produto com relacionamentos
    const novoProduto = await prisma.produto.findUnique({
      where: { id: produto.id },
      include: {
        categoria: true,
        unidade: true,
        extras: {
          include: { extra: true },
        },
      },
    })

    console.log("Produto criado com sucesso:", novoProduto?.id)

    console.log("✅ Produto criado com sucesso, retornando resposta...")
    return NextResponse.json({ success: true, data: novoProduto })
  } catch (error) {
    console.error("💥 ERRO CAPTURADO na API:", error)
    console.error("📊 Tipo do erro:", typeof error)
    console.error("🔍 É instância de Error?", error instanceof Error)
    
    if (error instanceof Error) {
      console.error("📝 Mensagem de erro:", error.message)
      console.error("🏷️ Nome do erro:", error.name)
      console.error("📚 Stack trace:", error.stack)
    }
    
    // Verificar se é erro de validação do Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } }
      console.error("🔢 Código do erro Prisma:", prismaError.code)
      console.error("📋 Meta do erro:", prismaError.meta)
    }
    
    // Tratar erros específicos do Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } }
      
      // Erro de constraint única (referência duplicada)
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target
        if (target && target.includes('referencia')) {
          console.log("❌ Retornando erro de referência duplicada")
          return NextResponse.json({ 
            success: false, 
            message: "Já existe um produto ativo com esta referência. Por favor, escolha uma referência diferente.",
            error: "Referência duplicada"
          }, { status: 400 })
        }
      }
      
      // Erro de foreign key
      if (prismaError.code === 'P2003') {
        console.log("❌ Retornando erro de foreign key")
        return NextResponse.json({ 
          success: false, 
          message: "Categoria ou unidade selecionada não existe. Por favor, verifique os dados.",
          error: "Referência inválida"
        }, { status: 400 })
      }
    }
    
    console.log("❌ Retornando erro genérico")
    
    // Garantir que sempre retornamos uma resposta JSON válida
    const errorResponse = {
      success: false,
      message: "Erro ao criar produto. Tente novamente ou entre em contato com o suporte.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      timestamp: new Date().toISOString()
    }
    
    console.log("📤 Enviando resposta de erro:", JSON.stringify(errorResponse, null, 2))
    
    return NextResponse.json(errorResponse, { status: 500 })
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
