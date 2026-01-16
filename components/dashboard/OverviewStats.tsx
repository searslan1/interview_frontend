"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Users, CheckCircle, XCircle, Clock, Info, TrendingUp } from "lucide-react"
import { useDashboardStore } from "@/store/dashboardStore"
import { Skeleton } from "@/components/ui/skeleton"
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
    <Card className="glass-card border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs glass-card">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${iconColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        {context && (
          <p className="text-xs text-muted-foreground mt-1">{context}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 px-2 py-1 rounded-lg bg-muted/50 w-fit">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ml-1 font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewStats() {
  const { stats, applicationTrend, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Trend direction ve icon
  const getTrendIcon = () => {
    if (!applicationTrend) return null;
    if (applicationTrend.trendDirection === 'up') {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (applicationTrend.trendDirection === 'down') {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (!applicationTrend) return '';
    return applicationTrend.trendDirection === 'up' ? 'text-green-500' : 
           applicationTrend.trendDirection === 'down' ? 'text-red-500' : 'text-gray-500';
  };

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Toplam Başvuru"
          tooltip="Sisteme gelen tüm başvuruların toplam sayısını gösterir."
          value={stats.totalApplications}
          icon={<Users className="h-4 w-4 text-white" />}
          iconColor="from-blue-500 to-blue-600"
          valueColor="text-foreground"
          context={applicationTrend ? `${applicationTrend.currentWeekApplications} bu hafta` : undefined}
          trend={applicationTrend ? {
            value: Math.abs(applicationTrend.percentageChange),
            isPositive: applicationTrend.trendDirection === 'up'
          } : undefined}
        />
        <KPICard
          title="Kabul Edilen"
          tooltip="Değerlendirme sürecini başarıyla tamamlayan ve kabul edilen aday sayısıdır."
          value={stats.acceptedApplications}
          icon={<CheckCircle className="h-4 w-4 text-white" />}
          iconColor="from-emerald-500 to-emerald-600"
          valueColor="text-emerald-600 dark:text-emerald-400"
          context="Toplam kabul"
        />
        <KPICard
          title="Reddedilen"
          tooltip="Değerlendirme sonucunda uygun bulunmayan aday sayısıdır."
          value={stats.rejectedApplications}
          icon={<XCircle className="h-4 w-4 text-white" />}
          iconColor="from-red-500 to-red-600"
          valueColor="text-red-600 dark:text-red-400"
          context="Toplam red"
        />
        <KPICard
          title="Bekleyen"
          tooltip="Henüz değerlendirilmemiş veya süreç devam eden başvurular."
          value={stats.pendingApplications}
          icon={<Clock className="h-4 w-4 text-white" />}
          iconColor="from-orange-500 to-orange-600"
          valueColor="text-orange-600 dark:text-orange-400"
          context="Değerlendirme bekliyor"
        />
      </div>
    </TooltipProvider>
  )
}
// (removed invalid duplicate KPICard code)

