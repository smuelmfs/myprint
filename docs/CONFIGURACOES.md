# Sistema de Configurações - MyPrint

Este documento descreve o sistema de configurações integrado ao MyPrint, que permite gerenciar parâmetros operacionais globais do sistema.

## Visão Geral

O sistema de configurações foi migrado de dados mockados para dados reais armazenados no banco de dados PostgreSQL usando Prisma ORM. Todas as configurações são persistentes e afetam o comportamento global do sistema.

## Funcionalidades Implementadas

### 1. Margem Padrão Global
- **Descrição**: Define a margem de lucro padrão aplicada a produtos sem margem específica
- **API**: `PUT /api/configuracao`
- **Campos**: `margemPadrao` (number)

### 2. Margens por Categoria
- **Descrição**: Define margens específicas para cada categoria de produto
- **API**: `GET/POST/PUT/DELETE /api/configuracao/margens`
- **Campos**: `categoria` (string), `margem` (number)

### 3. Mínimos de Faturação
- **Descrição**: Configura valores mínimos de faturação por tipo de cobrança
- **API**: `GET/POST/PUT/DELETE /api/configuracao/minimos`
- **Campos**: `tipo` (string), `valor` (number)

### 4. Tempos Padrão
- **Descrição**: Define tempos médios e valores por hora para operações de produção
- **API**: `GET/POST/PUT/DELETE /api/configuracao/tempos`
- **Campos**: `operacao` (string), `tempoMin` (number), `valorHora` (number)

### 5. Unidades de Medida
- **Descrição**: Gerencia unidades de medida disponíveis no sistema
- **API**: `GET/POST/PUT/DELETE /api/unidades`
- **Campos**: `nome` (string), `sigla` (string, opcional)

### 6. Categorias de Produtos
- **Descrição**: Gerencia categorias principais de produtos
- **API**: `GET/POST/PUT/DELETE /api/categorias`
- **Campos**: `nome` (string), `tipo` (string), `slug` (string, auto-gerado)

## Estrutura do Banco de Dados

### Tabela `Configuracao`
```sql
- id: Int (PK)
- margemPadrao: Float (default: 100)
- criadoEm: DateTime
- atualizadoEm: DateTime
```

### Tabela `MargemCategoria`
```sql
- id: Int (PK)
- categoria: String
- margem: Float
- configuracaoId: Int (FK)
```

### Tabela `MinimoFaturacao`
```sql
- id: Int (PK)
- tipo: String
- valor: Float
- configuracaoId: Int (FK)
```

### Tabela `TempoPadrao`
```sql
- id: Int (PK)
- operacao: String
- tempoMin: Int
- valorHora: Float
- configuracaoId: Int (FK)
```

### Tabela `Unidade`
```sql
- id: Int (PK)
- nome: String
- sigla: String (opcional)
- status: Status (ATIVO/INATIVO)
- criadoEm: DateTime
- atualizadoEm: DateTime
```

### Tabela `Categoria`
```sql
- id: Int (PK)
- nome: String
- slug: String (único)
- tipo: String (produto/extra/geral)
- status: Status (ATIVO/INATIVO)
- ordem: Int (opcional)
- criadoEm: DateTime
- atualizadoEm: DateTime
```

## Como Usar

### 1. Configuração Inicial

Para popular o banco de dados com dados iniciais:

```bash
npm run db:seed
```

### 2. Reset Completo

Para resetar o banco e popular com dados iniciais:

```bash
npm run db:reset
```

### 3. Acessar a Interface

1. Navegue para `/admin/configuracoes`
2. Configure os parâmetros desejados
3. Clique em "Guardar Alterações" para cada seção

## APIs Disponíveis

### Configuração Principal
- `GET /api/configuracao` - Buscar configurações
- `PUT /api/configuracao` - Atualizar margem padrão

### Margens por Categoria
- `GET /api/configuracao/margens` - Listar margens
- `POST /api/configuracao/margens` - Criar margem
- `PUT /api/configuracao/margens` - Atualizar margem
- `DELETE /api/configuracao/margens?id={id}` - Remover margem

### Mínimos de Faturação
- `GET /api/configuracao/minimos` - Listar mínimos
- `POST /api/configuracao/minimos` - Criar mínimo
- `PUT /api/configuracao/minimos` - Atualizar mínimo
- `DELETE /api/configuracao/minimos?id={id}` - Remover mínimo

### Tempos Padrão
- `GET /api/configuracao/tempos` - Listar tempos
- `POST /api/configuracao/tempos` - Criar tempo
- `PUT /api/configuracao/tempos` - Atualizar tempo
- `DELETE /api/configuracao/tempos?id={id}` - Remover tempo

### Unidades
- `GET /api/unidades` - Listar unidades
- `POST /api/unidades` - Criar unidade
- `PUT /api/unidades` - Atualizar unidade
- `DELETE /api/unidades?id={id}` - Remover unidade

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria
- `PUT /api/categorias` - Atualizar categoria
- `DELETE /api/categorias?id={id}` - Remover categoria

## Validações e Regras de Negócio

### Margens por Categoria
- Não é possível criar margens duplicadas para a mesma categoria
- Margem deve ser um número positivo

### Mínimos de Faturação
- Não é possível criar mínimos duplicados para o mesmo tipo
- Valor deve ser um número positivo

### Tempos Padrão
- Não é possível criar tempos duplicados para a mesma operação
- Tempo e valor por hora devem ser números positivos

### Unidades
- Não é possível remover unidades que estão sendo usadas em produtos ou extras
- Nome da unidade deve ser único

### Categorias
- Não é possível remover categorias que estão sendo usadas em produtos ou extras
- Nome da categoria deve ser único
- Slug é gerado automaticamente baseado no nome

## Tratamento de Erros

Todas as APIs retornam respostas padronizadas:

### Sucesso
```json
{
  "id": 1,
  "campo": "valor"
}
```

### Erro
```json
{
  "error": "Mensagem de erro descritiva"
}
```

## Estados de Loading

A interface mostra estados de loading durante:
- Carregamento inicial dos dados
- Salvamento de configurações
- Adição/remoção de itens

## Próximos Passos

1. **Integração com Produtos**: As configurações serão utilizadas automaticamente ao criar/editar produtos
2. **Cálculos Automáticos**: Margens e tempos serão aplicados automaticamente nos cálculos de preços
3. **Relatórios**: Configurações serão utilizadas para gerar relatórios e análises
4. **Backup/Restore**: Implementar funcionalidades de backup e restore das configurações

## Troubleshooting

### Erro de Conexão com Banco
- Verifique se o `DATABASE_URL` está configurado corretamente
- Execute `npx prisma generate` para gerar o cliente Prisma

### Dados Não Aparecem
- Execute `npm run db:seed` para popular dados iniciais
- Verifique se as migrações foram aplicadas: `npx prisma migrate deploy`

### Erro de Permissões
- Verifique se o usuário tem permissões de administrador
- Confirme se está logado no sistema
