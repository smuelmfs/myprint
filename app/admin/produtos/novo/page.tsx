"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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

export default function NovoProdutoPage() {
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
    referencia: "",
    descricao: "",
    categoriaId: "",
    unidadeId: "",
    tipoProduto: "",
    custoBase: "",
    margemPadrao: "",
    corTipo: "",
    formato: "",
    paginas: "",
    gramagem: "",
    tipoPapel: "",
    acabamento: "",
    largura: "",
    altura: "",
    areaM2: "",
    material: "",
    metodoImpressao: "",
    frenteVerso: "",
    possuiFoil: false,
    corteEspecial: false,
    plastificacao: "",
    dobraVinco: "",
    espessura: "",
    suporteMaterial: "",
    pesoPapel: "",
    mioloPapel: "",
    capaPapel: "",
    encadernacao: "",
    laminacaoCapa: "",
    precoPorM2: "",
    tipoTecido: "",
    areaImpressao: "",
    metodoImpressao2: "",
    materialObjeto: "",
    dimensoes: "",
    materialSuporte: "",
    espessura2: "",
    acabamento2: "",
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
    
    if (!formData.nome || !formData.referencia || !formData.categoriaId || !formData.unidadeId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch("/api/produtos", {
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
          paginas: formData.paginas ? parseInt(formData.paginas) : null,
          gramagem: formData.gramagem ? parseInt(formData.gramagem) : null,
          largura: formData.largura ? parseFloat(formData.largura) : null,
          altura: formData.altura ? parseFloat(formData.altura) : null,
          areaM2: formData.areaM2 ? parseFloat(formData.areaM2) : null,
          espessura: formData.espessura ? parseFloat(formData.espessura) : null,
          pesoPapel: formData.pesoPapel ? parseFloat(formData.pesoPapel) : null,
          precoPorM2: formData.precoPorM2 ? parseFloat(formData.precoPorM2) : null,
          espessura2: formData.espessura2 ? parseFloat(formData.espessura2) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso.",
        })
        router.push("/admin/produtos")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erro ao criar produto")
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      toast({
        title: "Erro ao criar produto",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Novo Produto</h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Crie um novo produto para o catálogo
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
        <Link href="/admin/produtos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Novo Produto</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Crie um novo produto para o catálogo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados essenciais do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Cartões de Visita"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">Referência *</Label>
                <Input
                  id="referencia"
                  value={formData.referencia}
                  onChange={(e) => handleInputChange("referencia", e.target.value)}
                  placeholder="Ex: CV-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                <Label htmlFor="tipoProduto">Tipo de Produto</Label>
                <Input
                  id="tipoProduto"
                  value={formData.tipoProduto}
                  onChange={(e) => handleInputChange("tipoProduto", e.target.value)}
                  placeholder="Ex: Cartão de Visita"
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
              Custos e margens do produto
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

        {/* Características Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Características Técnicas</CardTitle>
            <CardDescription>
              Especificações técnicas do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="corTipo">Tipo de Cor</Label>
                <Input
                  id="corTipo"
                  value={formData.corTipo}
                  onChange={(e) => handleInputChange("corTipo", e.target.value)}
                  placeholder="Ex: CMYK, K, Pantone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formato">Formato</Label>
                <Input
                  id="formato"
                  value={formData.formato}
                  onChange={(e) => handleInputChange("formato", e.target.value)}
                  placeholder="Ex: A4, A5, 85x55mm"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="paginas">Páginas</Label>
                <Input
                  id="paginas"
                  type="number"
                  value={formData.paginas}
                  onChange={(e) => handleInputChange("paginas", e.target.value)}
                  placeholder="Ex: 16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gramagem">Gramagem (g/m²)</Label>
                <Input
                  id="gramagem"
                  type="number"
                  value={formData.gramagem}
                  onChange={(e) => handleInputChange("gramagem", e.target.value)}
                  placeholder="Ex: 115"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoPapel">Tipo de Papel</Label>
                <Input
                  id="tipoPapel"
                  value={formData.tipoPapel}
                  onChange={(e) => handleInputChange("tipoPapel", e.target.value)}
                  placeholder="Ex: Couché"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="largura">Largura (cm)</Label>
                <Input
                  id="largura"
                  type="number"
                  step="0.01"
                  value={formData.largura}
                  onChange={(e) => handleInputChange("largura", e.target.value)}
                  placeholder="Ex: 8.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  step="0.01"
                  value={formData.altura}
                  onChange={(e) => handleInputChange("altura", e.target.value)}
                  placeholder="Ex: 5.5"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="possuiFoil"
                  checked={formData.possuiFoil}
                  onCheckedChange={(checked) => handleInputChange("possuiFoil", checked)}
                />
                <Label htmlFor="possuiFoil">Possui Foil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="corteEspecial"
                  checked={formData.corteEspecial}
                  onCheckedChange={(checked) => handleInputChange("corteEspecial", checked)}
                />
                <Label htmlFor="corteEspecial">Corte Especial</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/produtos">
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
                Salvar Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}