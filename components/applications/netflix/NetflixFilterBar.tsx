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
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  TrendingUp,
  Tag,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationFilterState, ApplicationStatus } from "@/types/application";

interface NetflixFilterBarProps {
  filters: Partial<ApplicationFilterState>;
  onFilterChange: (filters: Partial<ApplicationFilterState>) => void;
  positions?: { id: string; title: string; department?: string }[];
  totalCount?: number;
  filteredCount?: number;
  loading?: boolean;
}

// Status etiketleri
const statusLabels: Record<ApplicationStatus | 'all', string> = {
  all: "Tümü",
  pending: "Beklemede",
  otp_verified: "OTP Onaylandı",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  rejected: "Reddedildi",
  accepted: "Kabul Edildi",
  awaiting_video_responses: "Video Bekleniyor",
  awaiting_ai_analysis: "Analiz Bekleniyor",
};

const analysisStatusLabels: Record<'all' | 'completed' | 'pending', string> = {
  all: "Tümü",
  completed: "Analiz Tamamlandı",
  pending: "Analiz Bekleniyor",
};

export function NetflixFilterBar({
  filters,
  onFilterChange,
  positions = [],
  totalCount = 0,
  filteredCount = 0,
  loading = false,
}: NetflixFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ApplicationFilterState>>(filters);
  const [searchTerm, setSearchTerm] = useState(filters.query || "");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sync with external filters
  useEffect(() => {
    setLocalFilters(filters);
    setSearchTerm(filters.query || "");
  }, [filters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.query) {
        onFilterChange({ ...filters, query: searchTerm });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Aktif filtre sayısı
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "query") return false;
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
    const defaultFilters: Partial<ApplicationFilterState> = {
      status: "all",
      analysisStatus: "all",
      aiScoreMin: 0,
      query: "",
      interviewId: undefined,
    };
    setLocalFilters(defaultFilters);
    setSearchTerm("");
    onFilterChange(defaultFilters);
  };

  // Tek filtre güncelle
  const updateFilter = <K extends keyof ApplicationFilterState>(
    key: K,
    value: ApplicationFilterState[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Sol: Arama ve Hızlı Filtreler */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Arama */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Aday ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 bg-muted/50"
                disabled={loading}
              />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Hızlı Filtreler (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* AI Skor Filtresi */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled={loading}>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => updateFilter("aiScoreMin", 0)}
                      >
                        Sıfırla
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => onFilterChange({ ...filters, aiScoreMin: localFilters.aiScoreMin })}
                      >
                        Uygula
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Durum Filtresi */}
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => onFilterChange({ ...filters, status: value as ApplicationFilterState["status"] })}
                disabled={loading}
              >
                <SelectTrigger className="w-[160px]">
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
                  onValueChange={(value) => onFilterChange({ ...filters, interviewId: value === "all" ? undefined : value })}
                  disabled={loading}
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
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {loading && <Loader2 className="h-3 w-3 animate-spin" />}
              <span className="font-medium text-foreground">{filteredCount}</span>
              {filteredCount !== totalCount && totalCount > 0 && (
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
                    disabled={loading}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Temizle
                    <Badge variant="secondary">{activeFilterCount}</Badge>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detaylı Filtreler Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={loading}>
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtreler</span>
                  {activeFilterCount > 0 && (
                    <Badge variant="default">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
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

                  {/* Başvuru Durumu */}
                  <div className="space-y-3">
                    <Label>Başvuru Durumu</Label>
                    <Select
                      value={localFilters.status || "all"}
                      onValueChange={(value) => updateFilter("status", value as ApplicationFilterState["status"])}
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

                  {/* Analiz Durumu */}
                  <div className="space-y-3">
                    <Label>AI Analiz Durumu</Label>
                    <Select
                      value={localFilters.analysisStatus || "all"}
                      onValueChange={(value) => updateFilter("analysisStatus", value as ApplicationFilterState["analysisStatus"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(analysisStatusLabels).map(([value, label]) => (
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
                        onValueChange={(value) => updateFilter("interviewId", value === "all" ? undefined : value)}
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
              className="flex flex-wrap gap-2 pt-3 border-t border-border"
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
              {filters.status && filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {statusLabels[filters.status]}
                  <button
                    onClick={() => onFilterChange({ ...filters, status: "all" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.analysisStatus && filters.analysisStatus !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {analysisStatusLabels[filters.analysisStatus]}
                  <button
                    onClick={() => onFilterChange({ ...filters, analysisStatus: "all" })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.interviewId && (
                <Badge variant="secondary" className="gap-1">
                  {positions.find(p => p.id === filters.interviewId)?.title || "Pozisyon Filtreli"}
                  <button
                    onClick={() => onFilterChange({ ...filters, interviewId: undefined })}
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
