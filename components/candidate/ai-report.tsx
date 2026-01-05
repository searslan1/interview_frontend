"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Application } from "@/types/application"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react"

interface AIReportProps {
  application: Application;
}

export function AIReport({ application }: AIReportProps) {
  // Veri güvenliği: generalAIAnalysis yoksa boş obje ata
  const analysis = application.generalAIAnalysis;

  if (!analysis) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Brain className="h-10 w-10 mb-4 opacity-50" />
          <p>Henüz AI analizi oluşturulmamış.</p>
        </CardContent>
      </Card>
    );
  }

  // Renk belirleyici helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Skor Kartları (Grid Yapısı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Genel Uyumluluk */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Genel Uyumluluk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore || 0)}`}>
                {analysis.overallScore ?? 0}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress 
              value={analysis.overallScore || 0} 
              className="h-2" 
              // Renk sınıfı progress componentine göre özelleştirilebilir
            />
          </CardContent>
        </Card>

        {/* Kişilik Uyumu */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Kişilik Uyumu
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-end gap-2 mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(analysis.personalityMatchScore || 0)}`}>
                {analysis.personalityMatchScore ?? 0}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress value={analysis.personalityMatchScore || 0} className="h-2" />
          </CardContent>
        </Card>
      </div>
      
      {/* 2. Güçlü Yönler & Gelişim Alanları (Yan Yana) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Güçlü Yönler */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Güçlü Yönler
          </h3>
          <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
            {(analysis.strengths && analysis.strengths.length > 0) ? (
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">Veri bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Gelişim Alanları */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Gelişim Alanları
          </h3>
          <div className="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
            {/* DÜZELTME: areasForImprovement string[] veya object[] olabilir. Güvenli map'leme */}
            {(analysis.improvementAreas && analysis.improvementAreas.length > 0) ? (
              <ul className="space-y-2">
                {analysis.improvementAreas.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    {/* Eğer string ise direkt yaz, obje ise .area veya .text özelliğini yaz */}
                    <span>{typeof item === 'string' ? item : (item.area || item.text || JSON.stringify(item))}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">Veri bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Genel Öneri (Recommendation) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            Yapay Zeka Görüşü
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">
            {analysis.recommendation || "Analizden genel bir öneri alınamadı."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}