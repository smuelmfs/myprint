"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [isSavingMargin, setIsSavingMargin] = useState(false)
  const [isSavingUnits, setIsSavingUnits] = useState(false)
  const [isSavingCategories, setIsSavingCategories] = useState(false)

  const [defaultMargin, setDefaultMargin] = useState("100")
  const [units, setUnits] = useState(["unidade", "m²", "kg", "peça", "metro"])
  const [newUnit, setNewUnit] = useState("")
  const [categories, setCategories] = useState([
    "Impressão Gráfica Tradicional",
    "Têxteis Personalizados",
    "Comunicação Visual & Grande Formato",
    "Merchandising / Objetos Promocionais",
    "Decoração & Personalização Técnica",
    "Embalagens Personalizadas",
    "Serviços de Produção e Acabamento",
    "Linha Sustentável",
  ])
  const [newCategory, setNewCategory] = useState("")

  const handleSaveMargin = async () => {
    setIsSavingMargin(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingMargin(false)
    toast({
      title: "Margem padrão guardada",
      description: "A margem padrão foi atualizada com sucesso.",
    })
  }

  const handleSaveUnits = async () => {
    setIsSavingUnits(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingUnits(false)
    toast({
      title: "Unidades guardadas",
      description: "As unidades de medida foram atualizadas com sucesso.",
    })
  }

  const handleSaveCategories = async () => {
    setIsSavingCategories(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingCategories(false)
    toast({
      title: "Categorias guardadas",
      description: "As categorias foram atualizadas com sucesso.",
    })
  }

  const addUnit = () => {
    if (newUnit.trim() && !units.includes(newUnit.trim())) {
      setUnits([...units, newUnit.trim()])
      setNewUnit("")
      toast({
        title: "Unidade adicionada",
        description: `A unidade "${newUnit.trim()}" foi adicionada.`,
      })
    }
  }

  const removeUnit = (unit: string) => {
    setUnits(units.filter((u) => u !== unit))
    toast({
      title: "Unidade removida",
      description: `A unidade "${unit}" foi removida.`,
    })
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategory.trim()}" foi adicionada.`,
      })
    }
  }

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
    toast({
      title: "Categoria removida",
      description: `A categoria "${category}" foi removida.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          Configure os parâmetros operacionais do sistema
        </p>
      </div>

      <div className="space-y-6">
        {/* Parâmetros de Margem Padrão */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros de Margem Padrão</CardTitle>
            <CardDescription>
              Defina a margem de lucro padrão global aplicada aos produtos que não tenham margem individual definida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-margin">Margem Padrão (%)</Label>
              <Input
                id="default-margin"
                type="number"
                placeholder="100"
                value={defaultMargin}
                onChange={(e) => setDefaultMargin(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Esta margem será usada como valor base para produtos sem margem específica. Exemplo: 100% significa que
                o preço final será o dobro do custo base.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveMargin}
                disabled={isSavingMargin}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingMargin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Unidades de Medida */}
        <Card>
          <CardHeader>
            <CardTitle>Unidades de Medida</CardTitle>
            <CardDescription>
              Defina as unidades de medida padrão aceitas no sistema para produtos e orçamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Unidades Disponíveis</Label>
              <div className="flex flex-wrap gap-2">
                {units.map((unit) => (
                  <Badge key={unit} variant="secondary" className="text-sm px-3 py-1.5">
                    {unit}
                    <button
                      onClick={() => removeUnit(unit)}
                      className="ml-2 hover:text-destructive transition-colors"
                      aria-label={`Remover ${unit}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-unit">Adicionar Nova Unidade</Label>
              <div className="flex gap-2 max-w-md">
                <Input
                  id="new-unit"
                  placeholder="Ex: litro, cm, hora..."
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addUnit()
                    }
                  }}
                />
                <Button onClick={addUnit} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Estas unidades estarão disponíveis ao criar ou editar produtos
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveUnits}
                disabled={isSavingUnits}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingUnits && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controle de Categorias */}
        <Card>
          <CardHeader>
            <CardTitle>Controle de Categorias</CardTitle>
            <CardDescription>Gerencie as categorias principais de produtos utilizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Categorias Principais</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-sm px-3 py-1.5">
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-2 hover:text-destructive transition-colors"
                      aria-label={`Remover ${category}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-category">Adicionar Nova Categoria</Label>
              <div className="flex gap-2">
                <Input
                  id="new-category"
                  placeholder="Ex: Sinalética, Fotografia..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCategory()
                    }
                  }}
                  className="max-w-md"
                />
                <Button onClick={addCategory} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Estas categorias serão utilizadas ao criar produtos e extras
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveCategories}
                disabled={isSavingCategories}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingCategories && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
