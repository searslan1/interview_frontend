"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

import { ApplicationFilterState, ApplicationStatus } from "@/types/application"
import {useApplicationStore} from "@/store/applicationStore" 

interface AdvancedFiltersProps {
  interviews?: { id: string; title: string }[]
  personalityTypes?: string[]
  onFilterChange?: (filters: Partial<ApplicationFilterState>) => void
}

export function AdvancedFilters({ interviews = [], personalityTypes = [] }: AdvancedFiltersProps) {
  
  const { filters, setFilters } = useApplicationStore(); 
  
  const [localFilters, setLocalFilters] = useState<Partial<ApplicationFilterState>>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = <K extends keyof ApplicationFilterState>(key: K, value: ApplicationFilterState[K] | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  const applyFilters = () => {
    setFilters(localFilters);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalFilters((prev) => ({ ...prev, query }));
    if (query.length >= 3 || query.length === 0) {
      setFilters({ ...localFilters, query });
    }
  }

  const handleStatusChange = (value: string) => {
    const status = value === 'all' ? 'all' : value as ApplicationStatus;
    handleFilterChange("status", status);
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
              <Select 
                value={localFilters.interviewId || 'all'} 
                onValueChange={(value) => handleFilterChange("interviewId", value === 'all' ? undefined : value)}
              >
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
            <Label>Durum</Label>
            <Select
              value={localFilters.status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="accepted">Kabul Edildi</SelectItem>
                <SelectItem value="rejected">Reddedildi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Minimum AI Uyum Puanı: {localFilters.aiScoreMin || 0}</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[localFilters.aiScoreMin || 0]} 
              onValueChange={([value]) => handleFilterChange("aiScoreMin", value)}
            />
          </div>

          <div>
            <Label>Arama</Label>
            <Input
              type="text"
              placeholder="Aday adı veya anahtar kelime"
              value={localFilters.query || ''}
              onChange={handleSearchChange} 
            />
          </div>

          <Button onClick={applyFilters}>Filtreleri Uygula</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
