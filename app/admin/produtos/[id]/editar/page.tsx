"use client"

import type React from "react"
import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { mockExtras } from "@/lib/mock-data/extras"
import { useToast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data/products"

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { id } = use(params)
  const product = mockProducts.find((p) => p.id === Number.parseInt(id))

  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([1, 3])
  const [categoryFilter, setCategoryFilter] = useState("all")

  const activeExtras = mockExtras.filter((extra) => extra.status === 1)

  const filteredExtras =
    categoryFilter === "all" ? activeExtras : activeExtras.filter((extra) => extra.category === categoryFilter)

  const categories = Array.from(new Set(activeExtras.map((e) => e.category)))

  const toggleExtra = (extraId: number) => {
    setSelectedExtraIds((prev) => (prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]))
  }

  const selectedExtras = activeExtras.filter((extra) => selectedExtraIds.includes(extra.id))

  const totalExtrasCost = selectedExtras.reduce((sum, extra) => sum + extra.cost, 0)

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Produto não encontrado</h1>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast({
      title: "Produto atualizado com sucesso!",
      description: "As alterações foram salvas.",
    })

    router.push("/admin/produtos")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Produto desativado",
      description: "O produto foi desativado e não aparecerá mais na listagem.",
      variant: "destructive",
    })

    router.push("/admin/produtos")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Editar Produto</h1>
            <p className="text-muted-foreground mt-1">Atualize as informações do produto</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isLoading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Atualize os dados principais do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" defaultValue={product.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referência</Label>
                <Input id="reference" defaultValue={product.reference} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select defaultValue={product.category} required>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Impressão Gráfica Tradicional">Impressão Gráfica Tradicional</SelectItem>
                    <SelectItem value="Têxteis Personalizados">Têxteis Personalizados</SelectItem>
                    <SelectItem value="Comunicação Visual & Grande Formato">
                      Comunicação Visual & Grande Formato
                    </SelectItem>
                    <SelectItem value="Merchandising / Objetos Promocionais">
                      Merchandising / Objetos Promocionais
                    </SelectItem>
                    <SelectItem value="Embalagens Personalizadas">Embalagens Personalizadas</SelectItem>
                    <SelectItem value="Linha Sustentável">Linha Sustentável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitType">Tipo de Unidade</Label>
                <Select defaultValue={product.unitType} required>
                  <SelectTrigger id="unitType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="baseCost">Custo Base (€)</Label>
                <Input id="baseCost" type="number" step="0.01" defaultValue={product.baseCost} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultMargin">Margem Padrão (%)</Label>
                <Input id="defaultMargin" type="number" defaultValue={product.defaultMargin} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extras e Acabamentos</CardTitle>
            <CardDescription>
              Selecione os extras disponíveis para este produto ({selectedExtraIds.length} selecionados)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="extraCategory" className="whitespace-nowrap">
                Filtrar por:
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="extraCategory" className="w-full sm:w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border p-4 space-y-3">
              {filteredExtras.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum extra disponível nesta categoria
                </p>
              ) : (
                filteredExtras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-start space-x-3 rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`extra-${extra.id}`}
                      checked={selectedExtraIds.includes(extra.id)}
                      onCheckedChange={() => toggleExtra(extra.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={`extra-${extra.id}`}
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {extra.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {extra.category} • €{extra.cost.toFixed(2)}/{extra.unitType}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedExtras.length > 0 && (
              <div className="rounded-lg border border-border bg-accent/10 p-4 space-y-2">
                <h4 className="text-sm font-semibold">Extras Selecionados:</h4>
                <div className="space-y-1">
                  {selectedExtras.map((extra) => (
                    <div key={extra.id} className="flex justify-between text-sm">
                      <span>{extra.name}</span>
                      <span className="text-muted-foreground">
                        €{extra.cost.toFixed(2)}/{extra.unitType}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-semibold text-sm">
                  <span>Custo Total de Extras:</span>
                  <span>€{totalExtrasCost.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/produtos">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar o produto "{product.name}". O item não será removido do banco de dados, mas
              deixará de aparecer na listagem e não poderá ser selecionado em novos orçamentos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
