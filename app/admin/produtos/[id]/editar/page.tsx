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
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ErrorModal } from "@/components/ui/error-modal"

// Tipos
interface Produto {
  id: number
  nome: string
  referencia: string
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
  custoBase: number
  margemPadrao: number
  precoBase?: number
  status: "ATIVO" | "INATIVO"
  tipoProduto: string
  corTipo?: string
  formato?: string
  paginas?: number
  gramagem?: number
  tipoPapel?: string
  acabamento?: string
  largura?: number
  altura?: number
  areaM2?: number
  material?: string
  metodoImpressao?: string
  frenteVerso?: string
  possuiFoil?: boolean
  corteEspecial?: boolean
  plastificacao?: string
  dobraVinco?: string
  espessura?: number
  suporteMaterial?: string
  pesoPapel?: number
  mioloPapel?: string
  capaPapel?: string
  encadernacao?: string
  laminacaoCapa?: string
  precoPorM2?: number
  tipoTecido?: string
  areaImpressao?: string
  metodoImpressao2?: string
  materialObjeto?: string
  dimensoes?: string
  materialSuporte?: string
  espessura2?: number
  acabamento2?: string
  extras?: Array<{
    extra: {
      id: number
      nome: string
      custo: number | null
      unidade: {
        nome: string
        sigla?: string
      }
    }
  }>
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
  custo: number | null
  status: "ATIVO" | "INATIVO"
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

// Opções estáticas para tipos de produto
const PRODUCT_TYPE_OPTIONS = [
  { value: "flyer_folheto", label: "Flyer / Folheto" },
  { value: "cartao_visita", label: "Cartão de Visita" },
  { value: "brochura_catalogo", label: "Brochura / Catálogo" },
  { value: "banner_lona", label: "Banner / Lona" },
  { value: "adesivo_vinil", label: "Adesivo / Vinil" },
  { value: "tshirt_textil", label: "T-shirt / Têxtil" },
  { value: "caneca_chaveiro", label: "Caneca / Chaveiro" },
  { value: "caixa_embalagem", label: "Caixa / Embalagem" },
  { value: "placa_acrilico", label: "Placa / Acrílico" },
  { value: "roll_up", label: "Roll-up" },
]

const COLOR_TYPE_OPTIONS = [
  { value: "cmyk", label: "CMYK" },
  { value: "pantone", label: "Pantone" },
  { value: "preto_branco", label: "Preto e Branco" },
  { value: "1_cor", label: "1 Cor" },
  { value: "2_cores", label: "2 Cores" },
  { value: "3_cores", label: "3 Cores" },
]

const PAPER_TYPES = [
  { value: "couché", label: "Couché" },
  { value: "offset", label: "Offset" },
  { value: "reciclado", label: "Reciclado" },
  { value: "kraft", label: "Kraft" },
  { value: "pergaminho", label: "Pergaminho" },
]

const LARGE_FORMAT_MATERIALS = [
  { value: "lona", label: "Lona" },
  { value: "vinil", label: "Vinil" },
  { value: "papel", label: "Papel" },
  { value: "adesivo", label: "Adesivo" },
]

const FABRIC_TYPES = [
  { value: "algodao", label: "Algodão" },
  { value: "poliéster", label: "Poliéster" },
  { value: "viscose", label: "Viscose" },
  { value: "linho", label: "Linho" },
]

const PRINT_METHODS = [
  { value: "serigrafia", label: "Serigrafia" },
  { value: "sublimacao", label: "Sublimação" },
  { value: "dtg", label: "DTG" },
  { value: "bordado", label: "Bordado" },
]

const OBJECT_MATERIALS = [
  { value: "ceramica", label: "Cerâmica" },
  { value: "metal", label: "Metal" },
  { value: "plastico", label: "Plástico" },
  { value: "madeira", label: "Madeira" },
]

const SUPPORT_MATERIALS = [
  { value: "acrilico", label: "Acrílico" },
  { value: "aluminio", label: "Alumínio" },
  { value: "madeira", label: "Madeira" },
  { value: "pvc", label: "PVC" },
]

const FINISH_TYPES = [
  { value: "brilho", label: "Brilho" },
  { value: "fosco", label: "Fosco" },
  { value: "acetinado", label: "Acetinado" },
  { value: "verniz", label: "Verniz" },
]

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  // Estados
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [produto, setProduto] = useState<Produto | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null)
  
  // Estados do modal de erro
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "error" as "error" | "warning" | "info" | "success"
  })
  
  // Estados do formulário
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [productType, setProductType] = useState<string>("")
  
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
    largura: "",
    altura: "",
    material: "",
    tipoTecido: "",
    areaImpressao: "",
    metodoImpressao: "",
    materialObjeto: "",
    dimensoes: "",
    materialSuporte: "",
    espessura: "",
    acabamento: "",
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
      
      // Carregar produto
      const produtoResponse = await fetch(`/api/produtos/${params.id}`)
      if (produtoResponse.ok) {
        const produtoData = await produtoResponse.json()
        setProduto(produtoData.data)
        
        // Preencher formulário com dados do produto
        setFormData({
          nome: produtoData.data.nome || "",
          referencia: produtoData.data.referencia || "",
          descricao: produtoData.data.descricao || "",
          categoriaId: produtoData.data.categoria.id.toString(),
          unidadeId: produtoData.data.unidade.id.toString(),
          tipoProduto: produtoData.data.tipoProduto || "",
          custoBase: produtoData.data.custoBase.toString(),
          margemPadrao: produtoData.data.margemPadrao.toString(),
          corTipo: produtoData.data.corTipo || "",
          formato: produtoData.data.formato || "",
          paginas: produtoData.data.paginas?.toString() || "",
          gramagem: produtoData.data.gramagem?.toString() || "",
          tipoPapel: produtoData.data.tipoPapel || "",
          largura: produtoData.data.largura?.toString() || "",
          altura: produtoData.data.altura?.toString() || "",
          material: produtoData.data.material || "",
          tipoTecido: produtoData.data.tipoTecido || "",
          areaImpressao: produtoData.data.areaImpressao || "",
          metodoImpressao: produtoData.data.metodoImpressao || "",
          materialObjeto: produtoData.data.materialObjeto || "",
          dimensoes: produtoData.data.dimensoes || "",
          materialSuporte: produtoData.data.materialSuporte || "",
          espessura: produtoData.data.espessura?.toString() || "",
          acabamento: produtoData.data.acabamento || "",
        })

        // Definir tipo de produto para mostrar campos específicos
        setProductType(produtoData.data.tipoProduto || "")

        // Preencher extras selecionados
        if (produtoData.data.extras) {
          const extraIds = produtoData.data.extras.map((pe: { extra: { id: number } }) => pe.extra.id)
          setSelectedExtraIds(extraIds)
        }
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

      // Carregar extras
      const extrasResponse = await fetch("/api/extras")
      if (extrasResponse.ok) {
        const extrasData = await extrasResponse.json()
        setExtras(extrasData.data || [])
      }

      // Carregar configurações
      const configResponse = await fetch("/api/configuracao")
      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfiguracao(configData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do produto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar categorias por tipo (produto/geral)
  const categoriasFiltradas = categorias.filter(categoria => 
    categoria.tipo === 'produto' || categoria.tipo === 'geral'
  )

  // Filtrar extras ativos
  const activeExtras = extras.filter((extra) => extra.status === "ATIVO")
  const filteredExtras = categoryFilter === "all" 
    ? activeExtras 
    : activeExtras.filter((extra) => extra.categoria.nome === categoryFilter)

  const categories = Array.from(new Set(activeExtras.map((e) => e.categoria.nome)))

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
  }, [formData.categoriaId, configuracao, categorias]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExtra = (extraId: number) => {
    setSelectedExtraIds((prev) => 
      prev.includes(extraId) 
        ? prev.filter((id) => id !== extraId) 
        : [...prev, extraId]
    )
  }

  const selectedExtras = activeExtras.filter((extra) => selectedExtraIds.includes(extra.id))
  const totalExtrasCost = selectedExtras.reduce((sum, extra) => sum + (extra.custo || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações do frontend antes de enviar para o backend
    console.log("🔍 Iniciando validações do frontend...")
    
    // Validar campos obrigatórios
    if (!formData.nome || formData.nome.trim() === "") {
      setErrorModal({
        isOpen: true,
        title: "Campo obrigatório",
        message: "O nome do produto é obrigatório.",
        type: "warning"
      })
      return
    }

    if (!formData.referencia || formData.referencia.trim() === "") {
      setErrorModal({
        isOpen: true,
        title: "Campo obrigatório",
        message: "A referência do produto é obrigatória.",
        type: "warning"
      })
      return
    }

    if (!formData.categoriaId) {
      setErrorModal({
        isOpen: true,
        title: "Campo obrigatório",
        message: "Por favor, selecione uma categoria.",
        type: "warning"
      })
      return
    }

    if (!formData.unidadeId) {
      setErrorModal({
        isOpen: true,
        title: "Campo obrigatório",
        message: "Por favor, selecione uma unidade de medida.",
        type: "warning"
      })
      return
    }

    if (!formData.tipoProduto || formData.tipoProduto.trim() === "") {
      setErrorModal({
        isOpen: true,
        title: "Campo obrigatório",
        message: "Por favor, selecione um tipo de produto.",
        type: "warning"
      })
      return
    }

    // Validar valores numéricos
    if (!formData.custoBase || isNaN(parseFloat(formData.custoBase)) || parseFloat(formData.custoBase) <= 0) {
      setErrorModal({
        isOpen: true,
        title: "Valor inválido",
        message: "O custo base deve ser um número válido maior que zero.",
        type: "warning"
      })
      return
    }

    if (!formData.margemPadrao || isNaN(parseFloat(formData.margemPadrao)) || parseFloat(formData.margemPadrao) < 0) {
      setErrorModal({
        isOpen: true,
        title: "Valor inválido",
        message: "A margem padrão deve ser um número válido maior ou igual a zero.",
        type: "warning"
      })
      return
    }

    console.log("✅ Validações do frontend passaram, enviando para o backend...")

    try {
      setIsSaving(true)

      const response = await fetch(`/api/produtos/${params.id}`, {
        method: "PUT",
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
          espessura: formData.espessura ? parseFloat(formData.espessura) : null,
          extrasIds: selectedExtraIds,
        }),
      })

      if (response.ok) {
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        })
        router.push("/admin/produtos")
      } else {
        let errorMessage = "Erro desconhecido"
        let errorTitle = "Erro ao atualizar produto"
        let errorType: "error" | "warning" | "info" | "success" = "error"
        
        try {
          const error = await response.json()
          console.error("📥 Erro da API recebido:", error)
          console.error("📊 Tipo da resposta:", typeof error)
          console.error("🔍 É objeto válido?", error && typeof error === 'object')
          
          if (error && typeof error === 'object' && Object.keys(error).length > 0) {
            errorMessage = error.message || error.error || "Erro desconhecido"
            
            // Determinar o título e tipo baseado no erro
            if (errorMessage.includes("referência")) {
              errorTitle = "Referência já existe"
              errorType = "warning"
            } else if (errorMessage.includes("Categoria") || errorMessage.includes("Unidade")) {
              errorTitle = "Dados inválidos"
              errorType = "error"
            } else if (errorMessage.includes("obrigatório")) {
              errorTitle = "Campos obrigatórios"
              errorType = "warning"
            }
          } else {
            console.error("⚠️ Resposta vazia ou inválida da API")
            errorMessage = `Erro ${response.status}: ${response.statusText}`
            errorTitle = "Erro de comunicação"
          }
        } catch (parseError) {
          console.error("💥 Erro ao fazer parse da resposta:", parseError)
          errorMessage = `Erro ${response.status}: ${response.statusText}`
          errorTitle = "Erro de comunicação"
        }
        
        // Mostrar modal de erro
        setErrorModal({
          isOpen: true,
          title: errorTitle,
          message: errorMessage,
          type: errorType
        })
        return
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setErrorModal({
        isOpen: true,
        title: "Erro de conexão",
        message: error instanceof Error ? error.message : "Erro desconhecido. Verifique sua conexão e tente novamente.",
        type: "error"
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
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Editar Produto</h1>
            <p className="text-muted-foreground mt-1">Edite as informações do produto</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados...</span>
        </div>
      </div>
    )
  }

  if (!produto) {
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
            <p className="text-muted-foreground mt-1">O produto solicitado não foi encontrado</p>
          </div>
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
          <h1 className="text-3xl font-bold tracking-tight text-balance">Editar Produto</h1>
          <p className="text-muted-foreground mt-1">Edite as informações do produto: {produto.nome}</p>
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
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input 
                  id="nome" 
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Cartões de Visita" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">Referência</Label>
                <Input 
                  id="referencia" 
                  value={formData.referencia}
                  onChange={(e) => handleInputChange("referencia", e.target.value)}
                  placeholder="Ex: CV-001" 
                  required 
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoriaId} onValueChange={(value) => handleInputChange("categoriaId", value)} required>
                  <SelectTrigger id="categoria" className="w-full">
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
              <div className="space-y-2">
                <Label htmlFor="productType">Tipo de Produto</Label>
                <Select value={formData.tipoProduto} onValueChange={(value) => {
                  handleInputChange("tipoProduto", value)
                  setProductType(value)
                }} required>
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
                <Label htmlFor="unidade">Unidade de Medida</Label>
                <Select value={formData.unidadeId} onValueChange={(value) => handleInputChange("unidadeId", value)} required>
                  <SelectTrigger id="unidade" className="w-full">
                    <SelectValue placeholder="Selecione" />
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
                <Label htmlFor="corTipo">Tipo de Cor</Label>
                <Select value={formData.corTipo} onValueChange={(value) => handleInputChange("corTipo", value)} required>
                  <SelectTrigger id="corTipo" className="w-full">
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
                <Label htmlFor="formato">Formato</Label>
                <Input 
                  id="formato" 
                  value={formData.formato}
                  onChange={(e) => handleInputChange("formato", e.target.value)}
                  placeholder="Ex: A4, 85x55mm" 
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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custoBase">Custo Base (€)</Label>
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
                  value={formData.margemPadrao}
                  onChange={(e) => handleInputChange("margemPadrao", e.target.value)}
                  placeholder="100" 
                  required 
                />
              </div>
            </div>

            {/* Campos específicos por tipo de produto */}
            {(productType === "flyer_folheto" || productType === "cartao_visita" || productType === "brochura_catalogo") && (
              <div className="grid gap-3 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="tipoPapel">Tipo de Papel</Label>
                  <Select value={formData.tipoPapel} onValueChange={(value) => handleInputChange("tipoPapel", value)}>
                    <SelectTrigger id="tipoPapel" className="w-full">
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
                  <Label htmlFor="gramagem">Gramagem (g/m²)</Label>
                  <Input 
                    id="gramagem" 
                    type="number" 
                    value={formData.gramagem}
                    onChange={(e) => handleInputChange("gramagem", e.target.value)}
                    placeholder="Ex: 300" 
                  />
                </div>
                {productType === "brochura_catalogo" && (
                  <div className="space-y-2">
                    <Label htmlFor="paginas">Número de Páginas</Label>
                    <Input 
                      id="paginas" 
                      type="number" 
                      value={formData.paginas}
                      onChange={(e) => handleInputChange("paginas", e.target.value)}
                      placeholder="Ex: 16" 
                    />
                  </div>
                )}
              </div>
            )}

            {(productType === "banner_lona" || productType === "adesivo_vinil") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select value={formData.material} onValueChange={(value) => handleInputChange("material", value)}>
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
                  <Label htmlFor="largura">Largura (m)</Label>
                  <Input 
                    id="largura" 
                    type="number" 
                    step="0.01" 
                    value={formData.largura}
                    onChange={(e) => handleInputChange("largura", e.target.value)}
                    placeholder="Ex: 1.5" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (m)</Label>
                  <Input 
                    id="altura" 
                    type="number" 
                    step="0.01" 
                    value={formData.altura}
                    onChange={(e) => handleInputChange("altura", e.target.value)}
                    placeholder="Ex: 2.0" 
                  />
                </div>
              </div>
            )}

            {productType === "tshirt_textil" && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="tipoTecido">Tipo de Tecido</Label>
                  <Select value={formData.tipoTecido} onValueChange={(value) => handleInputChange("tipoTecido", value)}>
                    <SelectTrigger id="tipoTecido" className="w-full">
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
                  <Label htmlFor="areaImpressao">Área de Impressão</Label>
                  <Input 
                    id="areaImpressao" 
                    value={formData.areaImpressao}
                    onChange={(e) => handleInputChange("areaImpressao", e.target.value)}
                    placeholder="Ex: A4, 30x40cm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodoImpressao">Método de Impressão</Label>
                  <Select value={formData.metodoImpressao} onValueChange={(value) => handleInputChange("metodoImpressao", value)}>
                    <SelectTrigger id="metodoImpressao" className="w-full">
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
                  <Label htmlFor="materialObjeto">Material do Objeto</Label>
                  <Select value={formData.materialObjeto} onValueChange={(value) => handleInputChange("materialObjeto", value)}>
                    <SelectTrigger id="materialObjeto" className="w-full">
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
                  <Label htmlFor="dimensoes">Dimensões</Label>
                  <Input 
                    id="dimensoes" 
                    value={formData.dimensoes}
                    onChange={(e) => handleInputChange("dimensoes", e.target.value)}
                    placeholder="Ex: 10x10x10cm" 
                  />
                </div>
              </div>
            )}

            {(productType === "placa_acrilico" || productType === "roll_up") && (
              <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="materialSuporte">Material do Suporte</Label>
                  <Select value={formData.materialSuporte} onValueChange={(value) => handleInputChange("materialSuporte", value)}>
                    <SelectTrigger id="materialSuporte" className="w-full">
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
                  <Label htmlFor="espessura">Espessura (mm)</Label>
                  <Input 
                    id="espessura" 
                    type="number" 
                    value={formData.espessura}
                    onChange={(e) => handleInputChange("espessura", e.target.value)}
                    placeholder="Ex: 3" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acabamento">Acabamento</Label>
                  <Select value={formData.acabamento} onValueChange={(value) => handleInputChange("acabamento", value)}>
                    <SelectTrigger id="acabamento" className="w-full">
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
                        {extra.nome}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {extra.categoria.nome} • €{(extra.custo || 0).toFixed(2)}/{extra.unidade.sigla || extra.unidade.nome}
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
                      <span>{extra.nome}</span>
                      <span className="text-muted-foreground">
                        €{(extra.custo || 0).toFixed(2)}/{extra.unidade.sigla || extra.unidade.nome}
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
          <Button type="submit" disabled={isSaving} className="bg-accent hover:bg-accent/90 text-accent-foreground">
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

      {/* Modal de Erro */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        message={errorModal.message}
        type={errorModal.type}
        showRetry={errorModal.type === "error"}
        onRetry={() => {
          setErrorModal(prev => ({ ...prev, isOpen: false }))
          // Opcional: implementar lógica de retry
        }}
      />
    </div>
  )
}