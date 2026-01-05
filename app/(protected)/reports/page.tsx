"use client"

import { useEffect } from "react"
import { ReportingFilters } from "@/components/reporting/reporting-filters"
import { KPISummaryStrip } from "@/components/reporting/kpi-summary-strip"
import { PositionOverviewChart } from "@/components/reporting/position-overview-chart"
import { CandidateDistributionCharts } from "@/components/reporting/candidate-distribution-charts"
import { QuestionEffectivenessChart } from "@/components/reporting/question-effectiveness-chart"
import { AIHRAlignmentChart } from "@/components/reporting/ai-hr-alignment-chart"
import { TimeTrendsChart } from "@/components/reporting/time-trends-chart"
import { useReportingStore } from "@/store/reportingStore"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, FileBarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReportsPage() {
  const { 
    fetchAllReportData, 
    isLoadingKPI,
    filters,
    resetFilters 
  } = useReportingStore()

  // İlk yükleme
  useEffect(() => {
    fetchAllReportData()
  }, [fetchAllReportData])

  // Filtre kontrolü - en az bir pozisyon seçili olmalı
  const hasActiveFilters = filters.positions.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header & Filters */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileBarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Stratejik Analiz & Raporlar</h1>
                <p className="text-sm text-muted-foreground">
                  Süreç nasıl gidiyor? İşe alım metrikleri ve trendler
                </p>
              </div>
            </div>
          </div>

          {/* Global Filter Bar */}
          <div className="pb-4">
            <ReportingFilters />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!hasActiveFilters ? (
          /* Filtre seçilmemiş durumu */
          <Card className="max-w-lg mx-auto mt-16">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Filtre Seçimi Gerekli</h3>
              <p className="text-muted-foreground mb-6">
                Raporları görüntülemek için en az bir pozisyon seçmeniz gerekiyor.
                Filtre yoksa rapor yok!
              </p>
              <p className="text-xs text-muted-foreground">
                Yukarıdaki filtre barından pozisyon seçerek başlayın.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Raporlar */
          <div className="space-y-12">
            {/* Section 1: KPI Summary Strip */}
            <section>
              <KPISummaryStrip />
            </section>

            {/* Section 2: Position Overview */}
            <section>
              <PositionOverviewChart />
            </section>

            {/* Section 3: Candidate Distribution */}
            <section>
              <CandidateDistributionCharts />
            </section>

            {/* Section 4: Question Effectiveness */}
            <section>
              <QuestionEffectivenessChart />
            </section>

            {/* Section 5: AI-HR Alignment */}
            <section>
              <AIHRAlignmentChart />
            </section>

            {/* Section 6: Time Trends */}
            <section>
              <TimeTrendsChart />
            </section>

            {/* Footer Note */}
            <footer className="text-center py-8 border-t">
              <p className="text-sm text-muted-foreground">
                Bu rapor seçili filtrelere göre oluşturulmuştur. 
                Farklı sonuçlar için filtreleri değiştirin.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => resetFilters()}>
                  Filtreleri Sıfırla
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  PDF Olarak Kaydet
                </Button>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  )
}
