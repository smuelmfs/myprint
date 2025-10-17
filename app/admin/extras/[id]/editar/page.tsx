"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
  custo: number
  status: "ATIVO" | "INATIVO"
  criadoEm: string
  atualizadoEm: string
}

interface Categoria {
  id: number
  nome: string
  tipo: string
}

interface Unidade {
  id: number
  nome: string
  sigla?: string
}

// interface Configuracao {
//   id: number
//   margemPadrao: number
//   margensCategoria: Array<{
//     id: number
//     categoria: string
//     margem: number
//   }>
// }

export default function EditarExtraPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  // Estados
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [extra, setExtra] = useState<Extra | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  // const [configuracao, setConfiguracao] = useState<Configuracao | null>(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    unidadeId: "",
    custo: "",
  })

  // Carregar dados iniciais
  useEffect(() => {
    if (params.id) {
      loadData()
    }
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar extra
      const extraResponse = await fetch(`/api/extras/${params.id}`)
      if (extraResponse.ok) {
        const extraData = await extraResponse.json()
        setExtra(extraData.data)
        
        // Preencher formulário com dados do extra
        setFormData({
          nome: extraData.data.nome || "",
          descricao: extraData.data.descricao || "",
          categoriaId: extraData.data.categoria.id.toString(),
          unidadeId: extraData.data.unidade.id.toString(),
          custo: extraData.data.custo.toString(),
        })
      }

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
      // const configResponse = await fetch("/api/configuracao")
      // if (configResponse.ok) {
      //   const configData = await configResponse.json()
      //   setConfiguracao(configData)
      // }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do extra.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar categorias por tipo (extra/geral)
  const categoriasFiltradas = categorias.filter(categoria => 
    categoria.tipo === 'extra' || categoria.tipo === 'geral'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.categoriaId || !formData.unidadeId || !formData.custo) {
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          ...formData,
          custo: parseFloat(formData.custo),
          categoriaId: parseInt(formData.categoriaId),
          unidadeId: parseInt(formData.unidadeId),
        }),
      })

      if (response.ok) {
        toast({
          title: "Extra atualizado",
          description: "O extra foi atualizado com sucesso.",
        })
        router.push("/admin/extras")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao atualizar extra")
      }
    } catch (error) {
      console.error("Erro ao atualizar extra:", error)
      toast({
        title: "Erro ao atualizar extra",
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
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Editar Extra</h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Edite as informações do extra
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

  if (!extra) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/extras">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Extra não encontrado</h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              O extra solicitado não foi encontrado
            </p>
          </div>
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
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Editar Extra</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Edite as informações do extra: {extra.nome}
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
                    {categoriasFiltradas.map((categoria) => (
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

        {/* Informações de Unidade e Custo */}
        <Card>
          <CardHeader>
            <CardTitle>Unidade e Custo</CardTitle>
            <CardDescription>
              Unidade de medida e custo unitário
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
                <Label htmlFor="custo">Custo Unitário (€) *</Label>
                <Input
                  id="custo"
                  type="number"
                  step="0.01"
                  value={formData.custo}
                  onChange={(e) => handleInputChange("custo", e.target.value)}
                  placeholder="0.00"
                  required
                />
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
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}