import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Candidate } from "@/mockdata/candidates"
import { CandidateDetails } from "@/components/candidate-details"

interface CandidateListProps {
  candidates: Candidate[]
  filters: any
}

export function CandidateList({ candidates, filters }: CandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const filteredCandidates = candidates.filter((candidate) => {
    if (filters.status && candidate.status !== filters.status) return false
    if (filters.position && candidate.appliedPosition !== filters.position) return false
    if (filters.personalityType && candidate.personalityType !== filters.personalityType) return false
    return true
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredCandidates.map((candidate) => (
        <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{candidate.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{candidate.appliedPosition}</p>
            <Badge className="mb-2">{candidate.status}</Badge>
            <p className="text-sm mb-2">AI Skoru: {candidate.aiScore}</p>
            <Button onClick={() => setSelectedCandidate(candidate)}>Detayları Gör</Button>
          </CardContent>
        </Card>
      ))}
      {selectedCandidate && (
        <CandidateDetails candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  )
}

