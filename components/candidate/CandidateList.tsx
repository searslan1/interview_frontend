import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CandidateDetails } from "@/components/candidate/candidate-details"
import type { Candidate } from "@/types/candidate"
import { ApplicationFilters, Application } from "@/types/application"

interface CandidateListProps {
  candidates: Candidate[]
  filters: ApplicationFilters
}

export function CandidateList({ candidates, filters }: CandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  // Performans Optimizasyonu: Filtreleme işlemini `useMemo` ile optimize ettik.
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      if (filters.status && candidate.status !== filters.status) return false
      if (filters.position && candidate.appliedPosition !== filters.position) return false
      if (filters.personalityType && application.personalityType !== filters.personalityType) return false
      return true
    })
  }, [candidates, filters])

  // Modal kapatıldığında seçili adayı sıfırla
  useEffect(() => {
    if (!selectedCandidate) return
    return () => setSelectedCandidate(null)
  }, [selectedCandidate])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredCandidates.length > 0 ? (
        filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200 p-4">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">{candidate.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{candidate.appliedPosition}</p>
              
              {/* Adayın mevcut durumunu gösteren badge */}
              <Badge className="mb-2 capitalize">{candidate.status}</Badge>

              {/* AI Skoru & Kişilik Tipi */}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">AI Skoru: {candidate.aiScore}</Badge>
                {candidate.personalityType && (
                  <Badge className="ml-2" variant="secondary">Kişilik: {candidate.personalityType}</Badge>
                )}
              </div>

              {/* Detayları Gör butonu */}
              <Button className="mt-3 w-full" onClick={() => setSelectedCandidate(candidate)}>
                Detayları Gör
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-3">Hiç aday bulunamadı.</p>
      )}

      {/* Aday detay modalı */}
      {selectedCandidate && (
        <CandidateDetails candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  )
}
