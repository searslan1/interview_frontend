"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, UserPlus, BarChart } from "lucide-react"

const stats = [
  { title: "Toplam Başvuru", value: "1,234", icon: Users },
  { title: "Aktif Mülakatlar", value: "56", icon: Calendar },
  { title: "Yeni Adaylar", value: "23", icon: UserPlus },
  { title: "Ortalama Puan", value: "7.8", icon: BarChart },
]

export function DashboardHeader() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

