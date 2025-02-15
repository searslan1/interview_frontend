"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ApplicationListProps {
  applications: Array<{
    id: string
    candidateName: string
    status: string
    submissionDate: string
    aiScore: number
    interviewTitle: string
  }>
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Başvurular</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aday Adı</TableHead>
              <TableHead>Mülakat</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Başvuru Tarihi</TableHead>
              <TableHead>AI Skoru</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.candidateName}</TableCell>
                <TableCell>{application.interviewTitle}</TableCell>
                <TableCell>
                  <Badge>{application.status}</Badge>
                </TableCell>
                <TableCell>{application.submissionDate}</TableCell>
                <TableCell>{application.aiScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

