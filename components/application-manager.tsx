"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CandidateDetailCard } from "@/components/candidate-detail-card"

// Mock data for applications
const mockApplications = [
  { id: 1, name: "John Doe", status: "Beklemede", applicationDate: "2023-05-15" },
  { id: 2, name: "Jane Smith", status: "Olumlu", applicationDate: "2023-05-16" },
  { id: 3, name: "Bob Johnson", status: "Olumsuz", applicationDate: "2023-05-17" },
  // Add more mock applications as needed
]

interface ApplicationManagerProps {
  interviewId: number
}

export function ApplicationManager({ interviewId }: ApplicationManagerProps) {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)

  // In a real application, you would fetch the applications based on the interviewId
  const applications = mockApplications

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Başvurular</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {applications.map((application) => (
          <Card key={application.id} className="flex-shrink-0 w-64 bg-gray-800 text-white">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{application.name}</h3>
              <p className="text-sm mb-2">Başvuru: {application.applicationDate}</p>
              <Badge
                variant={
                  application.status === "Olumlu"
                    ? "success"
                    : application.status === "Olumsuz"
                      ? "destructive"
                      : "secondary"
                }
              >
                {application.status}
              </Badge>
              <Button className="mt-4 w-full" onClick={() => setSelectedApplication(application.id)}>
                Detaylar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedApplication && (
        <CandidateDetailCard
          application={applications.find((app) => app.id === selectedApplication)!}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </motion.div>
  )
}

