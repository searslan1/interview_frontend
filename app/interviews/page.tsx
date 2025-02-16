"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInterviewStore } from "@/store/interview-store"
import { InterviewList } from "@/components/interview-list"
import { FilterSection } from "@/components/filter-section"
import { Header } from "@/components/header"
import { CreateInterviewDialog } from "@/components/create-interview-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function InterviewsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filters, setFilters] = useState({})
  const { interviews, isLoading, error, fetchAllInterviews } = useInterviewStore()

  useEffect(() => {
    fetchAllInterviews()
  }, [fetchAllInterviews])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Hata: {error}</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mülakatlar</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Yeni Mülakat Oluştur</Button>
          </div>

          <FilterSection filters={filters} onFilterChange={handleFilterChange} />

          {interviews.length > 0 ? (
            <InterviewList interviews={interviews} filters={filters} />
          ) : (
            <p>Henüz mülakat bulunmamaktadır.</p>
          )}

          <CreateInterviewDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </motion.div>
      </main>
    </div>
  )
}

