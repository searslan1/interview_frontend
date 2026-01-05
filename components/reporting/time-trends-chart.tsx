"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Info, AlertCircle, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type TimeRange = "30d" | "60d" | "90d";

// Tarih formatla
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// Trend yönü belirle
function getTrendDirection(data: { date: string; value: number }[]): "up" | "down" | "stable" {
  if (!data || data.length < 2) return "stable";
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (change > 5) return "up";
  if (change < -5) return "down";
  return "stable";
}

// Trend ikonu
function TrendIcon({ direction }: { direction: "up" | "down" | "stable" }) {
  if (direction === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (direction === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
}

// Custom tooltip
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-2">{formatDate(label)}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium">
              {entry.name.includes("Oran") || entry.name.includes("%") 
                ? `%${entry.value}` 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimeTrendsChart() {
  const { timeTrends, isLoadingTrends, filters } = useReportingStore();
  const [selectedRange, setSelectedRange] = useState<TimeRange>(filters.datePreset as TimeRange || "30d");

  // Seçili aralığa göre veriyi filtrele
  const filteredData = useMemo(() => {
    if (!timeTrends) return null;

    const days = selectedRange === "30d" ? 30 : selectedRange === "60d" ? 60 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return {
      applicationQualityTrend: timeTrends.applicationQualityTrend.filter(
        (d: { date: string; value: number }) => new Date(d.date) >= cutoffDate
      ),
      averageFitTrend: timeTrends.averageFitTrend.filter(
        (d: { date: string; value: number }) => new Date(d.date) >= cutoffDate
      ),
      favoritesRateTrend: timeTrends.favoritesRateTrend.filter(
        (d: { date: string; value: number }) => new Date(d.date) >= cutoffDate
      ),
    };
  }, [timeTrends, selectedRange]);

  if (isLoadingTrends) {
    return <TimeTrendsSkeleton />;
  }

  if (!timeTrends || !filteredData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Zaman Bazlı Trendler</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Trend verisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  // Kombine veri oluştur (tüm trend çizgileri için)
  const combinedData = filteredData.applicationQualityTrend.map((item: { date: string; value: number }, index: number) => ({
    date: item.date,
    applicationQuality: item.value,
    averageFit: filteredData.averageFitTrend[index]?.value || 0,
    favoriteRate: filteredData.favoritesRateTrend[index]?.value || 0,
  }));

  // Trend yönleri
  const qualityTrend = getTrendDirection(filteredData.applicationQualityTrend);
  const fitTrend = getTrendDirection(filteredData.averageFitTrend);
  const favoriteTrend = getTrendDirection(filteredData.favoritesRateTrend);

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Zaman Bazlı Trendler</h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Süreç nasıl gidiyor? Zaman içindeki değişimleri takip edin. 
                  Başvuru kalitesi, ortalama yakınlık ve favoriye alınma oranlarının trendlerini görün.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Zaman Aralığı Seçici */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            {(["30d", "60d", "90d"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className={cn(
                  "h-8 px-3",
                  selectedRange === range && "shadow-sm"
                )}
              >
                <Calendar className="h-3 w-3 mr-1" />
                {range === "30d" ? "30 Gün" : range === "60d" ? "60 Gün" : "90 Gün"}
              </Button>
            ))}
          </div>
        </div>

        {/* Trend Özet Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Başvuru Kalitesi Trendi</p>
                  <p className="text-lg font-bold mt-1">
                    {filteredData.applicationQualityTrend.length > 0 
                      ? filteredData.applicationQualityTrend[filteredData.applicationQualityTrend.length - 1].value
                      : "-"}
                  </p>
                </div>
                <div className={cn(
                  "p-2 rounded-full",
                  qualityTrend === "up" && "bg-green-100 dark:bg-green-900/30",
                  qualityTrend === "down" && "bg-red-100 dark:bg-red-900/30",
                  qualityTrend === "stable" && "bg-yellow-100 dark:bg-yellow-900/30"
                )}>
                  <TrendIcon direction={qualityTrend} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ort. Rol Yakınlığı Trendi</p>
                  <p className="text-lg font-bold mt-1">
                    {filteredData.averageFitTrend.length > 0 
                      ? filteredData.averageFitTrend[filteredData.averageFitTrend.length - 1].value
                      : "-"}
                  </p>
                </div>
                <div className={cn(
                  "p-2 rounded-full",
                  fitTrend === "up" && "bg-green-100 dark:bg-green-900/30",
                  fitTrend === "down" && "bg-red-100 dark:bg-red-900/30",
                  fitTrend === "stable" && "bg-yellow-100 dark:bg-yellow-900/30"
                )}>
                  <TrendIcon direction={fitTrend} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Favoriye Alınma Oranı</p>
                  <p className="text-lg font-bold mt-1">
                    {filteredData.favoritesRateTrend.length > 0 
                      ? `%${filteredData.favoritesRateTrend[filteredData.favoritesRateTrend.length - 1].value}`
                      : "-"}
                  </p>
                </div>
                <div className={cn(
                  "p-2 rounded-full",
                  favoriteTrend === "up" && "bg-green-100 dark:bg-green-900/30",
                  favoriteTrend === "down" && "bg-red-100 dark:bg-red-900/30",
                  favoriteTrend === "stable" && "bg-yellow-100 dark:bg-yellow-900/30"
                )}>
                  <TrendIcon direction={favoriteTrend} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ana Trend Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zaman Serisi Analizi</CardTitle>
            <CardDescription>Seçili dönemde temel metriklerin değişimi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={formatDate}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <RechartsTooltip content={<TrendTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applicationQuality"
                    name="Başvuru Kalitesi"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="averageFit"
                    name="Ort. Yakınlık"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="favoriteRate"
                    name="Favori Oranı %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bireysel Trend Grafikleri */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Başvuru Kalitesi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Başvuru Kalitesi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.applicationQualityTrend}>
                    <defs>
                      <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="url(#colorQuality)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ortalama Yakınlık */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ortalama Yakınlık</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.averageFitTrend}>
                    <defs>
                      <linearGradient id="colorFit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      fill="url(#colorFit)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Favoriye Alınma Oranı */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Favoriye Alınma Oranı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.favoritesRateTrend}>
                    <defs>
                      <linearGradient id="colorFavorite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      fill="url(#colorFavorite)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
}

function TimeTrendsSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    </section>
  );
}

export default TimeTrendsChart;
