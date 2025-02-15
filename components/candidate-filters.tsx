import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface CandidateFiltersProps {
  onFilterChange: (filters: any) => void
}

export function CandidateFilters({ onFilterChange }: CandidateFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ [key]: value })
  }

  return (
    <div className="flex space-x-4 mb-6">
      <Select onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="pending">Beklemede</SelectItem>
          <SelectItem value="interviewing">Mülakat Aşamasında</SelectItem>
          <SelectItem value="offered">Teklif Verildi</SelectItem>
          <SelectItem value="rejected">Reddedildi</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleFilterChange("position", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pozisyon" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
          <SelectItem value="Backend Developer">Backend Developer</SelectItem>
          <SelectItem value="UX Designer">UX Designer</SelectItem>
          <SelectItem value="Product Manager">Product Manager</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleFilterChange("personalityType", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kişilik Tipi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="INTJ">INTJ</SelectItem>
          <SelectItem value="ENFP">ENFP</SelectItem>
          <SelectItem value="ISTJ">ISTJ</SelectItem>
          <SelectItem value="ENTJ">ENTJ</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={() => onFilterChange({})}>Filtreleri Sıfırla</Button>
    </div>
  )
}

