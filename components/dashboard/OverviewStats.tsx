"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Users, CheckCircle, XCircle, TrendingUp, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface KPICardProps {
  title: string
  tooltip: string
  value: number | string
  icon: React.ReactNode
  iconColor: string
  valueColor: string
  context?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function KPICard({ title, tooltip, value, icon, iconColor, valueColor, context, trend }: KPICardProps) {
  return (
    <Card className="bg-white dark:bg-card shadow-md cursor-default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={iconColor}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        {context && (
          <p className="text-xs text-muted-foreground mt-1">{context}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ml-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewStats() {
  // Bu veriler normalde bir API'den gelecektir
  const stats = {
    totalApplications: 1234,
    approvedCandidates: 89,
    rejectedCandidates: 45,
    applicationTrend: 12.5, // Yüzde olarak
  }

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Toplam Başvuru"
          tooltip="Seçili dönemde sisteme gelen tüm başvuruların toplam sayısını gösterir."
          value={stats.totalApplications}
          icon={<Users className="h-4 w-4" />}
          iconColor="text-primary"
          valueColor="text-primary"
          context="Son 30 gün"
        />
        <KPICard
          title="Onaylanan Adaylar"
          tooltip="Değerlendirme sürecini başarıyla tamamlayan ve olumlu sonuçlanan aday sayısıdır."
          value={stats.approvedCandidates}
          icon={<CheckCircle className="h-4 w-4" />}
          iconColor="text-green-500"
          valueColor="text-green-600 dark:text-green-500"
          context="Bu ay"
        />
        <KPICard
          title="Reddedilen Adaylar"
          tooltip="Değerlendirme sonucunda uygun bulunmayan veya süreçten çıkarılan aday sayısıdır."
          value={stats.rejectedCandidates}
          icon={<XCircle className="h-4 w-4" />}
          iconColor="text-red-500"
          valueColor="text-red-600 dark:text-red-500"
          context="Bu ay"
        />
        <KPICard
          title="Başvuru Trendi"
          tooltip="Önceki döneme kıyasla başvuru sayısındaki değişim oranını gösterir."
          value={`${stats.applicationTrend > 0 ? '+' : ''}${stats.applicationTrend}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconColor="text-blue-500"
          valueColor="text-blue-600 dark:text-blue-500"
          context="Son 7 gün"
          trend={{
            value: Math.abs(stats.applicationTrend),
            isPositive: stats.applicationTrend > 0
          }}
        />
      </div>
    </TooltipProvider>
  )
}

