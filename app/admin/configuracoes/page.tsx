"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2, Trash2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Tipos para as configurações
interface Configuracao {
  id: number
  margemPadrao: number
  margensCategoria: MargemCategoria[]
  minimos: MinimoFaturacao[]
  temposPadrao: TempoPadrao[]
}

interface MargemCategoria {
  id: number
  categoria: string
  margem: number
}

interface MinimoFaturacao {
  id: number
  tipo: string
  valor: number
}

interface TempoPadrao {
  id: number
  operacao: string
  tempoMin: number
  valorHora: number
}

interface Unidade {
  id: number
  nome: string
  sigla?: string
}

interface Categoria {
  id: number
  nome: string
  tipo: string
}

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  
  // Estados de loading
  const [isSavingMargin, setIsSavingMargin] = useState(false)
  const [isSavingUnits, setIsSavingUnits] = useState(false)
  const [isSavingCategories, setIsSavingCategories] = useState(false)
  const [isSavingCategoryMargins, setIsSavingCategoryMargins] = useState(false)
  const [isSavingMinimums, setIsSavingMinimums] = useState(false)
  const [isSavingTimes, setIsSavingTimes] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Estados dos dados
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null)
  const [units, setUnits] = useState<Unidade[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])

  // Estados dos formulários
  const [defaultMargin, setDefaultMargin] = useState("100")
  const [newUnit, setNewUnit] = useState("")
  const [newUnitSigla, setNewUnitSigla] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryType, setNewCategoryType] = useState("geral")
  const [newMarginCategory, setNewMarginCategory] = useState("")
  const [newMarginValue, setNewMarginValue] = useState("")
  const [newMinimumType, setNewMinimumType] = useState("")
  const [newMinimumValue, setNewMinimumValue] = useState("")
  const [newOperation, setNewOperation] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newValuePerHour, setNewValuePerHour] = useState("")

  // Estados para controle de alterações
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const initialDataRef = useRef<any>(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  // Detectar mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Tem alterações não salvas. Tem certeza que deseja sair?'
        return 'Tem alterações não salvas. Tem certeza que deseja sair?'
      }
    }

    // Interceptar navegação do Next.js
    const handleRouteChange = (url: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(url)
        setShowExitDialog(true)
        return false
      }
      return true
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Interceptar cliques em links de navegação
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      if (link && hasUnsavedChanges) {
        e.preventDefault()
        setPendingNavigation(link.getAttribute('href') || '')
        setShowExitDialog(true)
      }
    }

    document.addEventListener('click', handleLinkClick)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleLinkClick)
    }
  }, [hasUnsavedChanges])

  // Funções para o modal de confirmação
  const handleExitConfirm = () => {
    setHasUnsavedChanges(false)
    setShowExitDialog(false)
    if (pendingNavigation) {
      window.location.href = pendingNavigation
    }
    setPendingNavigation(null)
  }

  const handleExitCancel = () => {
    setShowExitDialog(false)
    setPendingNavigation(null)
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar configurações
      const configResponse = await fetch("/api/configuracao")
      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfiguracao(configData)
        setDefaultMargin(configData.margemPadrao.toString())
      }

      // Carregar unidades
      const unitsResponse = await fetch("/api/unidades")
      if (unitsResponse.ok) {
        const unitsData = await unitsResponse.json()
        setUnits(unitsData)
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
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMargin = async () => {
    try {
      setIsSavingMargin(true)
      
      const response = await fetch("/api/configuracao", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          margemPadrao: parseFloat(defaultMargin),
        }),
      })

      if (response.ok) {
        const updatedConfig = await response.json()
        setConfiguracao(updatedConfig)
        setHasUnsavedChanges(false)
        toast({
          title: "Margem padrão guardada",
          description: "A margem padrão foi atualizada com sucesso.",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar margem")
      }
    } catch (error) {
      console.error("Erro ao salvar margem:", error)
      toast({
        title: "Erro ao salvar margem",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSavingMargin(false)
    }
  }

  const handleSaveUnits = async () => {
    try {
      setIsSavingUnits(true)
      
      // Identificar unidades novas (com ID temporário)
      const unidadesNovas = units.filter(unit => unit.id > 1000000000) // IDs temporários são baseados em timestamp
      
      // Criar novas unidades
      for (const unidade of unidadesNovas) {
        const response = await fetch("/api/unidades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: unidade.nome,
            sigla: unidade.sigla,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar unidade")
        }
      }
      
      // Recarregar unidades para mostrar as mudanças
      const response = await fetch("/api/unidades")
      if (response.ok) {
        const unitsData = await response.json()
        setUnits(unitsData)
        setHasUnsavedChanges(false)
        toast({
          title: "Unidades guardadas",
          description: "As unidades de medida foram atualizadas com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar unidades:", error)
      toast({
        title: "Erro ao salvar unidades",
        description: error instanceof Error ? error.message : "Erro ao atualizar unidades.",
        variant: "destructive",
      })
    } finally {
      setIsSavingUnits(false)
    }
  }

  const handleSaveCategories = async () => {
    try {
      setIsSavingCategories(true)
      
      // Identificar categorias novas (com ID temporário)
      const categoriasNovas = categories.filter(category => category.id > 1000000000) // IDs temporários são baseados em timestamp
      
      // Criar novas categorias
      for (const categoria of categoriasNovas) {
        const response = await fetch("/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: categoria.nome,
            tipo: categoria.tipo,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar categoria")
        }
      }
      
      // Recarregar categorias para mostrar as mudanças
      const response = await fetch("/api/categorias")
      if (response.ok) {
        const categoriesData = await response.json()
        setCategories(categoriesData)
        setHasUnsavedChanges(false)
        toast({
          title: "Categorias guardadas",
          description: "As categorias foram atualizadas com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar categorias:", error)
      toast({
        title: "Erro ao salvar categorias",
        description: error instanceof Error ? error.message : "Erro ao atualizar categorias.",
        variant: "destructive",
      })
    } finally {
      setIsSavingCategories(false)
    }
  }

  const addUnit = () => {
    if (!newUnit.trim()) return

    // Verificar se já existe
    const existingUnit = units.find(u => u.nome.toLowerCase() === newUnit.trim().toLowerCase())
    if (existingUnit) {
      setErrors({ unit: "Esta unidade já existe" })
      return
    }

    // Adicionar apenas ao estado local (não salvar no banco ainda)
    const novaUnidade = {
      id: Date.now(), // ID temporário
      nome: newUnit.trim(),
      sigla: newUnitSigla.trim() || undefined,
    }
    
    setUnits([...units, novaUnidade])
    setNewUnit("")
    setNewUnitSigla("")
    setHasUnsavedChanges(true)
    setErrors({})
    
    toast({
      title: "Unidade adicionada",
      description: `A unidade "${newUnit.trim()}" foi adicionada. Lembre-se de guardar as alterações.`,
    })
  }

  const removeUnit = async (unitId: number) => {
    try {
      // Se é um item do banco (ID < 1000000000), remover do banco
      if (unitId < 1000000000) {
        const response = await fetch(`/api/unidades?id=${unitId}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao remover unidade")
        }
      }
      
      // Remover do estado local
      setUnits(units.filter((u) => u.id !== unitId))
      setHasUnsavedChanges(true)
      toast({
        title: "Unidade removida",
        description: "A unidade foi removida. Lembre-se de guardar as alterações.",
      })
    } catch (error) {
      console.error("Erro ao remover unidade:", error)
      toast({
        title: "Erro ao remover unidade",
        description: error instanceof Error ? error.message : "Erro ao remover unidade.",
        variant: "destructive",
      })
    }
  }

  const addCategory = () => {
    if (!newCategory.trim()) return

    // Verificar se já existe
    const existingCategory = categories.find(c => c.nome.toLowerCase() === newCategory.trim().toLowerCase())
    if (existingCategory) {
      setErrors({ category: "Esta categoria já existe" })
      return
    }

    // Adicionar apenas ao estado local (não salvar no banco ainda)
    const novaCategoria = {
      id: Date.now(), // ID temporário
      nome: newCategory.trim(),
      tipo: newCategoryType,
    }
    
    setCategories([...categories, novaCategoria])
    setNewCategory("")
    setNewCategoryType("geral")
    setHasUnsavedChanges(true)
    setErrors({})
    
    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategory.trim()}" foi adicionada. Lembre-se de guardar as alterações.`,
    })
  }

  const removeCategory = async (categoryId: number) => {
    try {
      // Se é um item do banco (ID < 1000000000), remover do banco
      if (categoryId < 1000000000) {
        const response = await fetch(`/api/categorias?id=${categoryId}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao remover categoria")
        }
      }
      
      // Remover do estado local
      setCategories(categories.filter((c) => c.id !== categoryId))
      setHasUnsavedChanges(true)
      toast({
        title: "Categoria removida",
        description: "A categoria foi removida. Lembre-se de guardar as alterações.",
      })
    } catch (error) {
      console.error("Erro ao remover categoria:", error)
      toast({
        title: "Erro ao remover categoria",
        description: error instanceof Error ? error.message : "Erro ao remover categoria.",
        variant: "destructive",
      })
    }
  }

  const handleSaveCategoryMargins = async () => {
    try {
      setIsSavingCategoryMargins(true)
      
      // Identificar margens novas (com ID temporário)
      const margensNovas = configuracao?.margensCategoria.filter(margin => margin.id > 1000000000) || []
      
      // Criar novas margens
      for (const margem of margensNovas) {
        const response = await fetch("/api/configuracao/margens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoria: margem.categoria,
            margem: margem.margem,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar margem")
        }
      }
      
      // Recarregar configurações para mostrar as mudanças
      const response = await fetch("/api/configuracao")
      if (response.ok) {
        const configData = await response.json()
        setConfiguracao(configData)
        setHasUnsavedChanges(false)
        toast({
          title: "Margens por categoria guardadas",
          description: "As margens por categoria foram atualizadas com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar margens por categoria:", error)
      toast({
        title: "Erro ao salvar margens",
        description: error instanceof Error ? error.message : "Erro ao atualizar margens por categoria.",
        variant: "destructive",
      })
    } finally {
      setIsSavingCategoryMargins(false)
    }
  }

  const addCategoryMargin = () => {
    if (!newMarginCategory || !newMarginValue) return

    // Verificar se já existe margem para esta categoria
    const existingMargin = configuracao?.margensCategoria.find(m => m.categoria === newMarginCategory)
    if (existingMargin) {
      setErrors({ margin: "Já existe uma margem para esta categoria" })
      return
    }

    // Adicionar apenas ao estado local (não salvar no banco ainda)
    const novaMargem = {
      id: Date.now(), // ID temporário
      categoria: newMarginCategory,
      margem: parseFloat(newMarginValue),
    }
    
    if (configuracao) {
      setConfiguracao({
        ...configuracao,
        margensCategoria: [...configuracao.margensCategoria, novaMargem],
      })
    }
    setNewMarginCategory("")
    setNewMarginValue("")
    setHasUnsavedChanges(true)
    setErrors({})
    
    toast({
      title: "Margem adicionada",
      description: `Margem para "${newMarginCategory}" foi adicionada. Lembre-se de guardar as alterações.`,
    })
  }

  const removeCategoryMargin = async (id: number) => {
    try {
      // Se é um item do banco (ID < 1000000000), remover do banco
      if (id < 1000000000) {
        const response = await fetch(`/api/configuracao/margens?id=${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao remover margem")
        }
      }
      
      // Remover do estado local
      if (configuracao) {
        setConfiguracao({
          ...configuracao,
          margensCategoria: configuracao.margensCategoria.filter((m) => m.id !== id),
        })
      }
      setHasUnsavedChanges(true)
      toast({
        title: "Margem removida",
        description: "A margem foi removida. Lembre-se de guardar as alterações.",
      })
    } catch (error) {
      console.error("Erro ao remover margem:", error)
      toast({
        title: "Erro ao remover margem",
        description: error instanceof Error ? error.message : "Erro ao remover margem.",
        variant: "destructive",
      })
    }
  }

  const handleSaveMinimums = async () => {
    try {
      setIsSavingMinimums(true)
      
      // Identificar mínimos novos (com ID temporário)
      const minimosNovos = configuracao?.minimos.filter(minimo => minimo.id > 1000000000) || []
      
      // Criar novos mínimos
      for (const minimo of minimosNovos) {
        const response = await fetch("/api/configuracao/minimos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo: minimo.tipo,
            valor: minimo.valor,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar mínimo")
        }
      }
      
      // Recarregar configurações para mostrar as mudanças
      const response = await fetch("/api/configuracao")
      if (response.ok) {
        const configData = await response.json()
        setConfiguracao(configData)
        setHasUnsavedChanges(false)
        toast({
          title: "Mínimos de faturação guardados",
          description: "Os mínimos de faturação foram atualizados com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar mínimos:", error)
      toast({
        title: "Erro ao salvar mínimos",
        description: error instanceof Error ? error.message : "Erro ao atualizar mínimos de faturação.",
        variant: "destructive",
      })
    } finally {
      setIsSavingMinimums(false)
    }
  }

  const addMinimumBilling = () => {
    if (!newMinimumType || !newMinimumValue) return

    // Verificar se já existe mínimo para este tipo
    const existingMinimum = configuracao?.minimos.find(m => m.tipo === newMinimumType)
    if (existingMinimum) {
      setErrors({ minimum: "Já existe um mínimo para este tipo" })
      return
    }

    // Adicionar apenas ao estado local (não salvar no banco ainda)
    const novoMinimo = {
      id: Date.now(), // ID temporário
      tipo: newMinimumType,
      valor: parseFloat(newMinimumValue),
    }
    
    if (configuracao) {
      setConfiguracao({
        ...configuracao,
        minimos: [...configuracao.minimos, novoMinimo],
      })
    }
    setNewMinimumType("")
    setNewMinimumValue("")
    setHasUnsavedChanges(true)
    setErrors({})
    
    toast({
      title: "Mínimo adicionado",
      description: `Mínimo "${newMinimumType}" foi adicionado. Lembre-se de guardar as alterações.`,
    })
  }

  const removeMinimumBilling = async (id: number) => {
    try {
      // Se é um item do banco (ID < 1000000000), remover do banco
      if (id < 1000000000) {
        const response = await fetch(`/api/configuracao/minimos?id=${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao remover mínimo")
        }
      }
      
      // Remover do estado local
      if (configuracao) {
        setConfiguracao({
          ...configuracao,
          minimos: configuracao.minimos.filter((m) => m.id !== id),
        })
      }
      setHasUnsavedChanges(true)
      toast({
        title: "Mínimo removido",
        description: "O mínimo foi removido. Lembre-se de guardar as alterações.",
      })
    } catch (error) {
      console.error("Erro ao remover mínimo:", error)
      toast({
        title: "Erro ao remover mínimo",
        description: error instanceof Error ? error.message : "Erro ao remover mínimo.",
        variant: "destructive",
      })
    }
  }

  const handleSaveTimes = async () => {
    try {
      setIsSavingTimes(true)
      
      // Identificar tempos novos (com ID temporário)
      const temposNovos = configuracao?.temposPadrao.filter(tempo => tempo.id > 1000000000) || []
      
      // Criar novos tempos
      for (const tempo of temposNovos) {
        const response = await fetch("/api/configuracao/tempos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operacao: tempo.operacao,
            tempoMin: tempo.tempoMin,
            valorHora: tempo.valorHora,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar tempo")
        }
      }
      
      // Recarregar configurações para mostrar as mudanças
      const response = await fetch("/api/configuracao")
      if (response.ok) {
        const configData = await response.json()
        setConfiguracao(configData)
        setHasUnsavedChanges(false)
        toast({
          title: "Tempos padrão guardados",
          description: "Os tempos padrão foram atualizados com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar tempos:", error)
      toast({
        title: "Erro ao salvar tempos",
        description: error instanceof Error ? error.message : "Erro ao atualizar tempos padrão.",
        variant: "destructive",
      })
    } finally {
      setIsSavingTimes(false)
    }
  }

  const addStandardTime = () => {
    if (!newOperation || !newTime || !newValuePerHour) return

    // Verificar se já existe tempo para esta operação
    const existingTime = configuracao?.temposPadrao.find(t => t.operacao === newOperation)
    if (existingTime) {
      setErrors({ time: "Já existe um tempo para esta operação" })
      return
    }

    // Adicionar apenas ao estado local (não salvar no banco ainda)
    const novoTempo = {
      id: Date.now(), // ID temporário
      operacao: newOperation,
      tempoMin: parseInt(newTime),
      valorHora: parseFloat(newValuePerHour),
    }
    
    if (configuracao) {
      setConfiguracao({
        ...configuracao,
        temposPadrao: [...configuracao.temposPadrao, novoTempo],
      })
    }
    setNewOperation("")
    setNewTime("")
    setNewValuePerHour("")
    setHasUnsavedChanges(true)
    setErrors({})
    
    toast({
      title: "Tempo padrão adicionado",
      description: `Tempo para "${newOperation}" foi adicionado. Lembre-se de guardar as alterações.`,
    })
  }

  const removeStandardTime = async (id: number) => {
    try {
      // Se é um item do banco (ID < 1000000000), remover do banco
      if (id < 1000000000) {
        const response = await fetch(`/api/configuracao/tempos?id=${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao remover tempo")
        }
      }
      
      // Remover do estado local
      if (configuracao) {
        setConfiguracao({
          ...configuracao,
          temposPadrao: configuracao.temposPadrao.filter((t) => t.id !== id),
        })
      }
      setHasUnsavedChanges(true)
      toast({
        title: "Tempo padrão removido",
        description: "O tempo padrão foi removido. Lembre-se de guardar as alterações.",
      })
    } catch (error) {
      console.error("Erro ao remover tempo:", error)
      toast({
        title: "Erro ao remover tempo",
        description: error instanceof Error ? error.message : "Erro ao remover tempo.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Configurações</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Configure os parâmetros operacionais do sistema
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando configurações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          Configure os parâmetros operacionais do sistema
        </p>
      </div>

      {/* Aviso de alterações não salvas */}
      {hasUnsavedChanges && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Tem alterações não salvas. Lembre-se de guardar as alterações antes de sair da página.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 1. Unidades de Medida - Base para tudo */}
        <Card>
          <CardHeader>
            <CardTitle>Unidades de Medida</CardTitle>
            <CardDescription>
              Defina as unidades de medida padrão aceitas no sistema para produtos e orçamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibir erros */}
            {errors.unit && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.unit}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label>Unidades Disponíveis</Label>
              <div className="flex flex-wrap gap-2">
                {units.map((unit) => (
                  <Badge key={unit.id} variant="secondary" className="text-sm px-3 py-1.5">
                    {unit.nome} {unit.sigla && `(${unit.sigla})`}
                    <button
                      onClick={() => removeUnit(unit.id)}
                      className="ml-2 hover:text-destructive transition-colors"
                      aria-label={`Remover ${unit.nome}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-unit">Adicionar Nova Unidade</Label>
              <div className="grid gap-2 sm:grid-cols-2 max-w-md">
                <div className="space-y-1">
                  <Label htmlFor="new-unit-name">Nome</Label>
                  <Input
                    id="new-unit-name"
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
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-unit-sigla">Sigla (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-unit-sigla"
                      placeholder="Ex: L, cm, h..."
                      value={newUnitSigla}
                      onChange={(e) => setNewUnitSigla(e.target.value)}
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
                </div>
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

        {/* 2. Controle de Categorias - Base para produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Controle de Categorias</CardTitle>
            <CardDescription>Gerencie as categorias principais de produtos utilizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibir erros */}
            {errors.category && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.category}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label>Categorias Principais</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary" className="text-sm px-3 py-1.5">
                    {category.nome} <span className="text-muted-foreground">({category.tipo})</span>
                    <button
                      onClick={() => removeCategory(category.id)}
                      className="ml-2 hover:text-destructive transition-colors"
                      aria-label={`Remover ${category.nome}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="new-category">Adicionar Nova Categoria</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-category-name">Nome</Label>
                  <Input
                    id="new-category-name"
                    placeholder="Ex: Sinalética, Fotografia..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addCategory()
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category-type">Tipo</Label>
                  <div className="flex gap-2">
                    <Select value={newCategoryType} onValueChange={setNewCategoryType}>
                      <SelectTrigger id="new-category-type" className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Geral</SelectItem>
                        <SelectItem value="produto">Produto</SelectItem>
                        <SelectItem value="extra">Extra</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addCategory} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

        {/* 3. Parâmetros de Margem Padrão - Configuração base */}
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

        {/* 4. Margens por Categoria - Específicas */}
        <Card>
          <CardHeader>
            <CardTitle>Margens por Categoria</CardTitle>
            <CardDescription>Defina margens de lucro específicas para cada categoria de produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibir erros */}
            {errors.margin && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.margin}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label>Margens Configuradas</Label>
              <div className="space-y-2">
                {configuracao?.margensCategoria.map((margin) => (
                  <div key={margin.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{margin.categoria}</p>
                      <p className="text-sm text-muted-foreground">Margem: {margin.margem}%</p>
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
                        <SelectItem key={cat.id} value={cat.nome}>
                          {cat.nome}
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

        {/* 5. Mínimos de Faturação - Regras de negócio */}
        <Card>
          <CardHeader>
            <CardTitle>Mínimos de Faturação</CardTitle>
            <CardDescription>Configure os valores mínimos de faturação por tipo de cobrança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibir erros */}
            {errors.minimum && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.minimum}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label>Mínimos Configurados</Label>
              <div className="space-y-2">
                {configuracao?.minimos.map((minimum) => (
                  <div key={minimum.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">Por {minimum.tipo}</p>
                      <p className="text-sm text-muted-foreground">Valor mínimo: €{minimum.valor}</p>
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
                  <Input
                    id="new-minimum-type"
                    placeholder="Ex: Peça, m², Lote, Litro, Metro..."
                    value={newMinimumType}
                    onChange={(e) => setNewMinimumType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addMinimumBilling()
                      }
                    }}
                  />
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

        {/* 6. Tempos Padrão - Operacionais */}
        <Card>
          <CardHeader>
            <CardTitle>Tempos Padrão</CardTitle>
            <CardDescription>Configure os tempos médios e valores por hora para operações de produção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibir erros */}
            {errors.time && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.time}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label>Tempos Configurados</Label>
              <div className="space-y-2">
                {configuracao?.temposPadrao.map((time) => (
                  <div key={time.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{time.operacao}</p>
                      <p className="text-sm text-muted-foreground">
                        Tempo: {time.tempoMin} min | Valor/hora: €{time.valorHora}
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
      </div>

      {/* Modal de confirmação para sair com alterações não salvas */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Tem alterações não salvas. Se sair agora, perderá todas as alterações feitas. 
              Tem certeza que deseja sair sem guardar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sair sem guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
