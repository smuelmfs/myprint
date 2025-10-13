"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { mockExtras } from "@/lib/mock-data/extras"

export default function ExtrasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredExtras = mockExtras.filter((extra) => {
    const matchesSearch = extra.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || extra.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(mockExtras.map((e) => e.category)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Extras e Acabamentos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie extras e acabamentos globais aplicáveis aos produtos
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Extra
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar extras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
              <TableHead className="min-w-[200px]">Nome</TableHead>
              <TableHead className="min-w-[180px]">Categoria</TableHead>
              <TableHead className="min-w-[120px]">Tipo de Unidade</TableHead>
              <TableHead className="text-right min-w-[100px]">Custo</TableHead>
              <TableHead className="min-w-[80px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExtras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum extra encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredExtras.map((extra) => (
                <TableRow key={extra.id}>
                  <TableCell className="font-medium">{extra.name}</TableCell>
                  <TableCell>{extra.category}</TableCell>
                  <TableCell>{extra.unitType}</TableCell>
                  <TableCell className="text-right">€{extra.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={extra.status === "active" ? "default" : "secondary"}>
                      {extra.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
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
        Mostrando {filteredExtras.length} de {mockExtras.length} extras
      </div>
    </div>
  )
}
