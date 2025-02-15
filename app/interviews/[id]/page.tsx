"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useInterviewStore } from "@/store/interviewStore"
import { InterviewDetails } from "@/components/interview/InterviewDetails"
import { ApplicationList } from "@/components/interview/ApplicationList"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function InterviewDetailPage() {
  const { id } = useParams()
  const { interviews, fetchInterviews, fetchApplications, getApplicationsWithInterviewDetails } = useInterviewStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchInterviews(), fetchApplications()])
      setIsLoading(false)
    }
    loadData()
  }, [fetchInterviews, fetchApplications])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const interview = interviews.find((i) => i.id === id)
  const applicationsWithDetails = getApplicationsWithInterviewDetails().filter((app) => app.interviewId === id)

  if (!interview) {
    return <div>Mülakat bulunamadı.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{interview.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InterviewDetails interview={interview} />
        <ApplicationList applications={applicationsWithDetails} />
      </div>
    </div>
  )
}

