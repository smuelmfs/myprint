export interface Product {
  id: number
  name: string
  reference: string
  description?: string // Added optional description field
  category: string
  subcategory: string
  productType: string
  unitType: string
  colorType?: string
  format?: string
  baseCost: number
  defaultMargin: number
  status: 1 | 0
  // Type-specific fields (optional, depends on productType)
  pages?: number
  paperCore?: string
  paperCover?: string
  paperType?: string // Added for paper specifications
  paperWeight?: number // Added for paper weight in grams
  binding?: string
  coverLamination?: string
  width?: number
  height?: number
  material?: string
  pricePerM2?: number
  frontBack?: string
  foil?: boolean
  specialCut?: boolean
  fabricType?: string // Added for textile products
  printArea?: string // Added for print area specifications
  printMethod?: string // Added for printing method
  objectMaterial?: string // Added for promotional objects
  dimensions?: string // Added for product dimensions
  supportMaterial?: string // Added for support/backing material
  thickness?: number // Added for material thickness
  finish?: string // Added for finish type
}

export const PRODUCT_TYPES = [
  "Impressão Gráfica Tradicional",
  "Catálogo / Revista",
  "Grande Formato",
  "Cartões de Visita",
  "Cartões PVC",
  "Vinil / Adesivo",
  "Alveolar",
  "Flex",
  "Produto Publicitário",
  "Envelope",
  "Pasta A4",
  "Impressão UV",
  "Outros",
] as const

export const COLOR_TYPES = ["K", "CMYK"] as const

export const PRODUCT_CATEGORIES = [
  "Impressão Gráfica Tradicional",
  "Têxteis Personalizados",
  "Comunicação Visual & Grande Formato",
  "Merchandising / Objetos Promocionais",
  "Embalagens Personalizadas",
  "Linha Sustentável",
] as const

export const PRODUCT_TYPE_OPTIONS = [
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
  { value: "tela_canvas", label: "Tela / Canvas" },
  { value: "papel_parede", label: "Papel de Parede" },
  { value: "outro", label: "Outro" },
] as const

export const UNIT_TYPES = [
  { value: "unidade", label: "Unidade" },
  { value: "m²", label: "m²" },
  { value: "m", label: "Metro Linear" },
  { value: "kg", label: "Quilograma" },
  { value: "peça", label: "Peça" },
  { value: "conjunto", label: "Conjunto" },
] as const

export const COLOR_TYPE_OPTIONS = [
  { value: "4x0", label: "4x0 (Frente colorida)" },
  { value: "4x4", label: "4x4 (Frente e verso coloridos)" },
  { value: "1x0", label: "1x0 (Preto e branco frente)" },
  { value: "1x1", label: "1x1 (Preto e branco ambos lados)" },
  { value: "pantone", label: "Pantone" },
  { value: "sublimacao", label: "Sublimação" },
  { value: "serigrafia", label: "Serigrafia" },
] as const

export const PAPER_TYPES = [
  { value: "couche_fosco", label: "Couché Fosco" },
  { value: "couche_brilho", label: "Couché Brilho" },
  { value: "offset", label: "Offset" },
  { value: "reciclado", label: "Reciclado" },
  { value: "vegetal", label: "Vegetal" },
] as const

export const LARGE_FORMAT_MATERIALS = [
  { value: "lona_frontlit", label: "Lona Frontlit" },
  { value: "lona_backlit", label: "Lona Backlit" },
  { value: "vinil_adesivo", label: "Vinil Adesivo" },
  { value: "vinil_microperforado", label: "Vinil Microperforado" },
  { value: "mesh", label: "Mesh" },
] as const

export const FABRIC_TYPES = [
  { value: "algodao", label: "100% Algodão" },
  { value: "poliester", label: "100% Poliéster" },
  { value: "misto", label: "Misto (Algodão/Poliéster)" },
  { value: "dry_fit", label: "Dry Fit" },
] as const

export const PRINT_METHODS = [
  { value: "serigrafia", label: "Serigrafia" },
  { value: "sublimacao", label: "Sublimação" },
  { value: "transfer", label: "Transfer" },
  { value: "bordado", label: "Bordado" },
] as const

export const OBJECT_MATERIALS = [
  { value: "ceramica", label: "Cerâmica" },
  { value: "plastico", label: "Plástico" },
  { value: "metal", label: "Metal" },
  { value: "cartao", label: "Cartão" },
  { value: "madeira", label: "Madeira" },
  { value: "acrilico", label: "Acrílico" },
] as const

export const SUPPORT_MATERIALS = [
  { value: "acrilico", label: "Acrílico" },
  { value: "pvc", label: "PVC" },
  { value: "forex", label: "Forex" },
  { value: "dibond", label: "Dibond" },
  { value: "aluminio", label: "Alumínio" },
] as const

export const FINISH_TYPES = [
  { value: "brilho", label: "Brilho" },
  { value: "fosco", label: "Fosco" },
  { value: "texturizado", label: "Texturizado" },
] as const

export const mockProducts: Product[] = [
  // Impressão Gráfica Tradicional
  {
    id: 1,
    name: "Cartões de Visita",
    reference: "CV-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Cartões",
    productType: "Cartões de Visita",
    unitType: "unidade",
    colorType: "CMYK",
    format: "85x55mm",
    baseCost: 0.15,
    defaultMargin: 150,
    frontBack: "Frente e Verso",
    foil: false,
    specialCut: false,
    status: 1,
  },
  {
    id: 2,
    name: "Flyers A5",
    reference: "FL-A5-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Flyers",
    productType: "Impressão Gráfica Tradicional",
    unitType: "unidade",
    colorType: "CMYK",
    format: "A5",
    baseCost: 0.25,
    defaultMargin: 120,
    status: 1,
  },
  {
    id: 3,
    name: "Cartazes A3",
    reference: "CT-A3-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Cartazes",
    productType: "Impressão Gráfica Tradicional",
    unitType: "unidade",
    colorType: "CMYK",
    format: "A3",
    baseCost: 2.5,
    defaultMargin: 100,
    status: 1,
  },
  {
    id: 4,
    name: "Brochuras A4",
    reference: "BR-A4-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Brochuras",
    productType: "Catálogo / Revista",
    unitType: "unidade",
    colorType: "CMYK",
    format: "A4",
    pages: 16,
    paperCore: "Couché 115g",
    paperCover: "Couché 250g",
    binding: "Agrafos",
    coverLamination: "Brilho",
    baseCost: 1.8,
    defaultMargin: 110,
    status: 1,
  },
  {
    id: 5,
    name: "Papel Timbrado A4",
    reference: "PT-A4-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Papel Timbrado",
    productType: "Impressão Gráfica Tradicional",
    unitType: "unidade",
    colorType: "CMYK",
    format: "A4",
    baseCost: 0.35,
    defaultMargin: 130,
    status: 1,
  },
  {
    id: 6,
    name: "Blocos de Notas A5",
    reference: "BN-A5-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Blocos",
    productType: "Impressão Gráfica Tradicional",
    unitType: "unidade",
    colorType: "K",
    format: "A5",
    baseCost: 3.5,
    defaultMargin: 90,
    status: 1,
  },
  {
    id: 7,
    name: "Calendários de Parede",
    reference: "CL-PAR-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Calendários",
    productType: "Impressão Gráfica Tradicional",
    unitType: "unidade",
    colorType: "CMYK",
    format: "A3",
    baseCost: 4.2,
    defaultMargin: 85,
    status: 1,
  },
  // Têxteis Personalizados
  {
    id: 8,
    name: "T-shirts Algodão",
    reference: "TS-ALG-001",
    category: "Têxteis Personalizados",
    subcategory: "T-shirts",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 5.5,
    defaultMargin: 120,
    fabricType: "algodao",
    status: 1,
  },
  {
    id: 9,
    name: "Sweatshirts",
    reference: "SW-001",
    category: "Têxteis Personalizados",
    subcategory: "Sweatshirts",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 12.0,
    defaultMargin: 100,
    fabricType: "misto",
    status: 1,
  },
  {
    id: 10,
    name: "Bonés Bordados",
    reference: "BC-BOR-001",
    category: "Têxteis Personalizados",
    subcategory: "Bonés",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 6.5,
    defaultMargin: 110,
    fabricType: "algodao",
    printMethod: "bordado",
    status: 1,
  },
  {
    id: 11,
    name: "Polos Piqué",
    reference: "PL-PIQ-001",
    category: "Têxteis Personalizados",
    subcategory: "Polos",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 105,
    fabricType: "poliester",
    status: 1,
  },
  {
    id: 12,
    name: "Sacos de Pano",
    reference: "SC-PAN-001",
    category: "Têxteis Personalizados",
    subcategory: "Sacos",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 2.8,
    defaultMargin: 140,
    fabricType: "algodao",
    status: 1,
  },
  // Comunicação Visual & Grande Formato
  {
    id: 13,
    name: "Lonas Publicitárias",
    reference: "LN-PUB-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Lonas",
    productType: "Grande Formato",
    unitType: "m²",
    colorType: "CMYK",
    width: 3.0,
    height: 2.0,
    material: "Lona Frontlit 440g",
    pricePerM2: 15.0,
    baseCost: 15.0,
    defaultMargin: 80,
    status: 1,
  },
  {
    id: 14,
    name: "Vinil Autocolante",
    reference: "VN-AUT-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Vinil",
    productType: "Vinil / Adesivo",
    unitType: "m²",
    colorType: "CMYK",
    material: "Vinil Monomérico",
    baseCost: 12.5,
    defaultMargin: 90,
    status: 1,
  },
  {
    id: 15,
    name: "Roll-ups 85x200cm",
    reference: "RU-85-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Roll-ups",
    productType: "Grande Formato",
    unitType: "unidade",
    colorType: "CMYK",
    width: 0.85,
    height: 2.0,
    material: "Lona Frontlit",
    baseCost: 45.0,
    defaultMargin: 75,
    status: 1,
  },
  {
    id: 16,
    name: "Banners X-Banner",
    reference: "BN-XBN-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Banners",
    productType: "Grande Formato",
    unitType: "unidade",
    colorType: "CMYK",
    width: 0.6,
    height: 1.6,
    material: "Lona",
    baseCost: 35.0,
    defaultMargin: 80,
    status: 1,
  },
  {
    id: 17,
    name: "Placas PVC 5mm",
    reference: "PL-PVC-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Placas",
    productType: "Alveolar",
    unitType: "m²",
    colorType: "CMYK",
    material: "PVC Alveolar 5mm",
    baseCost: 25.0,
    defaultMargin: 85,
    status: 1,
  },
  // Merchandising / Objetos Promocionais
  {
    id: 18,
    name: "Canecas Cerâmica",
    reference: "CN-CER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Canecas",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 3.2,
    defaultMargin: 150,
    objectMaterial: "ceramica",
    status: 1,
  },
  {
    id: 19,
    name: "Canetas Metálicas",
    reference: "CP-MET-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Canetas",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 0.85,
    defaultMargin: 180,
    objectMaterial: "metal",
    status: 1,
  },
  {
    id: 20,
    name: "Chaveiros Personalizados",
    reference: "CH-PER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Chaveiros",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 1.2,
    defaultMargin: 160,
    objectMaterial: "cartao",
    status: 1,
  },
  {
    id: 21,
    name: "Powerbanks 5000mAh",
    reference: "PB-5K-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Powerbanks",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 95,
    objectMaterial: "plastico",
    status: 1,
  },
  {
    id: 22,
    name: "Bolsas Térmicas",
    reference: "BL-TER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Bolsas",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 4.5,
    defaultMargin: 120,
    objectMaterial: "madeira",
    status: 0,
  },
  // Embalagens Personalizadas
  {
    id: 23,
    name: "Caixas Cartão Canelado",
    reference: "CX-CAN-001",
    category: "Embalagens Personalizadas",
    subcategory: "Caixas",
    productType: "Outros",
    unitType: "unidade",
    baseCost: 1.8,
    defaultMargin: 110,
    supportMaterial: "acrilico",
    status: 1,
  },
  {
    id: 24,
    name: "Sacos de Papel Kraft",
    reference: "SP-KRA-001",
    category: "Embalagens Personalizadas",
    subcategory: "Sacos",
    productType: "Outros",
    unitType: "unidade",
    baseCost: 0.45,
    defaultMargin: 140,
    supportMaterial: "pvc",
    status: 1,
  },
  {
    id: 25,
    name: "Rótulos Adesivos",
    reference: "RT-ADE-001",
    category: "Embalagens Personalizadas",
    subcategory: "Rótulos",
    productType: "Vinil / Adesivo",
    unitType: "unidade",
    baseCost: 0.12,
    defaultMargin: 170,
    supportMaterial: "forex",
    status: 1,
  },
  // Linha Sustentável
  {
    id: 26,
    name: "Papel Reciclado A4",
    reference: "PR-REC-001",
    category: "Linha Sustentável",
    subcategory: "Papéis Reciclados",
    productType: "Impressão Gráfica Tradicional",
    unitType: "kg",
    colorType: "K",
    format: "A4",
    baseCost: 2.5,
    defaultMargin: 100,
    paperType: "reciclado",
    paperWeight: 70,
    status: 1,
  },
  {
    id: 27,
    name: "T-shirts Algodão Orgânico",
    reference: "TS-ORG-001",
    category: "Linha Sustentável",
    subcategory: "Têxteis Orgânicos",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 110,
    fabricType: "algodao",
    printMethod: "sublimacao",
    finish: "brilho",
    status: 1,
  },
  {
    id: 28,
    name: "Canetas Bambu",
    reference: "CP-BAM-001",
    category: "Linha Sustentável",
    subcategory: "Merchandising Ecológico",
    productType: "Produto Publicitário",
    unitType: "unidade",
    baseCost: 1.5,
    defaultMargin: 150,
    objectMaterial: "bambu",
    status: 1,
  },
]
