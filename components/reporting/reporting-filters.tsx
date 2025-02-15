"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"

interface ReportingFiltersProps {
  filters: {
    dateRange: string
    interviewId: string
    candidateScoreMin: number
    experienceLevel: string
    analysisType: string
  }
  onFilterChange: (filters: Partial<ReportingFiltersProps["filters"]>) => void
}

export function ReportingFilters({ filters, onFilterChange }: ReportingFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tarih Aralığı</label>
        <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({ dateRange: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Tarih aralığı seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Son 1 ay</SelectItem>
            <SelectItem value="3m">Son 3 ay</SelectItem>
            <SelectItem value="6m">Son 6 ay</SelectItem>
            <SelectItem value="1y">Son 1 yıl</SelectItem>
            <SelectItem value="custom">Özel tarih aralığı</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filters.dateRange === "custom" && (
        <div>
          <label className="block text-sm font-medium mb-1">Özel Tarih Aralığı</label>
          <DatePickerWithRange />
        </div>
      )}
      {/* Diğer filtre alanları */}
    </div>
  )
}

