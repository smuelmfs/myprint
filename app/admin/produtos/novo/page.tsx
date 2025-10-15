"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { mockExtras } from "@/lib/mock-data/extras"
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

export default function NovoProdutoPage() {
  const router = useRouter()
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [productType, setProductType] = useState<string>("")

  const activeExtras = mockExtras.filter((extra) => extra.status === 1)

  const filteredExtras =
    categoryFilter === "all" ? activeExtras : activeExtras.filter((extra) => extra.category === categoryFilter)

  const categories = Array.from(new Set(activeExtras.map((e) => e.category)))

  const toggleExtra = (extraId: number) => {
    setSelectedExtraIds((prev) => (prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]))
  }

  const selectedExtras = activeExtras.filter((extra) => selectedExtraIds.includes(extra.id))

  const totalExtrasCost = selectedExtras.reduce((sum, extra) => sum + extra.cost, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted with selected extras:", selectedExtraIds)
    // Form submission logic will be implemented later
    router.push("/admin/produtos")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Novo Produto</h1>
          <p className="text-muted-foreground mt-1">Adicione um novo produto ao catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Preencha os dados principais do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" placeholder="Ex: Cartões de Visita" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referência</Label>
                <Input id="reference" placeholder="Ex: CV-001" required />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select required>
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

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="unitType">Unidade de Medida</Label>
                <Select required>
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
                <Select required>
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
                <Input id="format" placeholder="Ex: A4, 85x55mm" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descrição detalhada do produto" rows={3} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="baseCost">Custo Base (€)</Label>
                <Input id="baseCost" type="number" step="0.01" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultMargin">Margem Padrão (%)</Label>
                <Input id="defaultMargin" type="number" placeholder="100" required />
              </div>
            </div>

            {(productType === "flyer_folheto" ||
              productType === "cartao_visita" ||
              productType === "brochura_catalogo") && (
              <div className="grid gap-3 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="paperType">Tipo de Papel</Label>
                  <Select>
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
                  <Input id="paperWeight" type="number" placeholder="Ex: 300" />
                </div>
                {productType === "brochura_catalogo" && (
                  <div className="space-y-2">
                    <Label htmlFor="pages">Número de Páginas</Label>
                    <Input id="pages" type="number" placeholder="Ex: 16" />
                  </div>
                )}
              </div>
            )}

            {(productType === "banner_lona" || productType === "adesivo_vinil") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select>
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
                  <Input id="width" type="number" step="0.01" placeholder="Ex: 1.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (m)</Label>
                  <Input id="height" type="number" step="0.01" placeholder="Ex: 2.0" />
                </div>
              </div>
            )}

            {productType === "tshirt_textil" && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="fabricType">Tipo de Tecido</Label>
                  <Select>
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
                  <Input id="printArea" placeholder="Ex: A4, 30x40cm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printMethod">Método de Impressão</Label>
                  <Select>
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
                  <Select>
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
                  <Input id="dimensions" placeholder="Ex: 10x10x10cm" />
                </div>
              </div>
            )}

            {(productType === "placa_acrilico" || productType === "roll_up") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="supportMaterial">Material do Suporte</Label>
                  <Select>
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
                  <Input id="thickness" type="number" placeholder="Ex: 3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finish">Acabamento</Label>
                  <Select>
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
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Salvar Produto
          </Button>
        </div>
      </form>
    </div>
  )
}
