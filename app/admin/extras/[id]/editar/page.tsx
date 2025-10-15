"use client"

import type React from "react"
import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { mockExtras, EXTRA_CATEGORIES, BILLING_UNITS, APPLICATION_TYPES } from "@/lib/mock-data/extras"

export default function EditarExtraPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { id } = use(params)

  const extra = mockExtras.find((e) => e.id === Number.parseInt(id))

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
            <h1 className="text-3xl font-bold tracking-tight text-balance">Extra não encontrado</h1>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast({
      title: "Extra atualizado com sucesso!",
      description: "As alterações foram salvas.",
    })

    router.push("/admin/extras")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Extra desativado",
      description: "O extra foi desativado e não aparecerá mais na listagem.",
      variant: "destructive",
    })

    router.push("/admin/extras")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/extras">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Editar Extra</h1>
            <p className="text-muted-foreground mt-1">Atualize as informações do extra</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isLoading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Extra</CardTitle>
            <CardDescription>Atualize os dados do extra ou acabamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome do Extra <span className="text-destructive">*</span>
              </Label>
              <Input id="name" defaultValue={extra.name} placeholder="Ex: Laminação Brilho" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                defaultValue={extra.description}
                placeholder="Descreva o extra ou acabamento (opcional)"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select key={`category-${extra.id}`} defaultValue={extra.category} name="category" required>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTRA_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitType">
                  Tipo de Unidade <span className="text-destructive">*</span>
                </Label>
                <Select key={`unitType-${extra.id}`} defaultValue={extra.unitType} name="unitType" required>
                  <SelectTrigger id="unitType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="hora">Hora</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="billingUnit">
                  Unidade de Cobrança <span className="text-destructive">*</span>
                </Label>
                <Select key={`billingUnit-${extra.id}`} defaultValue={extra.billingUnit} name="billingUnit" required>
                  <SelectTrigger id="billingUnit" className="w-full">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationType">Tipo de Aplicação</Label>
                <Select key={`applicationType-${extra.id}`} defaultValue={extra.applicationType} name="applicationType">
                  <SelectTrigger id="applicationType" className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">
                Custo Unitário (€) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                defaultValue={extra.cost}
                placeholder="0.00"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/extras">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir extra?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Tem certeza que deseja excluir o extra "${extra.name}"? O extra será desativado e não aparecerá mais nas listagens.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
