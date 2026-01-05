"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Cell,
  LabelList,
} from "recharts";
import { Info, AlertCircle, Lightbulb, Clock, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Renk hesaplama - skora göre
function getEffectivenessColor(score: number): string {
  if (score >= 70) return "#22c55e"; // Yeşil
  if (score >= 50) return "#f59e0b"; // Sarı
  return "#ef4444"; // Kırmızı
}

// Custom tooltip
function QuestionTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 max-w-xs">
      <p className="font-medium text-sm mb-2">{data.questionText}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" /> Ayırt Edicilik:
          </span>
          <Badge variant={data.discriminationIndex >= 70 ? "default" : data.discriminationIndex >= 50 ? "secondary" : "destructive"}>
            {data.discriminationIndex}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Ort. Yanıt Süresi:
          </span>
          <span>{Math.floor(data.avgResponseTime / 60)} dk {data.avgResponseTime % 60} sn</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> Tamamlanma:
          </span>
          <span>%{data.completionRate}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Sorulma Sayısı:</span>
          <span>{data.timesAsked}</span>
        </div>
      </div>
    </div>
  );
}

export function QuestionEffectivenessChart() {
  const { questionEffectiveness, isLoadingQuestions } = useReportingStore();

  if (isLoadingQuestions) {
    return <QuestionEffectivenessSkeleton />;
  }

  if (!questionEffectiveness || questionEffectiveness.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soru Analizi</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Soru analizi verisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  // Soruları ayırt edicilik sırasına göre sırala
  const sortedQuestions = [...questionEffectiveness].sort(
    (a, b) => b.discriminationIndex - a.discriminationIndex
  );

  // En iyi ve en kötü sorular
  const topQuestions = sortedQuestions.slice(0, 5);
  const bottomQuestions = sortedQuestions.slice(-3).reverse();

  // Grafik için veri - soru metnini kısalt
  const chartData = sortedQuestions.map((q) => ({
    ...q,
    shortText: q.questionText.length > 30 ? q.questionText.substring(0, 30) + "..." : q.questionText,
  }));

  // Genel istatistikler
  const avgDiscrimination = Math.round(
    questionEffectiveness.reduce((sum, q) => sum + q.discriminationIndex, 0) /
      questionEffectiveness.length
  );
  const avgResponseTime = Math.round(
    questionEffectiveness.reduce((sum, q) => sum + q.avgResponseTimeSec, 0) /
      questionEffectiveness.length
  );
  const avgCompletion = Math.round(
    questionEffectiveness.reduce((sum, q) => sum + q.completionRate, 0) /
      questionEffectiveness.length
  );

  return (
    <TooltipProvider>
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Soru Etkinlik Analizi</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Hangi sorular adayları daha iyi ayırt ediyor? Sorularınızın etkinliğini ölçün
                ve iyileştirme fırsatlarını keşfedin.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Özet Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ort. Ayırt Edicilik</p>
                  <p className="text-xl font-bold">{avgDiscrimination}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ort. Yanıt Süresi</p>
                  <p className="text-xl font-bold">
                    {Math.floor(avgResponseTime / 60)} dk {avgResponseTime % 60} sn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ort. Tamamlanma</p>
                  <p className="text-xl font-bold">%{avgCompletion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ana Grafik - Ayırt Edicilik Çubuğu */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Soru Bazlı Ayırt Edicilik Endeksi</CardTitle>
              <CardDescription>Sorular, ayırt etme gücüne göre sıralı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="shortText"
                      width={150}
                      tick={{ fontSize: 10 }}
                    />
                    <RechartsTooltip content={<QuestionTooltip />} />
                    <Bar dataKey="discriminationIndex" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getEffectivenessColor(entry.discriminationIndex)}
                        />
                      ))}
                      <LabelList
                        dataKey="discriminationIndex"
                        position="right"
                        style={{ fontSize: 11 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* İçgörüler & Öneriler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                İçgörüler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* En Etkili Sorular */}
              <div>
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                  ✓ En Ayırt Edici Sorular
                </h4>
                <ul className="space-y-2">
                  {topQuestions.slice(0, 3).map((q, i) => (
                    <li key={q.questionId} className="text-xs">
                      <div className="flex items-start gap-2">
                        <span className="font-medium shrink-0">{i + 1}.</span>
                        <span className="text-muted-foreground line-clamp-2">{q.questionText}</span>
                      </div>
                      <Progress value={q.discriminationIndex} className="h-1 mt-1" />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geliştirilmesi Gereken Sorular */}
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  ⚠ Geliştirilebilir Sorular
                </h4>
                <ul className="space-y-2">
                  {bottomQuestions.map((q, i) => (
                    <li key={q.questionId} className="text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground line-clamp-2">{q.questionText}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={q.discriminationIndex} className="h-1 flex-1" />
                        <span className="text-muted-foreground">{q.discriminationIndex}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Öneri */}
              <div className="p-3 rounded-lg bg-muted/50 text-xs">
                <p className="font-medium mb-1">💡 Öneri</p>
                <p className="text-muted-foreground">
                  Ayırt edicilik endeksi 50&apos;nin altındaki sorular, adayları yeterince 
                  ayırt edemiyor olabilir. Bu soruları revize etmeyi veya alternatiflerle 
                  değiştirmeyi düşünün.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
}

function QuestionEffectivenessSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default QuestionEffectivenessChart;
