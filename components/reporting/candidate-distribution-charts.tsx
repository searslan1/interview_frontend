"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  ReferenceLine,
} from "recharts";
import { Info, AlertCircle, ShieldCheck } from "lucide-react";

// Renk hesaplama - rol yakınlığına göre
function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e"; // Yeşil
  if (score >= 50) return "#f59e0b"; // Sarı
  return "#ef4444"; // Kırmızı
}

// Histogram tooltip
function HistogramTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3">
      <p className="font-medium">Skor Aralığı: {data.bucket}</p>
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span>Aday Sayısı:</span>
          <span className="font-medium">{data.count}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Oran:</span>
          <span className="font-medium">%{data.percentage}</span>
        </div>
      </div>
    </div>
  );
}

// Scatter tooltip
function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Anonim Aday</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span>İletişim:</span>
          <span className="font-medium">{data.communication}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Teknik:</span>
          <span className="font-medium">{data.technical}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Rol Yakınlığı:</span>
          <span className="font-medium">{data.roleFit}</span>
        </div>
      </div>
    </div>
  );
}

export function CandidateDistributionCharts() {
  const { candidateDistribution, isLoadingDistribution } = useReportingStore();

  if (isLoadingDistribution) {
    return <CandidateDistributionSkeleton />;
  }

  if (!candidateDistribution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aday Dağılımları & Kalite</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Dağılım verisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  const { roleFitDistribution, communicationVsTechnical } = candidateDistribution;

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Aday Dağılımları & Kalite Görünümü</h2>
          <Badge variant="outline" className="text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Anonim Veri
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rol Yakınlığı Histogramı */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Rol Yakınlığı Dağılımı</CardTitle>
                  <CardDescription>Adayların skor aralıklarına göre dağılımı</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Bu histogram, adayların rol yakınlığı skorlarının dağılımını gösterir.
                      Normal dağılıma yakın bir eğri, sağlıklı bir aday havuzuna işaret eder.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleFitDistribution} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="bucket"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <RechartsTooltip content={<HistogramTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {roleFitDistribution.map((entry, index) => {
                        // Bucket'a göre renk
                        const bucketStart = parseInt(entry.bucket.split("-")[0]);
                        let fill = "#ef4444"; // Kırmızı
                        if (bucketStart >= 60) fill = "#22c55e"; // Yeşil
                        else if (bucketStart >= 40) fill = "#f59e0b"; // Sarı
                        return <Cell key={`cell-${index}`} fill={fill} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Özet istatistikler */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">60+ Skor</p>
                  <p className="text-lg font-bold text-green-600">
                    {roleFitDistribution
                      .filter((d) => parseInt(d.bucket.split("-")[0]) >= 60)
                      .reduce((sum, d) => sum + d.count, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">40-60 Skor</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {roleFitDistribution
                      .filter((d) => {
                        const start = parseInt(d.bucket.split("-")[0]);
                        return start >= 40 && start < 60;
                      })
                      .reduce((sum, d) => sum + d.count, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">40 Altı</p>
                  <p className="text-lg font-bold text-red-600">
                    {roleFitDistribution
                      .filter((d) => parseInt(d.bucket.split("-")[0]) < 40)
                      .reduce((sum, d) => sum + d.count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* İletişim vs Teknik Scatter Plot */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">İletişim vs Teknik Yaklaşım</CardTitle>
                  <CardDescription>Adayların iki boyutlu yetkinlik haritası</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Her nokta anonim bir adayı temsil eder. Renk, genel rol yakınlığını
                      gösterir. Sağ üst köşe (yüksek teknik + yüksek iletişim) ideal bölgedir.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="technical"
                      name="Teknik"
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      label={{ value: "Teknik", position: "bottom", offset: 0, fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="communication"
                      name="İletişim"
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      label={{ value: "İletişim", angle: -90, position: "insideLeft", fontSize: 12 }}
                    />
                    <ZAxis range={[40, 80]} />
                    <RechartsTooltip content={<ScatterTooltip />} />
                    {/* Referans çizgileri - ortalama bölgeleri göster */}
                    <ReferenceLine x={50} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="3 3" />
                    <Scatter data={communicationVsTechnical} shape="circle">
                      {communicationVsTechnical.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getScoreColor(entry.roleFit)}
                          fillOpacity={0.7}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Kadran açıklamaları */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-xs">
                <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 text-center">
                  <span className="text-green-700 dark:text-green-400">Yüksek İletişim + Teknik</span>
                </div>
                <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 text-center">
                  <span className="text-yellow-700 dark:text-yellow-400">Yüksek İletişim</span>
                </div>
                <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 text-center">
                  <span className="text-yellow-700 dark:text-yellow-400">Yüksek Teknik</span>
                </div>
                <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-center">
                  <span className="text-red-700 dark:text-red-400">Gelişim Alanı</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Etik not */}
        <p className="text-xs text-muted-foreground text-center">
          Bu bölümde aday isimleri görüntülenmez. Tüm veriler anonim ve toplu olarak sunulur.
        </p>
      </section>
    </TooltipProvider>
  );
}

function CandidateDistributionSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-6 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default CandidateDistributionCharts;
