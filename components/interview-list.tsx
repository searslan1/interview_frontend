"use client"
import { InterviewCard } from "@/components/InterviewCard"
import type { Interview } from "@/types/interview"

interface InterviewListProps {
  interviews: Interview[]
  filters: any
}

export function InterviewList({ interviews, filters }: InterviewListProps) {
  const filteredInterviews = interviews.filter((interview) => {
    if (filters.status && interview.status !== filters.status) return false
    if (filters.type && interview.type !== filters.type) return false
    if (filters.searchTerm && !interview.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredInterviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} />
      ))}
    </div>
  )
}

