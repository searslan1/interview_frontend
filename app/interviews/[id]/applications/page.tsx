"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchApplications } from "@/utils/api"
import { ApplicationList } from "@/components/application-list"
import { AdvancedFilters } from "@/components/advanced-filters"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useInterviewStore } from "@/store/interviewStore"

const PAGE_SIZE = 20

export default function InterviewApplicationsPage() {
  const { id } = useParams() as { id: string }
  const [filters, setFilters] = useState({})
  const { interviews, fetchInterviews } = useInterviewStore()
  const [personalityTypes, setPersonalityTypes] = useState<string[]>([])

  useEffect(() => {
    fetchInterviews()
    // Simulating fetching personality types
    setPersonalityTypes(["INTJ", "ENTJ", "INFJ", "ENFJ", "ISTJ", "ESTJ", "ISFJ", "ESFJ"])
  }, [fetchInterviews])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["applications", id, filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchApplications({ interviewId: id, page: pageParam, pageSize: PAGE_SIZE, filters }),
    getNextPageParam: (lastPage, pages) => (lastPage.totalPages > pages.length ? pages.length + 1 : undefined),
  })

  const intObserver = useRef<IntersectionObserver>()
  const lastApplicationRef = useCallback(
    (application: HTMLDivElement) => {
      if (isFetchingNextPage) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((applications) => {
        if (applications[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (application) intObserver.current.observe(application)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  )

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  if (status === "loading") return <LoadingSpinner />
  if (status === "error") return <div>Bir hata oluştu</div>

  const applications = data?.pages.flatMap((page) => page.data) || []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">Mülakat Başvuruları</h1>
        <AdvancedFilters
          onFilterChange={handleFilterChange}
          interviews={interviews}
          personalityTypes={personalityTypes}
        />
        <ApplicationList applications={applications} lastApplicationRef={lastApplicationRef} />
        {isFetchingNextPage && <LoadingSpinner />}
      </main>
    </div>
  )
}

