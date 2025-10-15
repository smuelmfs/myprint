import { prisma } from "../lib/prisma"

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`
    console.log("✅ Conexão bem-sucedida! Hora atual no servidor:", result)
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
