"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

const products = [
  // Impressão Gráfica Tradicional
  {
    id: 1,
    name: "Cartões de Visita",
    reference: "CV-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Cartões",
    unitType: "unidade",
    baseCost: 0.15,
    defaultMargin: 150,
    status: "active",
  },
  {
    id: 2,
    name: "Flyers A5",
    reference: "FL-A5-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Flyers",
    unitType: "unidade",
    baseCost: 0.25,
    defaultMargin: 120,
    status: "active",
  },
  {
    id: 3,
    name: "Cartazes A3",
    reference: "CT-A3-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Cartazes",
    unitType: "unidade",
    baseCost: 2.5,
    defaultMargin: 100,
    status: "active",
  },
  {
    id: 4,
    name: "Brochuras A4",
    reference: "BR-A4-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Brochuras",
    unitType: "unidade",
    baseCost: 1.8,
    defaultMargin: 110,
    status: "active",
  },
  {
    id: 5,
    name: "Papel Timbrado A4",
    reference: "PT-A4-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Papel Timbrado",
    unitType: "unidade",
    baseCost: 0.35,
    defaultMargin: 130,
    status: "active",
  },
  {
    id: 6,
    name: "Blocos de Notas A5",
    reference: "BN-A5-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Blocos",
    unitType: "unidade",
    baseCost: 3.5,
    defaultMargin: 90,
    status: "active",
  },
  {
    id: 7,
    name: "Calendários de Parede",
    reference: "CL-PAR-001",
    category: "Impressão Gráfica Tradicional",
    subcategory: "Calendários",
    unitType: "unidade",
    baseCost: 4.2,
    defaultMargin: 85,
    status: "active",
  },
  // Têxteis Personalizados
  {
    id: 8,
    name: "T-shirts Algodão",
    reference: "TS-ALG-001",
    category: "Têxteis Personalizados",
    subcategory: "T-shirts",
    unitType: "unidade",
    baseCost: 5.5,
    defaultMargin: 120,
    status: "active",
  },
  {
    id: 9,
    name: "Sweatshirts",
    reference: "SW-001",
    category: "Têxteis Personalizados",
    subcategory: "Sweatshirts",
    unitType: "unidade",
    baseCost: 12.0,
    defaultMargin: 100,
    status: "active",
  },
  {
    id: 10,
    name: "Bonés Bordados",
    reference: "BC-BOR-001",
    category: "Têxteis Personalizados",
    subcategory: "Bonés",
    unitType: "unidade",
    baseCost: 6.5,
    defaultMargin: 110,
    status: "active",
  },
  {
    id: 11,
    name: "Polos Piqué",
    reference: "PL-PIQ-001",
    category: "Têxteis Personalizados",
    subcategory: "Polos",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 105,
    status: "active",
  },
  {
    id: 12,
    name: "Sacos de Pano",
    reference: "SC-PAN-001",
    category: "Têxteis Personalizados",
    subcategory: "Sacos",
    unitType: "unidade",
    baseCost: 2.8,
    defaultMargin: 140,
    status: "active",
  },
  // Comunicação Visual & Grande Formato
  {
    id: 13,
    name: "Lonas Publicitárias",
    reference: "LN-PUB-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Lonas",
    unitType: "m²",
    baseCost: 15.0,
    defaultMargin: 80,
    status: "active",
  },
  {
    id: 14,
    name: "Vinil Autocolante",
    reference: "VN-AUT-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Vinil",
    unitType: "m²",
    baseCost: 12.5,
    defaultMargin: 90,
    status: "active",
  },
  {
    id: 15,
    name: "Roll-ups 85x200cm",
    reference: "RU-85-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Roll-ups",
    unitType: "unidade",
    baseCost: 45.0,
    defaultMargin: 75,
    status: "active",
  },
  {
    id: 16,
    name: "Banners X-Banner",
    reference: "BN-XBN-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Banners",
    unitType: "unidade",
    baseCost: 35.0,
    defaultMargin: 80,
    status: "active",
  },
  {
    id: 17,
    name: "Placas PVC 5mm",
    reference: "PL-PVC-001",
    category: "Comunicação Visual & Grande Formato",
    subcategory: "Placas",
    unitType: "m²",
    baseCost: 25.0,
    defaultMargin: 85,
    status: "active",
  },
  // Merchandising / Objetos Promocionais
  {
    id: 18,
    name: "Canecas Cerâmica",
    reference: "CN-CER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Canecas",
    unitType: "unidade",
    baseCost: 3.2,
    defaultMargin: 150,
    status: "active",
  },
  {
    id: 19,
    name: "Canetas Metálicas",
    reference: "CP-MET-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Canetas",
    unitType: "unidade",
    baseCost: 0.85,
    defaultMargin: 180,
    status: "active",
  },
  {
    id: 20,
    name: "Chaveiros Personalizados",
    reference: "CH-PER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Chaveiros",
    unitType: "unidade",
    baseCost: 1.2,
    defaultMargin: 160,
    status: "active",
  },
  {
    id: 21,
    name: "Powerbanks 5000mAh",
    reference: "PB-5K-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Powerbanks",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 95,
    status: "active",
  },
  {
    id: 22,
    name: "Bolsas Térmicas",
    reference: "BL-TER-001",
    category: "Merchandising / Objetos Promocionais",
    subcategory: "Bolsas",
    unitType: "unidade",
    baseCost: 4.5,
    defaultMargin: 120,
    status: "inactive",
  },
  // Embalagens Personalizadas
  {
    id: 23,
    name: "Caixas Cartão Canelado",
    reference: "CX-CAN-001",
    category: "Embalagens Personalizadas",
    subcategory: "Caixas",
    unitType: "unidade",
    baseCost: 1.8,
    defaultMargin: 110,
    status: "active",
  },
  {
    id: 24,
    name: "Sacos de Papel Kraft",
    reference: "SP-KRA-001",
    category: "Embalagens Personalizadas",
    subcategory: "Sacos",
    unitType: "unidade",
    baseCost: 0.45,
    defaultMargin: 140,
    status: "active",
  },
  {
    id: 25,
    name: "Rótulos Adesivos",
    reference: "RT-ADE-001",
    category: "Embalagens Personalizadas",
    subcategory: "Rótulos",
    unitType: "unidade",
    baseCost: 0.12,
    defaultMargin: 170,
    status: "active",
  },
  // Linha Sustentável
  {
    id: 26,
    name: "Papel Reciclado A4",
    reference: "PR-REC-001",
    category: "Linha Sustentável",
    subcategory: "Papéis Reciclados",
    unitType: "kg",
    baseCost: 2.5,
    defaultMargin: 100,
    status: "active",
  },
  {
    id: 27,
    name: "T-shirts Algodão Orgânico",
    reference: "TS-ORG-001",
    category: "Linha Sustentável",
    subcategory: "Têxteis Orgânicos",
    unitType: "unidade",
    baseCost: 8.5,
    defaultMargin: 110,
    status: "active",
  },
  {
    id: 28,
    name: "Canetas Bambu",
    reference: "CP-BAM-001",
    category: "Linha Sustentável",
    subcategory: "Merchandising Ecológico",
    unitType: "unidade",
    baseCost: 1.5,
    defaultMargin: 150,
    status: "active",
  },
]

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Produtos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie os produtos disponíveis para orçamentação
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Categoria" />
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

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Nome</TableHead>
              <TableHead className="min-w-[120px]">Referência</TableHead>
              <TableHead className="min-w-[200px]">Categoria</TableHead>
              <TableHead className="min-w-[150px]">Subcategoria</TableHead>
              <TableHead className="min-w-[120px]">Tipo de Unidade</TableHead>
              <TableHead className="text-right min-w-[100px]">Custo Base</TableHead>
              <TableHead className="text-right min-w-[100px]">Margem (%)</TableHead>
              <TableHead className="min-w-[80px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.reference}</TableCell>
                  <TableCell className="text-sm">{product.category}</TableCell>
                  <TableCell className="text-sm">{product.subcategory}</TableCell>
                  <TableCell>{product.unitType}</TableCell>
                  <TableCell className="text-right">€{product.baseCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.defaultMargin}%</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/produtos/${product.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>
    </div>
  )
}
