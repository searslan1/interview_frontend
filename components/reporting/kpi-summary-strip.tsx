"use client";

import { useReportingStore } from "@/store/reportingStore";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Video,
  Star,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPISummaryData } from "@/types/report";

// KPI Kart yapılandırması
interface KPICardConfig {
  key: string;
  title: string;
  icon: React.ReactNode;
  valueKey: keyof KPISummaryData;
  changeKey?: keyof KPISummaryData;
  format: (value: number) => string;
  tooltip: string;
  color: string;
}

const kpiCards: KPICardConfig[] = [
  {
    key: "applications",
    title: "Toplam Başvuru",
    icon: <Users className="h-5 w-5" />,
    valueKey: "totalApplications",
    changeKey: "totalApplicationsChange",
    format: (v) => v.toLocaleString("tr-TR"),
    tooltip: "Seçili dönemde alınan toplam başvuru sayısı",
    color: "text-blue-600",
  },
  {
    key: "interviews",
    title: "Değerlendirilen Mülakat",
    icon: <Video className="h-5 w-5" />,
    valueKey: "evaluatedInterviews",
    changeKey: "evaluatedInterviewsChange",
    format: (v) => v.toLocaleString("tr-TR"),
    tooltip: "Tamamlanmış ve değerlendirilmiş mülakat sayısı",
    color: "text-purple-600",
  },
  {
    key: "favorites",
    title: "Favoriye Alınma Oranı",
    icon: <Star className="h-5 w-5" />,
    valueKey: "favoritesRate",
    changeKey: "favoritesRateChange",
    format: (v) => `%${v.toFixed(1)}`,
    tooltip: "HR tarafından favoriye alınan adayların oranı",
    color: "text-yellow-600",
  },
  {
    key: "roleFit",
    title: "Ortalama Rol Yakınlığı",
    icon: <Target className="h-5 w-5" />,
    valueKey: "averageRoleFit",
    changeKey: "averageRoleFitChange",
    format: (v) => v.toFixed(1),
    tooltip: "AI tarafından hesaplanan ortalama rol uygunluğu skoru",
    color: "text-green-600",
  },
  {
    key: "duration",
    title: "Ort. Mülakat Süresi",
    icon: <Clock className="h-5 w-5" />,
    valueKey: "averageInterviewDuration",
    changeKey: "averageInterviewDurationChange",
    format: (v) => `${v} dk`,
    tooltip: "Ortalama mülakat tamamlanma süresi",
    color: "text-orange-600",
  },
];

// Değişim göstergesi
function ChangeIndicator({ change, inverse = false }: { change?: number; inverse?: boolean }) {
  if (change === undefined || change === null) return null;

  const isPositive = inverse ? change < 0 : change > 0;
  const isNegative = inverse ? change > 0 : change < 0;

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium",
        isPositive && "text-green-600",
        isNegative && "text-red-600",
        !isPositive && !isNegative && "text-muted-foreground"
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : isNegative ? (
        <TrendingDown className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      <span>{Math.abs(change).toFixed(1)}%</span>
    </div>
  );
}

export function KPISummaryStrip() {
  const { kpiSummary, isLoadingKPI } = useReportingStore();

  if (isLoadingKPI || !kpiSummary) {
    return <KPISummarySkeleton />;
  }

  return (
    <TooltipProvider>
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Özet Göstergeler</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Bu kartlar ilk bakışta genel durumu özetler. Karar verdirmez,
                "bir şey değişiyor mu?" sorusuna cevap verir.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map((card) => {
            const value = kpiSummary[card.valueKey] as number;
            const change = card.changeKey
              ? (kpiSummary[card.changeKey] as number | undefined)
              : undefined;
            // Mülakat süresi için düşüş olumlu
            const inverse = card.key === "duration";

            return (
              <Tooltip key={card.key}>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-help">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("p-2 rounded-lg bg-muted", card.color)}>
                          {card.icon}
                        </div>
                        <ChangeIndicator change={change} inverse={inverse} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold tracking-tight">
                          {card.format(value)}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {card.title}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{card.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </section>
    </TooltipProvider>
  );
}

function KPISummarySkeleton() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default KPISummaryStrip;
