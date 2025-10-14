"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { mockExtras } from "@/lib/mock-data/extras"

export default function NovoProdutoPage() {
  const router = useRouter()
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([])
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
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" placeholder="Ex: Cartões de Visita" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referência</Label>
                <Input id="reference" placeholder="Ex: CV-001" required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="papelaria">Papelaria</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sinalizacao">Sinalização</SelectItem>
                    <SelectItem value="adesivos">Adesivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitType">Tipo de Unidade</Label>
                <Select required>
                  <SelectTrigger id="unitType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="m2">m²</SelectItem>
                    <SelectItem value="peca">Peça</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="baseCost">Custo Base (€)</Label>
                <Input id="baseCost" type="number" step="0.01" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultMargin">Margem Padrão (%)</Label>
                <Input id="defaultMargin" type="number" placeholder="100" required />
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
