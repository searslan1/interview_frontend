"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"

export function DashboardFilters() {
  //const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [interviewType, setInterviewType] = useState<string>("")
  const [applicationStatus, setApplicationStatus] = useState<string>("")

  const handleFilter = () => {
    console.log("Filtering with:", { interviewType, applicationStatus })
    // Implement filtering logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrele</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <DatePickerWithRange />
        <Select value={interviewType} onValueChange={setInterviewType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mülakat Türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="technical">Teknik</SelectItem>
            <SelectItem value="hr">İK</SelectItem>
          </SelectContent>
        </Select>
        <Select value={applicationStatus} onValueChange={setApplicationStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Başvuru Durumu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="positive">Olumlu</SelectItem>
            <SelectItem value="negative">Olumsuz</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleFilter}>Filtrele</Button>
      </CardContent>
    </Card>
  )
}

