"use client"

import { useState, useEffect } from "react"
import { ReportingFilters } from "@/components/reporting/reporting-filters"
import { GeneralStatistics } from "@/components/reporting/general-statistics"
import { CandidateAnalysis } from "@/components/reporting/candidate-analysis"
import { InterviewQualityAnalysis } from "@/components/reporting/interview-quality-analysis"
import { AIRecommendations } from "@/components/reporting/ai-recommendations"
import { VisualizationsAndGraphs } from "@/components/reporting/visualizations-and-graphs"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useReportingStore } from "@/store/reportingStore"

export default function ReportingPage() {
  const [filters, setFilters] = useState({
    dateRange: "1m",
    interviewId: "",
    candidateScoreMin: 0,
    experienceLevel: "",
    analysisType: "",
  })
  const { reportData, isLoading, error, fetchReportData } = useReportingStore()

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
  }

  useEffect(() => {
    fetchReportData()
  }, [fetchReportData])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Raporlama ve Analizler</h1>
      <ReportingFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <GeneralStatistics data={reportData.generalStatistics} />
        <CandidateAnalysis data={reportData.candidateAnalysis} />
        <InterviewQualityAnalysis data={reportData.interviewQualityAnalysis} />
        <AIRecommendations data={reportData.aiRecommendations} />
      </div>
      <VisualizationsAndGraphs data={reportData.visualizationsData} />
    </div>
  )
}

