"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react"; // İkonlar eklendi

interface FilterSectionProps {
  // 📌 State'i parent'tan alıyoruz (Controlled Component)
  filters: {
    sortBy: string;
    interviewType: string;
    status: string;
    searchTerm: string;
  };
  onFilterChange: (newFilters: any) => void;
}

export function FilterSection({ filters, onFilterChange }: FilterSectionProps) {

  // Tek bir alanı güncellemek için yardımcı fonksiyon
  // Bu sayede "Filtrele" butonuna gerek kalmadan anlık değişim sağlarız.
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Filtreleri sıfırlama
  const clearFilters = () => {
    onFilterChange({
      sortBy: "newest",
      interviewType: "all",
      status: "all",
      searchTerm: "",
    });
  };

  const hasActiveFilters = filters.status !== "all" || filters.interviewType !== "all" || filters.searchTerm !== "";

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center">
      
      {/* 🔹 Arama Alanı */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Başlık ara..."
          className="pl-9 w-full sm:w-[220px]"
          value={filters.searchTerm || ""}
          onChange={(e) => updateFilter("searchTerm", e.target.value)}
        />
      </div>

      {/* 🔹 Sıralama */}
      <Select 
        value={filters.sortBy} 
        onValueChange={(val) => updateFilter("sortBy", val)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">En Yeni</SelectItem>
          <SelectItem value="oldest">En Eski</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Mülakat Türü (Backend Enum ile Eşitlendi) */}
      <Select 
        value={filters.interviewType} 
        onValueChange={(val) => updateFilter("interviewType", val)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mülakat Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Tipler</SelectItem>
          {/* Backend'deki InterviewType enum'ı ile birebir aynı value değerleri */}
          <SelectItem value="async-video">Asenkron Video</SelectItem>
          <SelectItem value="live-video">Canlı Video</SelectItem>
          <SelectItem value="audio-only">Sadece Ses</SelectItem>
          <SelectItem value="text-based">Metin Tabanlı</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Mülakat Durumu */}
      <Select 
        value={filters.status} 
        onValueChange={(val) => updateFilter("status", val)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="completed">Tamamlanan</SelectItem>
          <SelectItem value="draft">Taslak</SelectItem>
          <SelectItem value="published">Yayında</SelectItem>
          <SelectItem value="inactive">Pasif</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔹 Filtre Temizleme Butonu (Sadece filtre varsa görünür) */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearFilters}
          title="Filtreleri Temizle"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}