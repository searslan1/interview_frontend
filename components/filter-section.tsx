"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface FilterSectionProps {
  onFilterChange: (filters: any) => void
}

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [interviewType, setInterviewType] = useState("all")
  const [status, setStatus] = useState("all")

  const handleFilter = () => {
    onFilterChange({
      sortBy,
      interviewType,
      status,
    })
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">En Yeni</SelectItem>
          <SelectItem value="oldest">En Eski</SelectItem>
        </SelectContent>
      </Select>

      <Select value={interviewType} onValueChange={setInterviewType}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Mülakat Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="technical">Teknik</SelectItem>
          <SelectItem value="behavioral">Davranışsal</SelectItem>
          <SelectItem value="personality">Kişilik Testi</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="completed">Tamamlanan</SelectItem>
          <SelectItem value="draft">Taslak</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleFilter}>Filtrele</Button>
    </div>
  )
}

