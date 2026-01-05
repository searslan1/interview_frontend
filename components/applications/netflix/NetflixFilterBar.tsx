"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  TrendingUp,
  Calendar,
  Building2,
  Tag,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationFilters } from "@/types/application";

interface NetflixFilterBarProps {
  filters: Partial<ApplicationFilters>;
  onFilterChange: (filters: Partial<ApplicationFilters>) => void;
  positions?: { id: string; title: string; department?: string }[];
  totalCount?: number;
  filteredCount?: number;
}

// Filtre etiketleri
const statusLabels: Record<string, string> = {
  all: "Tümü",
  completed: "Tamamlandı",
  inProgress: "Devam Ediyor",
  incomplete: "Tamamlanmadı",
};

const applicationStatusLabels: Record<string, string> = {
  all: "Tümü",
  reviewing: "İnceleniyor",
  pending: "Beklemede",
  positive: "Olumlu",
  negative: "Olumsuz",
};

const experienceLabels: Record<string, string> = {
  all: "Tümü",
  entry: "Giriş Seviye",
  mid: "Orta Seviye",
  senior: "Üst Seviye",
};

export function NetflixFilterBar({
  filters,
  onFilterChange,
  positions = [],
  totalCount = 0,
  filteredCount = 0,
}: NetflixFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ApplicationFilters>>(filters);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.searchTerm) {
        onFilterChange({ ...filters, searchTerm });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Aktif filtre sayısı
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "searchTerm") return false;
    if (key === "aiScoreMin" && value === 0) return false;
    if (value === "all" || value === undefined || value === "") return false;
    return true;
  }).length;

  // Filtre uygula
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsSheetOpen(false);
  };

  // Filtreleri sıfırla
  const resetFilters = () => {
    const defaultFilters: Partial<ApplicationFilters> = {
      completionStatus: "all",
      applicationStatus: "all",
      experienceLevel: "all",
      aiScoreMin: 0,
      searchTerm: "",
      personalityType: "",
    };
    setLocalFilters(defaultFilters);
    setSearchTerm("");
    onFilterChange(defaultFilters);
  };

  // Tek filtre güncelle
  const updateFilter = <K extends keyof ApplicationFilters>(
    key: K,
    value: ApplicationFilters[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Sol: Arama ve Hızlı Filtreler */}
          <div className="flex items-center gap-3 flex-1">
            {/* Arama */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Aday ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 bg-muted/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Hızlı Filtreler (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* AI Skor Filtresi */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    AI Skoru
                    {filters.aiScoreMin && filters.aiScoreMin > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        ≥{filters.aiScoreMin}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Minimum AI Skoru</Label>
                      <span className="text-sm font-medium">{localFilters.aiScoreMin || 0}%</span>
                    </div>
                    <Slider
                      value={[localFilters.aiScoreMin || 0]}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateFilter("aiScoreMin", value[0])}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => updateFilter("aiScoreMin", 0)}>
                        Sıfırla
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => onFilterChange({ ...filters, aiScoreMin: localFilters.aiScoreMin })}>
                        Uygula
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Durum Filtresi */}
              <Select
                value={filters.completionStatus || "all"}
                onValueChange={(value) => onFilterChange({ ...filters, completionStatus: value as ApplicationFilters["completionStatus"] })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Pozisyon Filtresi */}
              {positions.length > 0 && (
                <Select
                  value={filters.interviewId || "all"}
                  onValueChange={(value) => onFilterChange({ ...filters, interviewId: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pozisyon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Pozisyonlar</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Sağ: Sonuç Sayısı ve Detaylı Filtreler */}
          <div className="flex items-center gap-3">
            {/* Sonuç Sayısı */}
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredCount}</span>
              {filteredCount !== totalCount && (
                <span> / {totalCount}</span>
              )}
              <span> başvuru</span>
            </div>

            {/* Aktif Filtre Badge */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="gap-2 text-muted-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Filtreleri Temizle
                    <Badge variant="secondary">{activeFilterCount}</Badge>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detaylı Filtreler Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Tüm Filtreler
                  {activeFilterCount > 0 && (
                    <Badge variant="default">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Gelişmiş Filtreler
                  </SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* AI Skor */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <Label>AI Skoru Aralığı</Label>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Minimum: {localFilters.aiScoreMin || 0}%</span>
                    </div>
                    <Slider
                      value={[localFilters.aiScoreMin || 0]}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateFilter("aiScoreMin", value[0])}
                    />
                  </div>

                  {/* Tarih Aralığı */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label>Tarih Aralığı</Label>
                    </div>
                    <DatePickerWithRange
                      onChange={(range) => updateFilter("dateRange", range as any)}
                    />
                  </div>

                  {/* Tamamlanma Durumu */}
                  <div className="space-y-3">
                    <Label>Tamamlanma Durumu</Label>
                    <Select
                      value={localFilters.completionStatus || "all"}
                      onValueChange={(value) => updateFilter("completionStatus", value as ApplicationFilters["completionStatus"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Başvuru Durumu */}
                  <div className="space-y-3">
                    <Label>Değerlendirme Durumu</Label>
                    <Select
                      value={localFilters.applicationStatus || "all"}
                      onValueChange={(value) => updateFilter("applicationStatus", value as ApplicationFilters["applicationStatus"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(applicationStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Deneyim Seviyesi */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <Label>Deneyim Seviyesi</Label>
                    </div>
                    <Select
                      value={localFilters.experienceLevel || "all"}
                      onValueChange={(value) => updateFilter("experienceLevel", value as ApplicationFilters["experienceLevel"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(experienceLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pozisyon */}
                  {positions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <Label>Pozisyon</Label>
                      </div>
                      <Select
                        value={localFilters.interviewId || "all"}
                        onValueChange={(value) => updateFilter("interviewId", value === "all" ? "" : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tüm Pozisyonlar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm Pozisyonlar</SelectItem>
                          {positions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.title}
                              {pos.department && (
                                <span className="text-muted-foreground ml-1">
                                  ({pos.department})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <SheetFooter className="flex gap-2">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Sıfırla
                  </Button>
                  <Button onClick={applyFilters} className="flex-1">
                    Filtreleri Uygula
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Aktif Filtre Etiketleri */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border"
            >
              {filters.aiScoreMin && filters.aiScoreMin > 0 && (
                <Badge variant="secondary" className="gap-1">
                  AI Skoru ≥ {filters.aiScoreMin}%
                  <button
                    onClick={() => onFilterChange({ ...filters, aiScoreMin: 0 })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.completionStatus && filters.completionStatus !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {statusLabels[filters.completionStatus]}
                  <button
                    onClick={() => onFilterChange({ ...filters, completionStatus: "all" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.applicationStatus && filters.applicationStatus !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {applicationStatusLabels[filters.applicationStatus]}
                  <button
                    onClick={() => onFilterChange({ ...filters, applicationStatus: "all" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.experienceLevel && filters.experienceLevel !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {experienceLabels[filters.experienceLevel]}
                  <button
                    onClick={() => onFilterChange({ ...filters, experienceLevel: "all" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.interviewId && (
                <Badge variant="secondary" className="gap-1">
                  Pozisyon Filtreli
                  <button
                    onClick={() => onFilterChange({ ...filters, interviewId: "" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
