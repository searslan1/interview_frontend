import { mockApplications, type Application } from "@/mockdata/applications"

interface FetchApplicationsParams {
  interviewId: string
  page: number
  pageSize: number
  filters?: {
    status?: string
    aiScoreMin?: number
    aiScoreMax?: number
    submissionDateStart?: string
    submissionDateEnd?: string
    completionStatus?: string
    applicationStatus?: string
    experienceLevel?: string
  }
}

export const fetchApplications = async ({
  interviewId,
  page,
  pageSize,
  filters = {},
}: FetchApplicationsParams): Promise<{ data: Application[]; totalPages: number }> => {
  // Simüle edilmiş API gecikmesi
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredApplications = mockApplications

  // interviewId filtresini uygula (eğer "all" değilse)
  if (interviewId !== "all") {
    filteredApplications = filteredApplications.filter((app) => app.interviewId === interviewId)
  }

  // Diğer filtreleri uygula
  if (filters.status && filters.status !== "all") {
    filteredApplications = filteredApplications.filter((app) => app.status === filters.status)
  }
  if (filters.completionStatus && filters.completionStatus !== "all") {
    filteredApplications = filteredApplications.filter((app) => app.completionStatus === filters.completionStatus)
  }
  if (filters.applicationStatus && filters.applicationStatus !== "all") {
    filteredApplications = filteredApplications.filter((app) => app.applicationStatus === filters.applicationStatus)
  }
  if (filters.experienceLevel && filters.experienceLevel !== "all") {
    filteredApplications = filteredApplications.filter((app) => app.experienceLevel === filters.experienceLevel)
  }
  // Diğer filtreler için benzer kontroller ekleyin

  if (filters.aiScoreMin !== undefined) {
    filteredApplications = filteredApplications.filter((app) => app.aiScore >= filters.aiScoreMin!)
  }
  if (filters.aiScoreMax !== undefined) {
    filteredApplications = filteredApplications.filter((app) => app.aiScore <= filters.aiScoreMax!)
  }
  if (filters.submissionDateStart) {
    filteredApplications = filteredApplications.filter((app) => app.submissionDate >= filters.submissionDateStart!)
  }
  if (filters.submissionDateEnd) {
    filteredApplications = filteredApplications.filter((app) => app.submissionDate <= filters.submissionDateEnd!)
  }

  // Sayfalama
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex)

  return {
    data: paginatedApplications,
    totalPages: Math.ceil(filteredApplications.length / pageSize),
  }
}

