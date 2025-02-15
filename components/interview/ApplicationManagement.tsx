"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Application {
  id: string
  candidateName: string
  status: "pending" | "inProgress" | "completed" | "rejected"
  submissionDate: string
}

const mockApplications: Application[] = [
  { id: "1", candidateName: "John Doe", status: "pending", submissionDate: "2023-06-01" },
  { id: "2", candidateName: "Jane Smith", status: "inProgress", submissionDate: "2023-06-02" },
  { id: "3", candidateName: "Bob Johnson", status: "completed", submissionDate: "2023-06-03" },
]

export function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)

  const updateStatus = (id: string, newStatus: Application["status"]) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Başvuru Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aday Adı</TableHead>
              <TableHead>Başvuru Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.candidateName}</TableCell>
                <TableCell>{application.submissionDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      application.status === "completed"
                        ? "secondary"
                        : application.status === "rejected"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={application.status}
                    onValueChange={(value: Application["status"]) => updateStatus(application.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Durum Güncelle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="inProgress">Devam Ediyor</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="rejected">Reddedildi</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

