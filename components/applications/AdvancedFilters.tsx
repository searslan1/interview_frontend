"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

// ✅ Düzeltme denemesi: Next.js takma adlarını kullanıyoruz.
import { DatePickerWithRange } from "@/components/ui/date-range-picker" 
import { ApplicationFilters } from "@/types/application"
import useApplicationStore from "@/store/applicationStore" 

interface AdvancedFiltersProps {
  interviews?: { id: string; title: string }[]
  personalityTypes?: string[]
}

export function AdvancedFilters({ interviews = [], personalityTypes = [] }: AdvancedFiltersProps) {
  
  const { filters, setFilters } = useApplicationStore(); 
  
  const [localFilters, setLocalFilters] = useState<Partial<ApplicationFilters>>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = <K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K] | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  const applyFilters = () => {
    setFilters(localFilters);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setLocalFilters((prev) => ({ ...prev, searchTerm }));
    if (searchTerm.length >= 3 || searchTerm.length === 0) {
      setFilters({ ...localFilters, searchTerm });
    }
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
              <Select value={localFilters.interviewId} onValueChange={(value) => handleFilterChange("interviewId", value)}>
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
            {/* Prop hatası düzeltildi */}
            <DatePickerWithRange 
                onChange={(range) => handleFilterChange("dateRange", range as any)} 
            />
          </div>

          <div>
            <Label>Tamamlanma Durumu</Label>
            <Select
              value={localFilters.completionStatus}
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
              value={localFilters.applicationStatus}
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
            <Label>Minimum AI Uyum Puanı: {localFilters.aiScoreMin}</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[localFilters.aiScoreMin as number]} 
              onValueChange={([value]) => handleFilterChange("aiScoreMin", value)}
            />
          </div>

          <div>
            <Label>Kişilik Tipi</Label>
            {personalityTypes.length > 0 && (
              <Select
                value={localFilters.personalityType}
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
              value={localFilters.searchTerm}
              onChange={handleSearchChange} 
            />
          </div>

          <Button onClick={applyFilters}>Filtreleri Uygula</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
