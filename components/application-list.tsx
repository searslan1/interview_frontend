import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Application } from "@/mockdata/applications"

interface ApplicationListProps {
  applications: Application[]
  lastApplicationRef: (node: HTMLDivElement | null) => void
}

export function ApplicationList({ applications, lastApplicationRef }: ApplicationListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((application, index) => (
        <Card
          key={application.id}
          ref={index === applications.length - 1 ? lastApplicationRef : null}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{application.candidateName}</h3>
            <p className="text-sm text-gray-600 mb-2">{application.interviewTitle}</p>
            <Badge className="mb-2">{application.status}</Badge>
            <p className="text-sm mb-2">Başvuru Tarihi: {application.submissionDate}</p>
            <p className="text-sm mb-2">AI Skoru: {application.aiScore}</p>
            <Button variant="outline" className="w-full">
              Detayları Gör
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

