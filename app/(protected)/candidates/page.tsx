"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useCandidateStore } from "@/store/candidateStore"
import { CandidateList } from "@/components/candidate/CandidateList"
import { CandidateFilters } from "@/components/candidate/candidate-filters"
import { Header } from "@/components/Header"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ApplicationFilters } from "@/types/application"
import { Candidate,  } from "@/types/candidate"

export default function CandidatesPage() {
  const { candidates, isLoading, error, fetchCandidates } = useCandidateStore()
  const [filters, setFilters] = useState<ApplicationFilters>({} as ApplicationFilters)

  useEffect(() => {
    const fetchData = async () => {
      await fetchCandidates()
    }
    fetchData()
  }, [])

  const applyFilters = (candidate: Candidate) => {
    if (filters.searchTerm && !candidate.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false
    }
    if (filters.experienceLevel !== "all" && filters.experienceLevel !== undefined) {
      if (filters.experienceLevel === "entry" && candidate.experience && candidate.experience.length < 2) return true
      if (filters.experienceLevel === "mid" && candidate.experience && candidate.experience.length >= 2 && candidate.experience.length <= 5)
        return true
      if (filters.experienceLevel === "senior" && candidate.experience && candidate.experience.length > 5) return true
      return false
    }
    return true
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 font-bold">Adaylar yüklenirken bir hata oluştu.</p>
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Aday Yönetimi</h1>
          <CandidateFilters filters={filters} onFilterChange={setFilters} />
          <CandidateList candidates={candidates.filter(applyFilters)} />
        </motion.div>
      </main>
    </div>
  )
}
