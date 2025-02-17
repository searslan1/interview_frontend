"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useCandidateStore } from "@/store/candidateStore"
import { CandidateList } from "@/components/candidate/candidate-list"
import { CandidateFilters } from "@/components/candidate/candidate-filters"
import { Header } from "@/components/Header"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function CandidatesPage() {
  const { candidates, isLoading, error, fetchCandidates } = useCandidateStore()
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Aday Yönetimi</h1>
          <CandidateFilters onFilterChange={handleFilterChange} />
          <CandidateList candidates={candidates} filters={filters} />
        </motion.div>
      </main>
    </div>
  )
}

