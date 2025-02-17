"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { ApplicationList } from "@/components/application-list"
import { AdvancedFilters } from "@/components/applications/advanced-filters"
import { ApplicationPreviewDialog } from "@/components/applications/application-preview-dialog"
import { Header } from "@/components/header"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { fetchApplications } from "@/utils/api"

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("applicationDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [interviews, setInterviews] = useState([
    { id: "1", title: "Yazılım Geliştirici Mülakatı" },
    { id: "2", title: "Ürün Yöneticisi Mülakatı" },
    { id: "3", title: "Veri Bilimci Mülakatı" },
  ])
  const [personalityTypes, setPersonalityTypes] = useState([
    "INTJ",
    "ENTJ",
    "INFJ",
    "ENFJ",
    "ISTJ",
    "ESTJ",
    "ISFJ",
    "ESFJ",
  ])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["applications", filters, sortBy, sortOrder],
    queryFn: ({ pageParam = 0 }) => fetchApplications({ pageParam, filters, sortBy, sortOrder }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
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

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-")
    setSortBy(newSortBy)
    setSortOrder(newSortOrder as "asc" | "desc")
  }

  if (status === "loading") {
    return <LoadingSpinner />
  }
  if (status === "error") return <div>Bir hata oluştu</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Başvurular</h1>
            <div className="flex space-x-2">
              <AdvancedFilters
                onFilterChange={handleFilterChange}
                interviews={interviews}
                personalityTypes={personalityTypes}
              />
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sıralama seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applicationDate-desc">En Yeni Başvurular</SelectItem>
                  <SelectItem value="applicationDate-asc">En Eski Başvurular</SelectItem>
                  <SelectItem value="aiScore-desc">En Yüksek AI Skoru</SelectItem>
                  <SelectItem value="aiScore-asc">En Düşük AI Skoru</SelectItem>
                  <SelectItem value="gestureScore-desc">En Yüksek Jest & Mimik Skoru</SelectItem>
                  <SelectItem value="speechScore-desc">En Yüksek Ses & Konuşma Skoru</SelectItem>
                  <SelectItem value="linkedInScore-desc">En Yüksek LinkedIn Uyumu</SelectItem>
                  <SelectItem value="technicalScore-desc">En Yüksek Teknik Skor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ApplicationList
            applications={data?.pages.flatMap((page) => page.data) || []}
            onApplicationSelect={setSelectedApplication}
            lastApplicationRef={lastApplicationRef}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

          {isFetchingNextPage && (
            <div className="text-center mt-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          )}

          {selectedApplication && (
            <ApplicationPreviewDialog
              applicationId={selectedApplication}
              open={!!selectedApplication}
              onOpenChange={() => setSelectedApplication(null)}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

