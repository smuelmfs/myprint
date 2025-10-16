"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Tipos para produtos
interface Produto {
  id: number
  nome: string
  referencia: string
  descricao?: string
  categoria: {
    id: number
    nome: string
  }
  unidade: {
    id: number
    nome: string
    sigla?: string
  }
  custoBase: number
  margemPadrao: number
  precoBase?: number
  status: "ATIVO" | "INATIVO"
  tipoProduto: string
  corTipo?: string
  formato?: string
  paginas?: number
  gramagem?: number
  tipoPapel?: string
  acabamento?: string
  largura?: number
  altura?: number
  areaM2?: number
  material?: string
  metodoImpressao?: string
  frenteVerso?: string
  possuiFoil?: boolean
  corteEspecial?: boolean
  plastificacao?: string
  dobraVinco?: string
  espessura?: number
  suporteMaterial?: string
  pesoPapel?: number
  mioloPapel?: string
  capaPapel?: string
  encadernacao?: string
  laminacaoCapa?: string
  precoPorM2?: number
  tipoTecido?: string
  areaImpressao?: string
  metodoImpressao2?: string
  materialObjeto?: string
  dimensoes?: string
  materialSuporte?: string
  espessura2?: number
  acabamento2?: string
  criadoEm: string
  atualizadoEm: string
}

export default function ProdutosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [products, setProducts] = useState<Produto[]>([])
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar produtos
      const productsResponse = await fetch("/api/produtos")
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.data || [])
      }

      // Carregar categorias
      const categoriesResponse = await fetch("/api/categorias")
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.referencia.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.categoria.nome === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async () => {
    if (!deleteProductId) return

    try {
      setIsDeleting(true)
      
      const response = await fetch("/api/produtos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteProductId }),
      })

      if (response.ok) {
        // Remover produto da lista local
        setProducts(products.filter((p) => p.id !== deleteProductId))
        
        const product = products.find((p) => p.id === deleteProductId)
        toast({
          title: "Produto desativado",
          description: `O produto "${product?.nome}" foi desativado e não aparecerá mais na listagem.`,
          variant: "destructive",
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao desativar produto")
      }
    } catch (error) {
      console.error("Erro ao desativar produto:", error)
      toast({
        title: "Erro ao desativar produto",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteProductId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Produtos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie os produtos disponíveis para orçamentação
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando produtos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Produtos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie os produtos disponíveis para orçamentação
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.nome}>
                {category.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Nome</TableHead>
              <TableHead className="min-w-[120px]">Referência</TableHead>
              <TableHead className="min-w-[200px]">Categoria</TableHead>
              <TableHead className="min-w-[150px]">Subcategoria</TableHead>
              <TableHead className="min-w-[120px]">Tipo de Unidade</TableHead>
              <TableHead className="text-right min-w-[100px]">Custo Base</TableHead>
              <TableHead className="text-right min-w-[100px]">Margem (%)</TableHead>
              <TableHead className="text-right min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{product.referencia}</TableCell>
                  <TableCell className="text-sm">{product.categoria.nome}</TableCell>
                  <TableCell className="text-sm">{product.tipoProduto}</TableCell>
                  <TableCell>{product.unidade.sigla || product.unidade.nome}</TableCell>
                  <TableCell className="text-right">€{product.custoBase.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.margemPadrao}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/produtos/${product.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteProductId(product.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting && deleteProductId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>

      <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir o produto. O item não poderá ser usado em novos orçamentos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desativando...
                </>
              ) : (
                "Desativar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
