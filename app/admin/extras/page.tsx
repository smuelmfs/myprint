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

// Tipos para extras
interface Extra {
  id: number
  nome: string
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
  tipoAplicacao?: string
  unidadeCobranca?: string
  custoBase: number
  margemPadrao: number
  status: "ATIVO" | "INATIVO"
  unidadeTipo?: string
  unidadeFaturamento?: string
  tipoAplicacao2?: string
  criadoEm: string
  atualizadoEm: string
}

export default function ExtrasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteExtraId, setDeleteExtraId] = useState<number | null>(null)
  const [extras, setExtras] = useState<Extra[]>([])
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
      
      // Carregar extras
      const extrasResponse = await fetch("/api/extras")
      if (extrasResponse.ok) {
        const extrasData = await extrasResponse.json()
        setExtras(extrasData.data || [])
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
        description: "Não foi possível carregar os extras.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExtras = extras.filter((extra) => {
    const matchesSearch = extra.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || extra.categoria.nome === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async () => {
    if (!deleteExtraId) return

    try {
      setIsDeleting(true)
      
      const response = await fetch("/api/extras", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteExtraId }),
      })

      if (response.ok) {
        // Remover extra da lista local
        setExtras(extras.filter((e) => e.id !== deleteExtraId))
        
        const extra = extras.find((e) => e.id === deleteExtraId)
        toast({
          title: "Extra desativado",
          description: `O extra "${extra?.nome}" foi desativado e não aparecerá mais na listagem.`,
          variant: "destructive",
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao desativar extra")
      }
    } catch (error) {
      console.error("Erro ao desativar extra:", error)
      toast({
        title: "Erro ao desativar extra",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteExtraId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Extras e Acabamentos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie extras e acabamentos globais aplicáveis aos produtos
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando extras...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Extras e Acabamentos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie extras e acabamentos globais aplicáveis aos produtos
          </p>
        </div>
        <Link href="/admin/extras/novo">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Extra
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar extras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
              <TableHead className="min-w-[200px]">Nome</TableHead>
              <TableHead className="min-w-[180px]">Categoria</TableHead>
              <TableHead className="min-w-[120px]">Tipo de Unidade</TableHead>
              <TableHead className="text-right min-w-[100px]">Custo</TableHead>
              <TableHead className="text-right min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExtras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum extra encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredExtras.map((extra) => (
                <TableRow key={extra.id}>
                  <TableCell className="font-medium">{extra.nome}</TableCell>
                  <TableCell>{extra.categoria.nome}</TableCell>
                  <TableCell>{extra.unidade.sigla || extra.unidade.nome}</TableCell>
                  <TableCell className="text-right">€{extra.custoBase.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/extras/${extra.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteExtraId(extra.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting && deleteExtraId === extra.id ? (
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
        Mostrando {filteredExtras.length} de {extras.length} extras
      </div>

      <AlertDialog open={deleteExtraId !== null} onOpenChange={() => setDeleteExtraId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir extra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir o extra. O item não poderá ser selecionado em novos produtos.
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
