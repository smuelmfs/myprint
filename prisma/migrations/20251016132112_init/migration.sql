-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT,
    "tipo" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "ordem" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "descricao" TEXT,
    "categoriaId" INTEGER NOT NULL,
    "subcategoria" TEXT,
    "tipoProduto" TEXT NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "custoBase" DOUBLE PRECISION NOT NULL,
    "margemPadrao" DOUBLE PRECISION NOT NULL,
    "precoBase" DOUBLE PRECISION,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "corTipo" TEXT,
    "formato" TEXT,
    "paginas" INTEGER,
    "gramagem" INTEGER,
    "tipoPapel" TEXT,
    "acabamento" TEXT,
    "largura" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "areaM2" DOUBLE PRECISION,
    "material" TEXT,
    "metodoImpressao" TEXT,
    "frenteVerso" TEXT,
    "possuiFoil" BOOLEAN DEFAULT false,
    "corteEspecial" BOOLEAN DEFAULT false,
    "plastificacao" TEXT,
    "dobraVinco" TEXT,
    "espessura" DOUBLE PRECISION,
    "suporteMaterial" TEXT,
    "pesoPapel" DOUBLE PRECISION,
    "mioloPapel" TEXT,
    "capaPapel" TEXT,
    "encadernacao" TEXT,
    "laminacaoCapa" TEXT,
    "precoPorM2" DOUBLE PRECISION,
    "tipoTecido" TEXT,
    "areaImpressao" TEXT,
    "metodoImpressao2" TEXT,
    "materialObjeto" TEXT,
    "dimensoes" TEXT,
    "materialSuporte" TEXT,
    "espessura2" DOUBLE PRECISION,
    "acabamento2" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extra" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoriaId" INTEGER NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "tipoAplicacao" TEXT,
    "unidadeCobranca" TEXT,
    "custoBase" DOUBLE PRECISION NOT NULL,
    "margemPadrao" DOUBLE PRECISION DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "unidadeTipo" TEXT,
    "unidadeFaturamento" TEXT,
    "tipoAplicacao2" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Extra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoExtra" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "extraId" INTEGER NOT NULL,
    "custoExtra" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProdutoExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" SERIAL NOT NULL,
    "margemPadrao" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MargemCategoria" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "margem" DOUBLE PRECISION NOT NULL,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "MargemCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinimoFaturacao" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "MinimoFaturacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempoPadrao" (
    "id" SERIAL NOT NULL,
    "operacao" TEXT NOT NULL,
    "tempoMin" INTEGER NOT NULL,
    "valorHora" DOUBLE PRECISION NOT NULL,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "TempoPadrao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_referencia_key" ON "Produto"("referencia");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoExtra" ADD CONSTRAINT "ProdutoExtra_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoExtra" ADD CONSTRAINT "ProdutoExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MargemCategoria" ADD CONSTRAINT "MargemCategoria_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "Configuracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinimoFaturacao" ADD CONSTRAINT "MinimoFaturacao_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "Configuracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempoPadrao" ADD CONSTRAINT "TempoPadrao_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "Configuracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
