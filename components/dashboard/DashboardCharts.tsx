"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "@/store/dashboardStore";
import { Info, BarChart3, FileBarChart, Plus } from "lucide-react";
import Link from "next/link";

interface ChartCardProps {
  title: string;
  tooltip: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    href: string;
  };
}

function ChartCard({ title, tooltip, children, isEmpty, emptyMessage, emptyAction }: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-base">{title}</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Link href="/reports" className="text-xs text-primary hover:underline flex items-center gap-1">
            <FileBarChart className="h-3 w-3" />
            Raporlara Git →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{emptyMessage}</p>
            {emptyAction && (
              <Button asChild size="sm" variant="outline">
                <Link href={emptyAction.href}>
                  <Plus className="h-4 w-4 mr-1" />
                  {emptyAction.label}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardCharts() {
  const {
    applicationTrends,
    departmentApplications,
    fetchDashboardData,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        {/* 📊 Başvuru Trendleri Grafiği - Basitleştirilmiş */}
        <ChartCard
          title="Başvuru Trendleri"
          tooltip="Son dönemde gelen başvuruların zaman içindeki dağılımını gösterir. Detaylı analiz için Raporlar sayfasını ziyaret edin."
          isEmpty={applicationTrends.length === 0}
          emptyMessage="Henüz başvuru trendi verisi bulunmuyor. İlk mülakatı oluşturarak veri toplamaya başlayın."
          emptyAction={{ label: "Mülakat Oluştur", href: "/interviews" }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <RechartsTooltip
                contentStyle={{ fontSize: 12 }}
                labelFormatter={(date) => new Date(date).toLocaleDateString("tr-TR")}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 📊 Departman Bazlı Başvuru Grafiği - Basit Bar Chart */}
        <ChartCard
          title="Departmanlara Göre Başvurular"
          tooltip="Başvuruların departmanlara göre dağılımını gösterir. Detaylı analiz için Raporlar sayfasını ziyaret edin."
          isEmpty={departmentApplications.length === 0}
          emptyMessage="Henüz departman bazlı başvuru verisi bulunmuyor. Farklı pozisyonlar için mülakatlar oluşturun."
          emptyAction={{ label: "Mülakat Oluştur", href: "/interviews" }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={departmentApplications} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <RechartsTooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </TooltipProvider>
  );
}
