"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

// Tipos
interface Categoria {
  id: number
  nome: string
}

interface Unidade {
  id: number
  nome: string
  sigla?: string
}

interface Configuracao {
  id: number
  margemPadrao: number
  margensCategoria: Array<{
    id: number
    categoria: string
    margem: number
  }>
}

export default function NovoExtraPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    unidadeId: "",
    tipoAplicacao: "",
    unidadeCobranca: "",
    custoBase: "",
    margemPadrao: "",
    unidadeTipo: "",
    unidadeFaturamento: "",
    tipoAplicacao2: "",
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar categorias
      const categoriesResponse = await fetch("/api/categorias")
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategorias(categoriesData)
      }

      // Carregar unidades
      const unitsResponse = await fetch("/api/unidades")
      if (unitsResponse.ok) {
        const unitsData = await unitsResponse.json()
        setUnidades(unitsData)
      }

      // Carregar configurações
      const configResponse = await fetch("/api/configuracao")
      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfiguracao(configData)
        // Definir margem padrão baseada na configuração
        setFormData(prev => ({
          ...prev,
          margemPadrao: configData.margemPadrao.toString()
        }))
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular margem baseada na categoria selecionada
  const calcularMargemPorCategoria = (categoriaId: string) => {
    if (!configuracao || !categoriaId) return formData.margemPadrao

    const categoria = categorias.find(c => c.id.toString() === categoriaId)
    if (!categoria) return formData.margemPadrao

    const margemCategoria = configuracao.margensCategoria.find(
      mc => mc.categoria === categoria.nome
    )

    return margemCategoria ? margemCategoria.margem.toString() : formData.margemPadrao
  }

  // Atualizar margem quando categoria mudar
  useEffect(() => {
    if (formData.categoriaId) {
      const novaMargem = calcularMargemPorCategoria(formData.categoriaId)
      setFormData(prev => ({
        ...prev,
        margemPadrao: novaMargem
      }))
    }
  }, [formData.categoriaId, configuracao, categorias])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.categoriaId || !formData.unidadeId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch("/api/extras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          custoBase: parseFloat(formData.custoBase) || 0,
          margemPadrao: parseFloat(formData.margemPadrao) || 0,
          categoriaId: parseInt(formData.categoriaId),
          unidadeId: parseInt(formData.unidadeId),
        }),
      })

      if (response.ok) {
        toast({
          title: "Extra criado",
          description: "O extra foi criado com sucesso.",
        })
        router.push("/admin/extras")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao criar extra")
      }
    } catch (error) {
      console.error("Erro ao criar extra:", error)
      toast({
        title: "Erro ao criar extra",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/extras">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Novo Extra</h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Crie um novo extra ou acabamento
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/extras">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Novo Extra</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Crie um novo extra ou acabamento
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados essenciais do extra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Extra *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Laminação Brilho"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoriaId} onValueChange={(value) => handleInputChange("categoriaId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descrição detalhada do extra"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações de Unidade */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Unidade</CardTitle>
            <CardDescription>
              Unidade de medida e aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Select value={formData.unidadeId} onValueChange={(value) => handleInputChange("unidadeId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade.id} value={unidade.id.toString()}>
                        {unidade.sigla ? `${unidade.nome} (${unidade.sigla})` : unidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoAplicacao">Tipo de Aplicação</Label>
                <Input
                  id="tipoAplicacao"
                  value={formData.tipoAplicacao}
                  onChange={(e) => handleInputChange("tipoAplicacao", e.target.value)}
                  placeholder="Ex: por folha, por peça"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unidadeCobranca">Unidade de Cobrança</Label>
                <Input
                  id="unidadeCobranca"
                  value={formData.unidadeCobranca}
                  onChange={(e) => handleInputChange("unidadeCobranca", e.target.value)}
                  placeholder="Ex: m², lote"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidadeTipo">Tipo de Unidade</Label>
                <Input
                  id="unidadeTipo"
                  value={formData.unidadeTipo}
                  onChange={(e) => handleInputChange("unidadeTipo", e.target.value)}
                  placeholder="Ex: unidade, m², hora"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Econômicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Econômicas</CardTitle>
            <CardDescription>
              Custos e margens do extra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custoBase">Custo Base (€) *</Label>
                <Input
                  id="custoBase"
                  type="number"
                  step="0.01"
                  value={formData.custoBase}
                  onChange={(e) => handleInputChange("custoBase", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margemPadrao">Margem Padrão (%)</Label>
                <Input
                  id="margemPadrao"
                  type="number"
                  step="0.01"
                  value={formData.margemPadrao}
                  onChange={(e) => handleInputChange("margemPadrao", e.target.value)}
                  placeholder="100"
                />
                <p className="text-sm text-muted-foreground">
                  Margem baseada na categoria selecionada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/extras">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Extra
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}