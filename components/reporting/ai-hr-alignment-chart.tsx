"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
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
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { Info, AlertCircle, Eye, Users, Brain, Handshake, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Uyum yüzdesine göre renk
function getAlignmentColor(percent: number): string {
  if (percent >= 80) return "#22c55e";
  if (percent >= 60) return "#f59e0b";
  return "#ef4444";
}

// Uyum durumuna göre badge
function getAlignmentBadge(percent: number) {
  if (percent >= 80) {
    return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Yüksek Uyum</Badge>;
  }
  if (percent >= 60) {
    return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Orta Uyum</Badge>;
  }
  return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Düşük Uyum</Badge>;
}

// Custom tooltip
function AlignmentTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-2">{data.category}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-blue-500" /> AI Skoru:
          </span>
          <span className="font-medium">{data.aiScore}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-purple-500" /> HR Skoru:
          </span>
          <span className="font-medium">{data.hrScore}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2 border-t">
          <span className="flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" /> Fark:
          </span>
          <span className={cn(
            "font-medium",
            Math.abs(data.aiScore - data.hrScore) <= 10 ? "text-green-600" : "text-yellow-600"
          )}>
            {Math.abs(data.aiScore - data.hrScore)} puan
          </span>
        </div>
      </div>
    </div>
  );
}

export function AIHRAlignmentChart() {
  const { aiHrAlignment, isLoadingAlignment } = useReportingStore();

  if (isLoadingAlignment) {
    return <AIHRAlignmentSkeleton />;
  }

  if (!aiHrAlignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-HR Uyum Analizi</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Uyum analizi verisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  const { overallAlignment, categoryAlignments, metrics } = aiHrAlignment;
  const { totalEvaluated, bothHigh, aiOnlyHigh, hrOnlyFavorite } = metrics || {};

  // Grafik için veri
  const chartData = categoryAlignments.map((ca) => ({
    ...ca,
    difference: Math.abs(ca.aiScore - ca.hrScore),
  }));

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">AI & HR Değerlendirme Uyumu</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                &quot;İkinci göz ile birinci göz ne kadar örtüşüyor?&quot; - AI ve HR değerlendirmelerinin
                ne ölçüde paralel gittiğini gösterir. Bu bir &quot;doğru/yanlış&quot; karşılaştırması değil,
                bakış açısı tutarlılığı ölçümüdür.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Özet Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Genel Uyum */}
          <Card className="sm:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${getAlignmentColor(overallAlignment)}20` }}>
                    <Handshake className="h-6 w-6" style={{ color: getAlignmentColor(overallAlignment) }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Genel Uyum Oranı</p>
                    <p className="text-3xl font-bold">%{overallAlignment}</p>
                  </div>
                </div>
                {getAlignmentBadge(overallAlignment)}
              </div>
              {/* Görsel uyum göstergesi */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-xs">AI</span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${overallAlignment}%`,
                      background: `linear-gradient(90deg, #3b82f6 0%, ${getAlignmentColor(overallAlignment)} 100%)`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">HR</span>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toplam Karşılaştırma */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/30">
                  <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Karşılaştırma</p>
                  <p className="text-xl font-bold">{totalEvaluated || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Güçlü Uyum & Sapma */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Her İkisi Yüksek</p>
                  <p className="text-xl font-bold text-green-600">{bothHigh || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Sadece AI Yüksek</p>
                  <p className="text-xl font-bold text-yellow-600">{aiOnlyHigh || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kategori Bazlı Karşılaştırma */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">Kategori Bazlı AI-HR Karşılaştırması</CardTitle>
                <CardDescription>
                  Her kategori için AI ve HR değerlendirmelerinin ortalaması
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span>AI Skoru</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span>HR Skoru</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <RechartsTooltip content={<AlignmentTooltip />} />
                  <Legend />
                  <Bar dataKey="aiScore" name="AI Skoru" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="aiScore" position="top" style={{ fontSize: 10 }} />
                  </Bar>
                  <Bar dataKey="hrScore" name="HR Skoru" fill="#a855f7" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="hrScore" position="top" style={{ fontSize: 10 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yorumlama Rehberi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 shrink-0">
                  <Handshake className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-400">
                    Yüksek Uyum (%80+)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI ve HR paralel değerlendiriyor. AI önerileri güvenle dikkate alınabilir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 shrink-0">
                  <ArrowRightLeft className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-yellow-700 dark:text-yellow-400">
                    Orta Uyum (%60-80)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kısmen farklı bakış açıları var. Kritik kararlarda HR son söz sahibi olmalı.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-red-700 dark:text-red-400">
                    Düşük Uyum (%60-)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Değerlendirme kriterleri gözden geçirilmeli. Soru seti veya eğitim güncellenebilir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Etik not */}
        <p className="text-xs text-muted-foreground text-center">
          Bu analiz, &quot;AI doğru / HR yanlış&quot; yaklaşımı değil, iki bakış açısının tutarlılığını ölçer.
          Nihai karar her zaman insan kaynakları profesyonelinin sorumluluğundadır.
        </p>
      </section>
    </TooltipProvider>
  );
}

function AIHRAlignmentSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-6 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="sm:col-span-2">
          <CardContent className="pt-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </section>
  );
}

export default AIHRAlignmentChart;
