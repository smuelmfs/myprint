import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, XCircle, FileText } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total de Produtos",
      value: "48",
      icon: Package,
      description: "Produtos cadastrados",
    },
    {
      title: "Produtos Ativos",
      value: "42",
      icon: CheckCircle,
      description: "Disponíveis para orçamento",
    },
    {
      title: "Produtos Inativos",
      value: "6",
      icon: XCircle,
      description: "Temporariamente desativados",
    },
    {
      title: "Orçamentos Gerados",
      value: "1,234",
      icon: FileText,
      description: "Este mês",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">Visão geral do sistema de orçamentação</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pretty">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Produtos Mais Orçados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Cartões de Visita", count: 342 },
                { name: "Flyers A5", count: 289 },
                { name: "Banners Roll-Up", count: 156 },
                { name: "Folhetos A4", count: 134 },
                { name: "Adesivos Personalizados", count: 98 },
              ].map((product) => (
                <div key={product.name} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${(product.count / 342) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground shrink-0">{product.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Produto criado", item: "Calendários 2025", time: "Há 2 horas" },
                { action: "Produto editado", item: "Cartões de Visita", time: "Há 4 horas" },
                { action: "Extra adicionado", item: "Laminação Brilho", time: "Há 6 horas" },
                { action: "Produto excluido", item: "Flyers A6", time: "Há 1 dia" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
