"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [isSavingMargin, setIsSavingMargin] = useState(false)
  const [isSavingUnits, setIsSavingUnits] = useState(false)
  const [isSavingCategories, setIsSavingCategories] = useState(false)
  const [isSavingCategoryMargins, setIsSavingCategoryMargins] = useState(false)
  const [isSavingMinimums, setIsSavingMinimums] = useState(false)
  const [isSavingTimes, setIsSavingTimes] = useState(false)

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

  const [categoryMargins, setCategoryMargins] = useState([
    { id: 1, category: "Impressão Gráfica Tradicional", margin: "120" },
    { id: 2, category: "Têxteis Personalizados", margin: "150" },
    { id: 3, category: "Grande Formato", margin: "100" },
  ])
  const [newMarginCategory, setNewMarginCategory] = useState("")
  const [newMarginValue, setNewMarginValue] = useState("")

  const [minimumBilling, setMinimumBilling] = useState([
    { id: 1, type: "por peça", value: "5.00" },
    { id: 2, type: "por m²", value: "15.00" },
  ])
  const [newMinimumType, setNewMinimumType] = useState("")
  const [newMinimumValue, setNewMinimumValue] = useState("")

  const [standardTimes, setStandardTimes] = useState([
    { id: 1, operation: "Corte", time: "15", valuePerHour: "25.00" },
    { id: 2, operation: "Laminação", time: "30", valuePerHour: "30.00" },
    { id: 3, operation: "Montagem", time: "45", valuePerHour: "20.00" },
  ])
  const [newOperation, setNewOperation] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newValuePerHour, setNewValuePerHour] = useState("")

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

  const handleSaveCategoryMargins = async () => {
    setIsSavingCategoryMargins(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingCategoryMargins(false)
    toast({
      title: "Margens por categoria guardadas",
      description: "As margens por categoria foram atualizadas com sucesso.",
    })
  }

  const addCategoryMargin = () => {
    if (newMarginCategory && newMarginValue) {
      const newId = Math.max(...categoryMargins.map((m) => m.id), 0) + 1
      setCategoryMargins([...categoryMargins, { id: newId, category: newMarginCategory, margin: newMarginValue }])
      setNewMarginCategory("")
      setNewMarginValue("")
      toast({
        title: "Margem adicionada",
        description: `Margem para "${newMarginCategory}" foi adicionada.`,
      })
    }
  }

  const removeCategoryMargin = (id: number) => {
    setCategoryMargins(categoryMargins.filter((m) => m.id !== id))
    toast({
      title: "Margem removida",
      description: "A margem foi removida com sucesso.",
    })
  }

  const handleSaveMinimums = async () => {
    setIsSavingMinimums(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingMinimums(false)
    toast({
      title: "Mínimos de faturação guardados",
      description: "Os mínimos de faturação foram atualizados com sucesso.",
    })
  }

  const addMinimumBilling = () => {
    if (newMinimumType && newMinimumValue) {
      const newId = Math.max(...minimumBilling.map((m) => m.id), 0) + 1
      setMinimumBilling([...minimumBilling, { id: newId, type: newMinimumType, value: newMinimumValue }])
      setNewMinimumType("")
      setNewMinimumValue("")
      toast({
        title: "Mínimo adicionado",
        description: `Mínimo "${newMinimumType}" foi adicionado.`,
      })
    }
  }

  const removeMinimumBilling = (id: number) => {
    setMinimumBilling(minimumBilling.filter((m) => m.id !== id))
    toast({
      title: "Mínimo removido",
      description: "O mínimo foi removido com sucesso.",
    })
  }

  const handleSaveTimes = async () => {
    setIsSavingTimes(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSavingTimes(false)
    toast({
      title: "Tempos padrão guardados",
      description: "Os tempos padrão foram atualizados com sucesso.",
    })
  }

  const addStandardTime = () => {
    if (newOperation && newTime && newValuePerHour) {
      const newId = Math.max(...standardTimes.map((t) => t.id), 0) + 1
      setStandardTimes([
        ...standardTimes,
        { id: newId, operation: newOperation, time: newTime, valuePerHour: newValuePerHour },
      ])
      setNewOperation("")
      setNewTime("")
      setNewValuePerHour("")
      toast({
        title: "Tempo padrão adicionado",
        description: `Tempo para "${newOperation}" foi adicionado.`,
      })
    }
  }

  const removeStandardTime = (id: number) => {
    setStandardTimes(standardTimes.filter((t) => t.id !== id))
    toast({
      title: "Tempo padrão removido",
      description: "O tempo padrão foi removido com sucesso.",
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

        {/* Margens por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Margens por Categoria</CardTitle>
            <CardDescription>Defina margens de lucro específicas para cada categoria de produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Margens Configuradas</Label>
              <div className="space-y-2">
                {categoryMargins.map((margin) => (
                  <div key={margin.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{margin.category}</p>
                      <p className="text-sm text-muted-foreground">Margem: {margin.margin}%</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategoryMargin(margin.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <Label>Adicionar Nova Margem</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-margin-category">Categoria</Label>
                  <Select value={newMarginCategory} onValueChange={setNewMarginCategory}>
                    <SelectTrigger id="new-margin-category" className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-margin-value">Margem Padrão (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-margin-value"
                      type="number"
                      placeholder="100"
                      value={newMarginValue}
                      onChange={(e) => setNewMarginValue(e.target.value)}
                    />
                    <Button onClick={addCategoryMargin} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveCategoryMargins}
                disabled={isSavingCategoryMargins}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingCategoryMargins && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mínimos de Faturação */}
        <Card>
          <CardHeader>
            <CardTitle>Mínimos de Faturação</CardTitle>
            <CardDescription>Configure os valores mínimos de faturação por tipo de cobrança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Mínimos Configurados</Label>
              <div className="space-y-2">
                {minimumBilling.map((minimum) => (
                  <div key={minimum.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">{minimum.type}</p>
                      <p className="text-sm text-muted-foreground">Valor mínimo: €{minimum.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMinimumBilling(minimum.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <Label>Adicionar Novo Mínimo</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-minimum-type">Tipo</Label>
                  <Select value={newMinimumType} onValueChange={setNewMinimumType}>
                    <SelectTrigger id="new-minimum-type" className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="por peça">Por Peça</SelectItem>
                      <SelectItem value="por m²">Por m²</SelectItem>
                      <SelectItem value="por lote">Por Lote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-minimum-value">Valor Mínimo (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-minimum-value"
                      type="number"
                      step="0.01"
                      placeholder="5.00"
                      value={newMinimumValue}
                      onChange={(e) => setNewMinimumValue(e.target.value)}
                    />
                    <Button onClick={addMinimumBilling} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveMinimums}
                disabled={isSavingMinimums}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingMinimums && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tempos Padrão */}
        <Card>
          <CardHeader>
            <CardTitle>Tempos Padrão</CardTitle>
            <CardDescription>Configure os tempos médios e valores por hora para operações de produção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Tempos Configurados</Label>
              <div className="space-y-2">
                {standardTimes.map((time) => (
                  <div key={time.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{time.operation}</p>
                      <p className="text-sm text-muted-foreground">
                        Tempo: {time.time} min | Valor/hora: €{time.valuePerHour}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStandardTime(time.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <Label>Adicionar Novo Tempo</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="new-operation">Operação</Label>
                  <Input
                    id="new-operation"
                    placeholder="Ex: Corte, Laminação..."
                    value={newOperation}
                    onChange={(e) => setNewOperation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-time">Tempo Médio (min)</Label>
                  <Input
                    id="new-time"
                    type="number"
                    placeholder="30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-value-per-hour">Valor/Hora (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-value-per-hour"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                      value={newValuePerHour}
                      onChange={(e) => setNewValuePerHour(e.target.value)}
                    />
                    <Button onClick={addStandardTime} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSaveTimes}
                disabled={isSavingTimes}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSavingTimes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
