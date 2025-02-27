"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { ApplicationFilters } from "@/types/application"

interface AdvancedFiltersProps {
  onFilterChange: (filters: ApplicationFilters) => void
  interviews?: { id: string; title: string }[]
  personalityTypes?: string[]
}

export function AdvancedFilters({ onFilterChange, interviews = [], personalityTypes = [] }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    interviewId: "all",
    dateRange: { from: undefined, to: undefined },
    completionStatus: "all",
    applicationStatus: "all",
    experienceLevel: "all",
    aiScoreMin: 0,
    personalityType: "all",
    searchTerm: "",
  })

  const handleFilterChange = <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    onFilterChange(filters)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Gelişmiş Filtreler <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gelişmiş Filtreler</h2>

          <div>
            <Label>Mülakat Seçimi</Label>
            {interviews.length > 0 && (
              <Select value={filters.interviewId} onValueChange={(value) => handleFilterChange("interviewId", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mülakat seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Mülakatlar</SelectItem>
                  {interviews.map((interview) => (
                    <SelectItem key={interview.id} value={interview.id}>
                      {interview.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label>Tarih Aralığı</Label>
            <DatePickerWithRange onChange={(range) => handleFilterChange("dateRange", range)} />
          </div>

          <div>
            <Label>Tamamlanma Durumu</Label>
            <Select
              value={filters.completionStatus}
              onValueChange={(value) => handleFilterChange("completionStatus", value as ApplicationFilters["completionStatus"])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="inProgress">Devam Ediyor</SelectItem>
                <SelectItem value="incomplete">Eksik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Başvuru Durumu</Label>
            <Select
              value={filters.applicationStatus}
              onValueChange={(value) => handleFilterChange("applicationStatus", value as ApplicationFilters["applicationStatus"])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="reviewing">İnceleniyor</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="positive">Olumlu</SelectItem>
                <SelectItem value="negative">Olumsuz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Minimum AI Uyum Puanı: {filters.aiScoreMin}</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[filters.aiScoreMin]}
              onValueChange={([value]) => handleFilterChange("aiScoreMin", value)}
            />
          </div>

          <div>
            <Label>Kişilik Tipi</Label>
            {personalityTypes.length > 0 && (
              <Select
                value={filters.personalityType}
                onValueChange={(value) => handleFilterChange("personalityType", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kişilik Tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {personalityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label>Arama</Label>
            <Input
              type="text"
              placeholder="Aday adı, ID veya anahtar kelime"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          <Button onClick={applyFilters}>Filtreleri Uygula</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
