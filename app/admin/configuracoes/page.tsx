"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">Configure as preferências do sistema</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="pricing">Preços</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Dados básicos da sua empresa para orçamentos e documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" placeholder="MyPrint Lda." defaultValue="MyPrint Lda." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-nif">NIF</Label>
                  <Input id="company-nif" placeholder="123456789" defaultValue="123456789" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">Morada</Label>
                <Input
                  id="company-address"
                  placeholder="Rua Example, 123"
                  defaultValue="Rua Example, 123, 1000-001 Lisboa"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input id="company-phone" placeholder="+351 210 000 000" defaultValue="+351 210 000 000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="geral@myprint.pt"
                    defaultValue="geral@myprint.pt"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-website">Website</Label>
                <Input id="company-website" placeholder="https://myprint.pt" defaultValue="https://myprint.pt" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="company-footer">Texto de Rodapé (Orçamentos)</Label>
                <Textarea
                  id="company-footer"
                  placeholder="Texto que aparece no rodapé dos orçamentos..."
                  defaultValue="Obrigado pela sua preferência. Estamos ao seu dispor para qualquer esclarecimento."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Guardar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>Configure o comportamento geral do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="auto-save">Guardar Automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Guarda automaticamente as alterações enquanto edita</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="show-inactive">Mostrar Produtos Inativos</Label>
                    <p className="text-sm text-muted-foreground">Exibe produtos inativos nas listagens</p>
                  </div>
                  <Switch id="show-inactive" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dólar ($)</SelectItem>
                      <SelectItem value="gbp">Libra (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="items-per-page">Itens por Página</Label>
                  <Select defaultValue="25">
                    <SelectTrigger id="items-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Guardar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gerencie as notificações que recebe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="notify-new-quote">Novos Orçamentos</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando um novo orçamento é gerado</p>
                  </div>
                  <Switch id="notify-new-quote" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="notify-product-update">Atualizações de Produtos</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando produtos são editados ou criados</p>
                  </div>
                  <Switch id="notify-product-update" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="notify-low-stock">Alertas de Stock</Label>
                    <p className="text-sm text-muted-foreground">Notificar quando o stock está baixo</p>
                  </div>
                  <Switch id="notify-low-stock" />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="notify-email">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações também por email</p>
                  </div>
                  <Switch id="notify-email" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Guardar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Preços</CardTitle>
              <CardDescription>Defina margens e regras de preços padrão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-margin">Margem Padrão (%)</Label>
                  <Input id="default-margin" type="number" placeholder="100" defaultValue="100" />
                  <p className="text-sm text-muted-foreground">Margem aplicada por padrão a novos produtos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-margin">Margem Mínima (%)</Label>
                  <Input id="min-margin" type="number" placeholder="50" defaultValue="50" />
                  <p className="text-sm text-muted-foreground">Margem mínima permitida em orçamentos</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="show-cost">Mostrar Custo Base</Label>
                    <p className="text-sm text-muted-foreground">Exibir custo base nos orçamentos (apenas admin)</p>
                  </div>
                  <Switch id="show-cost" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="round-prices">Arredondar Preços</Label>
                    <p className="text-sm text-muted-foreground">Arredondar preços finais para valores inteiros</p>
                  </div>
                  <Switch id="round-prices" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Taxa de IVA (%)</Label>
                  <Input id="tax-rate" type="number" placeholder="23" defaultValue="23" />
                  <p className="text-sm text-muted-foreground">Taxa de IVA aplicada aos orçamentos</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Guardar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
