"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Renk paleti
const COLORS = {
  highFit: "#22c55e",   // Yeşil - Yüksek yakınlık
  mediumFit: "#f59e0b", // Sarı/Turuncu - Orta yakınlık
  lowFit: "#ef4444",    // Kırmızı - Düşük yakınlık
};

// Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-medium">
              {entry.value} ({((entry.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
        <div className="pt-1.5 mt-1.5 border-t flex items-center justify-between text-sm font-medium">
          <span>Toplam</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
}

export function PositionOverviewChart() {
  const { positionAnalysis, isLoadingPositions } = useReportingStore();

  if (isLoadingPositions) {
    return <PositionOverviewSkeleton />;
  }

  if (!positionAnalysis || positionAnalysis.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pozisyon Bazlı Genel Görünüm</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Pozisyon verisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  // Veriyi dönüştür
  const chartData = positionAnalysis.map((item) => ({
    position: item.position,
    "Yüksek Yakınlık": item.highFit,
    "Orta Yakınlık": item.mediumFit,
    "Düşük Yakınlık": item.lowFit,
    total: item.total,
  }));

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Pozisyon Bazlı Genel Görünüm</CardTitle>
              <CardDescription className="mt-1">
                Pozisyonlara göre aday yakınlık dağılımı
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium mb-1">Bu grafik ne söylüyor?</p>
                <p className="text-sm">
                  "Problem adayda mı, pozisyon tanımında mı?" sorusuna cevap verir.
                  Düşük yakınlık oranı yüksek pozisyonlar için iş ilanı revizyonu
                  veya kanal değişikliği düşünülebilir.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="position"
                  tick={{ fontSize: 12 }}
                  width={90}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
                <Bar
                  dataKey="Yüksek Yakınlık"
                  stackId="a"
                  fill={COLORS.highFit}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Orta Yakınlık"
                  stackId="a"
                  fill={COLORS.mediumFit}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Düşük Yakınlık"
                  stackId="a"
                  fill={COLORS.lowFit}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alt bilgi kartları */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.highFit }} />
                <span className="text-sm text-muted-foreground">Yüksek Yakınlık</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {positionAnalysis.reduce((sum, p) => sum + p.highFit, 0)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.mediumFit }} />
                <span className="text-sm text-muted-foreground">Orta Yakınlık</span>
              </div>
              <p className="text-xl font-bold text-yellow-600">
                {positionAnalysis.reduce((sum, p) => sum + p.mediumFit, 0)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.lowFit }} />
                <span className="text-sm text-muted-foreground">Düşük Yakınlık</span>
              </div>
              <p className="text-xl font-bold text-red-600">
                {positionAnalysis.reduce((sum, p) => sum + p.lowFit, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function PositionOverviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          <div className="space-y-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PositionOverviewChart;
