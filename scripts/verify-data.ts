import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verifyData() {
  try {
    console.log("🔍 Verificando dados inseridos...\n")

    // Verificar configurações
    const configuracao = await prisma.configuracao.findFirst()
    console.log("📊 Configuração:", configuracao ? "✅ Criada" : "❌ Não encontrada")

    // Verificar unidades
    const unidades = await prisma.unidade.count()
    console.log(`📏 Unidades: ${unidades} criadas`)

    // Verificar categorias
    const categorias = await prisma.categoria.count()
    console.log(`📂 Categorias: ${categorias} criadas`)

    // Verificar produtos
    const produtos = await prisma.produto.count()
    console.log(`📦 Produtos: ${produtos} criados`)

    // Verificar extras
    const extras = await prisma.extra.count()
    console.log(`⚙️ Extras: ${extras} criados`)

    // Verificar margens
    const margens = await prisma.margemCategoria.count()
    console.log(`💰 Margens: ${margens} criadas`)

    // Verificar mínimos
    const minimos = await prisma.minimoFaturacao.count()
    console.log(`📈 Mínimos: ${minimos} criados`)

    // Verificar tempos
    const tempos = await prisma.tempoPadrao.count()
    console.log(`⏰ Tempos: ${tempos} criados`)

    console.log("\n🎉 Verificação concluída!")

  } catch (error) {
    console.error("❌ Erro na verificação:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyData()
