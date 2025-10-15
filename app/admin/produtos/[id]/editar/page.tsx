"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
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
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPE_OPTIONS,
  UNIT_TYPES,
  COLOR_TYPE_OPTIONS,
  PAPER_TYPES,
  LARGE_FORMAT_MATERIALS,
  FABRIC_TYPES,
  PRINT_METHODS,
  OBJECT_MATERIALS,
  SUPPORT_MATERIALS,
  FINISH_TYPES,
} from "@/lib/mock-data/products"

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productType, setProductType] = useState<string>("")
  const [paperType, setPaperType] = useState<string>("")
  const [material, setMaterial] = useState<string>("")
  const [fabricType, setFabricType] = useState<string>("")
  const [printMethod, setPrintMethod] = useState<string>("")
  const [objectMaterial, setObjectMaterial] = useState<string>("")
  const [supportMaterial, setSupportMaterial] = useState<string>("")
  const [finish, setFinish] = useState<string>("")

  const { id } = params
  const product = mockProducts.find((p) => p.id === Number.parseInt(id))

  useEffect(() => {
    if (product) {
      if (product.productType) setProductType(product.productType)
      if (product.paperType) setPaperType(product.paperType)
      if (product.material) setMaterial(product.material)
      if (product.fabricType) setFabricType(product.fabricType)
      if (product.printMethod) setPrintMethod(product.printMethod)
      if (product.objectMaterial) setObjectMaterial(product.objectMaterial)
      if (product.supportMaterial) setSupportMaterial(product.supportMaterial)
      if (product.finish) setFinish(product.finish)
    }
  }, [product])

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

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" defaultValue={product.description} rows={3} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select defaultValue={product.category} required>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productType">Tipo de Produto</Label>
                <Select value={productType} onValueChange={setProductType} required>
                  <SelectTrigger id="productType" className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="unitType">Unidade de Medida</Label>
                <Select defaultValue={product.unitType} required>
                  <SelectTrigger id="unitType" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_TYPES.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorType">Tipo de Cor</Label>
                <Select defaultValue={product.colorType} required>
                  <SelectTrigger id="colorType" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_TYPE_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Input id="format" defaultValue={product.format} required />
              </div>
            </div>

            {(productType === "flyer_folheto" ||
              productType === "cartao_visita" ||
              productType === "brochura_catalogo") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="paperType">Tipo de Papel</Label>
                  <Select value={paperType || undefined} onValueChange={setPaperType}>
                    <SelectTrigger id="paperType" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAPER_TYPES.map((paper) => (
                        <SelectItem key={paper.value} value={paper.value}>
                          {paper.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperWeight">Gramagem (g/m²)</Label>
                  <Input id="paperWeight" type="number" defaultValue={product.paperWeight} />
                </div>
                {productType === "brochura_catalogo" && (
                  <div className="space-y-2">
                    <Label htmlFor="pages">Número de Páginas</Label>
                    <Input id="pages" type="number" defaultValue={product.pages} />
                  </div>
                )}
              </div>
            )}

            {(productType === "banner_lona" || productType === "adesivo_vinil") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select value={material || undefined} onValueChange={setMaterial}>
                    <SelectTrigger id="material" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {LARGE_FORMAT_MATERIALS.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Largura (m)</Label>
                  <Input id="width" type="number" step="0.01" defaultValue={product.width} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (m)</Label>
                  <Input id="height" type="number" step="0.01" defaultValue={product.height} />
                </div>
              </div>
            )}

            {productType === "tshirt_textil" && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="fabricType">Tipo de Tecido</Label>
                  <Select value={fabricType || undefined} onValueChange={setFabricType}>
                    <SelectTrigger id="fabricType" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FABRIC_TYPES.map((fabric) => (
                        <SelectItem key={fabric.value} value={fabric.value}>
                          {fabric.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printArea">Área de Impressão</Label>
                  <Input id="printArea" defaultValue={product.printArea} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printMethod">Método de Impressão</Label>
                  <Select value={printMethod || undefined} onValueChange={setPrintMethod}>
                    <SelectTrigger id="printMethod" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRINT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(productType === "caneca_chaveiro" || productType === "caixa_embalagem") && (
              <div className="grid gap-4 md:grid-cols-2 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="objectMaterial">Material do Objeto</Label>
                  <Select value={objectMaterial || undefined} onValueChange={setObjectMaterial}>
                    <SelectTrigger id="objectMaterial" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {OBJECT_MATERIALS.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensões</Label>
                  <Input id="dimensions" defaultValue={product.dimensions} />
                </div>
              </div>
            )}

            {(productType === "placa_acrilico" || productType === "roll_up") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="supportMaterial">Material do Suporte</Label>
                  <Select value={supportMaterial || undefined} onValueChange={setSupportMaterial}>
                    <SelectTrigger id="supportMaterial" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_MATERIALS.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thickness">Espessura (mm)</Label>
                  <Input id="thickness" type="number" defaultValue={product.thickness} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finish">Acabamento</Label>
                  <Select value={finish || undefined} onValueChange={setFinish}>
                    <SelectTrigger id="finish" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINISH_TYPES.map((finish) => (
                        <SelectItem key={finish.value} value={finish.value}>
                          {finish.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Tem certeza que deseja excluir o produto "${product.name}"? O item não poderá mais ser utilizado.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
