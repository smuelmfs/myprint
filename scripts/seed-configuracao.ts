import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedConfiguracao() {
  try {
    console.log("🌱 Iniciando seed das configurações...")

    // Criar configuração principal
    const configuracao = await prisma.configuracao.upsert({
      where: { id: 1 },
      update: {},
      create: {
        margemPadrao: 100,
      },
    })

    console.log("✅ Configuração principal criada")

    // Criar unidades padrão
    const unidades = [
      { nome: "unidade", sigla: "un" },
      { nome: "metro quadrado", sigla: "m²" },
      { nome: "quilograma", sigla: "kg" },
      { nome: "peça", sigla: "pç" },
      { nome: "metro", sigla: "m" },
      { nome: "litro", sigla: "L" },
      { nome: "hora", sigla: "h" },
    ]

    for (const unidade of unidades) {
      const existingUnidade = await prisma.unidade.findFirst({
        where: { nome: unidade.nome }
      })
      
      if (!existingUnidade) {
        await prisma.unidade.create({
          data: {
            nome: unidade.nome,
            sigla: unidade.sigla,
            status: "ATIVO",
          },
        })
      }
    }

    console.log("✅ Unidades criadas")

    // Criar categorias padrão
    const categorias = [
      { nome: "Impressão Gráfica Tradicional", tipo: "produto" },
      { nome: "Têxteis Personalizados", tipo: "produto" },
      { nome: "Comunicação Visual & Grande Formato", tipo: "produto" },
      { nome: "Merchandising / Objetos Promocionais", tipo: "produto" },
      { nome: "Decoração & Personalização Técnica", tipo: "produto" },
      { nome: "Embalagens Personalizadas", tipo: "produto" },
      { nome: "Serviços de Produção e Acabamento", tipo: "extra" },
      { nome: "Linha Sustentável", tipo: "produto" },
    ]

    for (const categoria of categorias) {
      const slug = categoria.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim()

      await prisma.categoria.upsert({
        where: { slug },
        update: {},
        create: {
          nome: categoria.nome,
          slug,
          tipo: categoria.tipo,
          status: "ATIVO",
        },
      })
    }

    console.log("✅ Categorias criadas")

    // Criar margens por categoria
    const margensCategoria = [
      { categoria: "Impressão Gráfica Tradicional", margem: 120 },
      { categoria: "Têxteis Personalizados", margem: 150 },
      { categoria: "Comunicação Visual & Grande Formato", margem: 100 },
      { categoria: "Merchandising / Objetos Promocionais", margem: 130 },
      { categoria: "Linha Sustentável", margem: 110 },
    ]

    for (const margem of margensCategoria) {
      const existingMargem = await prisma.margemCategoria.findFirst({
        where: { categoria: margem.categoria }
      })
      
      if (!existingMargem) {
        await prisma.margemCategoria.create({
          data: {
            categoria: margem.categoria,
            margem: margem.margem,
            configuracaoId: configuracao.id,
          },
        })
      }
    }

    console.log("✅ Margens por categoria criadas")

    // Criar mínimos de faturação
    const minimos = [
      { tipo: "por peça", valor: 5.0 },
      { tipo: "por m²", valor: 15.0 },
      { tipo: "por lote", valor: 25.0 },
    ]

    for (const minimo of minimos) {
      const existingMinimo = await prisma.minimoFaturacao.findFirst({
        where: { tipo: minimo.tipo }
      })
      
      if (!existingMinimo) {
        await prisma.minimoFaturacao.create({
          data: {
            tipo: minimo.tipo,
            valor: minimo.valor,
            configuracaoId: configuracao.id,
          },
        })
      }
    }

    console.log("✅ Mínimos de faturação criados")

    // Criar tempos padrão
    const tempos = [
      { operacao: "Corte", tempoMin: 15, valorHora: 25.0 },
      { operacao: "Laminação", tempoMin: 30, valorHora: 30.0 },
      { operacao: "Montagem", tempoMin: 45, valorHora: 20.0 },
      { operacao: "Impressão Offset", tempoMin: 60, valorHora: 35.0 },
      { operacao: "Acabamento", tempoMin: 20, valorHora: 28.0 },
    ]

    for (const tempo of tempos) {
      const existingTempo = await prisma.tempoPadrao.findFirst({
        where: { operacao: tempo.operacao }
      })
      
      if (!existingTempo) {
        await prisma.tempoPadrao.create({
          data: {
            operacao: tempo.operacao,
            tempoMin: tempo.tempoMin,
            valorHora: tempo.valorHora,
            configuracaoId: configuracao.id,
          },
        })
      }
    }

    console.log("✅ Tempos padrão criados")

    // Criar produtos de exemplo (5 produtos)
    const produtosExemplo = [
      {
        nome: "Cartões de Visita",
        referencia: "CV-001",
        descricao: "Cartões de visita em papel couché 300g",
        categoria: "Impressão Gráfica Tradicional",
        unidade: "unidade",
        tipoProduto: "Cartão de Visita",
        custoBase: 0.15,
        margemPadrao: 150,
        corTipo: "CMYK",
        formato: "85x55mm",
        largura: 8.5,
        altura: 5.5,
        frenteVerso: "Frente e Verso",
        possuiFoil: false,
        corteEspecial: false,
      },
      {
        nome: "Flyers A5",
        referencia: "FL-A5-001",
        descricao: "Flyers promocionais formato A5",
        categoria: "Impressão Gráfica Tradicional",
        unidade: "unidade",
        tipoProduto: "Flyer",
        custoBase: 0.25,
        margemPadrao: 120,
        corTipo: "CMYK",
        formato: "A5",
        largura: 14.8,
        altura: 21.0,
        frenteVerso: "Frente e Verso",
        possuiFoil: false,
        corteEspecial: false,
      },
      {
        nome: "T-shirts Algodão",
        referencia: "TS-ALG-001",
        descricao: "T-shirts 100% algodão personalizadas",
        categoria: "Têxteis Personalizados",
        unidade: "unidade",
        tipoProduto: "T-shirt",
        custoBase: 5.5,
        margemPadrao: 120,
        tipoTecido: "algodao",
        metodoImpressao: "sublimacao",
        possuiFoil: false,
        corteEspecial: false,
      },
      {
        nome: "Lonas Publicitárias",
        referencia: "LN-PUB-001",
        descricao: "Lonas para comunicação visual",
        categoria: "Comunicação Visual & Grande Formato",
        unidade: "m²",
        tipoProduto: "Lona",
        custoBase: 15.0,
        margemPadrao: 80,
        corTipo: "CMYK",
        material: "Lona Frontlit 440g",
        precoPorM2: 15.0,
        possuiFoil: false,
        corteEspecial: false,
      },
      {
        nome: "Canecas Cerâmica",
        referencia: "CN-CER-001",
        descricao: "Canecas personalizadas em cerâmica",
        categoria: "Merchandising / Objetos Promocionais",
        unidade: "unidade",
        tipoProduto: "Caneca",
        custoBase: 3.2,
        margemPadrao: 150,
        materialObjeto: "ceramica",
        possuiFoil: false,
        corteEspecial: false,
      },
    ]

    for (const produto of produtosExemplo) {
      const categoria = await prisma.categoria.findFirst({
        where: { nome: produto.categoria },
      })
      
      const unidade = await prisma.unidade.findFirst({
        where: { nome: produto.unidade },
      })

      if (categoria && unidade) {
        await prisma.produto.upsert({
          where: { referencia: produto.referencia },
          update: {},
          create: {
            nome: produto.nome,
            referencia: produto.referencia,
            descricao: produto.descricao,
            categoriaId: categoria.id,
            unidadeId: unidade.id,
            tipoProduto: produto.tipoProduto,
            custoBase: produto.custoBase,
            margemPadrao: produto.margemPadrao,
            corTipo: produto.corTipo,
            formato: produto.formato,
            largura: produto.largura,
            altura: produto.altura,
            frenteVerso: produto.frenteVerso,
            possuiFoil: produto.possuiFoil,
            corteEspecial: produto.corteEspecial,
            tipoTecido: produto.tipoTecido,
            metodoImpressao: produto.metodoImpressao,
            status: "ATIVO",
          },
        })
      }
    }

    console.log("✅ Produtos de exemplo criados")

    // Criar extras de exemplo (5 extras)
    const extrasExemplo = [
      {
        nome: "Laminação Brilho",
        descricao: "Laminação com acabamento brilhante",
        categoria: "Serviços de Produção e Acabamento",
        unidade: "m²",
        tipoAplicacao: "por m²",
        custoBase: 2.5,
        margemPadrao: 100,
      },
      {
        nome: "Corte Vinil",
        descricao: "Corte de vinil adesivo",
        categoria: "Serviços de Produção e Acabamento",
        unidade: "m²",
        tipoAplicacao: "por m²",
        custoBase: 1.8,
        margemPadrao: 120,
      },
      {
        nome: "Montagem Acrílico",
        descricao: "Montagem em acrílico 3mm",
        categoria: "Serviços de Produção e Acabamento",
        unidade: "m²",
        tipoAplicacao: "por m²",
        custoBase: 15.0,
        margemPadrao: 80,
      },
      {
        nome: "Serigrafia 1 Cor",
        descricao: "Impressão serigráfica com uma cor",
        categoria: "Serviços de Produção e Acabamento",
        unidade: "unidade",
        tipoAplicacao: "por peça",
        custoBase: 1.2,
        margemPadrao: 110,
      },
      {
        nome: "Verniz UV",
        descricao: "Verniz ultravioleta para proteção e brilho",
        categoria: "Serviços de Produção e Acabamento",
        unidade: "m²",
        tipoAplicacao: "por m²",
        custoBase: 3.8,
        margemPadrao: 90,
      },
    ]

    for (const extra of extrasExemplo) {
      const categoria = await prisma.categoria.findFirst({
        where: { nome: extra.categoria },
      })
      
      const unidade = await prisma.unidade.findFirst({
        where: { nome: extra.unidade },
      })

      if (categoria && unidade) {
        const existingExtra = await prisma.extra.findFirst({
          where: { nome: extra.nome }
        })
        
        if (!existingExtra) {
          await prisma.extra.create({
            data: {
              nome: extra.nome,
              descricao: extra.descricao,
              categoriaId: categoria.id,
              unidadeId: unidade.id,
              tipoAplicacao: extra.tipoAplicacao,
              custoBase: extra.custoBase,
              margemPadrao: extra.margemPadrao,
              status: "ATIVO",
            },
          })
        }
      }
    }

    console.log("✅ Extras de exemplo criados")

    console.log("🎉 Seed das configurações concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro durante o seed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedConfiguracao()
    .then(() => {
      console.log("✅ Seed executado com sucesso!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Erro ao executar seed:", error)
      process.exit(1)
    })
}

export default seedConfiguracao
