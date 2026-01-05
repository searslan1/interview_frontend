"use client";

import { useState, useEffect } from "react";
import { useCandidateStore } from "@/store/candidateStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  SlidersHorizontal,
  X,
  CalendarIcon,
  Star,
  Archive,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { CandidateFilters, CandidateSortBy, CandidateStatus } from "@/types/candidate";

// Sıralama seçenekleri (Types ile uyumlu)
const sortOptions: { value: CandidateSortBy; label: string }[] = [
  { value: "lastInterview", label: "Son Mülakat Tarihi" },
  { value: "name", label: "İsim (A-Z)" },
  { value: "score", label: "AI Skoru" },
  { value: "createdAt", label: "Eklenme Tarihi" },
];

// Durum seçenekleri
const statusOptions: { value: CandidateStatus | "all"; label: string }[] = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "active", label: "Aktif" },
  { value: "reviewed", label: "İncelendi" },
  { value: "shortlisted", label: "Kısa Liste" },
  { value: "archived", label: "Arşiv" },
  { value: "rejected", label: "Reddedildi" },
];

export function CandidateFilterBar() {
  const {
    filters,
    sortBy,
    sortOrder,
    availablePositions,
    setFilters,
    resetFilters,
    setSorting,
    fetchAvailablePositions,
  } = useCandidateStore();

  // Local state for UI inputs
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Sheet içindeki filtreler için geçici state
  const [localFilters, setLocalFilters] = useState<Partial<CandidateFilters>>(filters);

  // Pozisyonları yükle
  useEffect(() => {
    fetchAvailablePositions();
  }, [fetchAvailablePositions]);

  // Arama debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters({ search: searchTerm || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  // Sheet açıldığında mevcut filtreleri senkronize et
  useEffect(() => {
    if (isFiltersOpen) {
      setLocalFilters(filters);
    }
  }, [isFiltersOpen, filters]);

  // Aktif filtre sayısı hesaplama
  const activeFilterCount = [
    filters.status && filters.status.length > 0,
    filters.positionIds && filters.positionIds.length > 0,
    filters.lastInterviewAfter || filters.lastInterviewBefore,
    filters.minInterviewCount,
    filters.minOverallScore || filters.maxOverallScore,
    filters.onlyFavorites,
  ].filter(Boolean).length;

  // Filtreleri uygula (Sheet'ten)
  const applyFilters = () => {
    setFilters(localFilters);
    setIsFiltersOpen(false);
  };

  // Filtreleri tamamen sıfırla
  const handleResetFilters = () => {
    setLocalFilters({});
    resetFilters();
    setSearchTerm("");
    setIsFiltersOpen(false);
  };

  // Sıralama değiştir
  const handleSortChange = (newSortBy: CandidateSortBy) => {
    if (sortBy === newSortBy) {
      setSorting(sortBy, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(newSortBy, "desc");
    }
  };

  // Helper: Tekli seçimleri array'e çevir (Select için)
  const currentStatus = filters.status && filters.status.length > 0 ? filters.status[0] : "all";
  const currentPosition = filters.positionIds && filters.positionIds.length > 0 ? filters.positionIds[0] : "all";

  return (
    <div className="space-y-4">
      {/* Ana Filtre Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Arama */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İsim, email veya notlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Hızlı Filtreler */}
        <div className="flex items-center gap-2">
          {/* Pozisyon */}
          <Select
            value={currentPosition}
            onValueChange={(value) => setFilters({ positionIds: value === "all" ? undefined : [value] })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pozisyon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Pozisyonlar</SelectItem>
              {availablePositions.map((pos) => (
                <SelectItem key={pos._id} value={pos._id}>
                  {pos.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Durum */}
          <Select
            value={currentStatus}
            onValueChange={(value) => setFilters({ 
              status: value === "all" ? undefined : [value as CandidateStatus]
            })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sıralama */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sırala</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium">Sıralama Kriteri</p>
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Favoriler Toggle */}
          <Button
            variant={filters.onlyFavorites ? "default" : "outline"}
            size="icon"
            onClick={() => setFilters({ onlyFavorites: !filters.onlyFavorites })}
            className="relative"
            title="Sadece Favoriler"
          >
            <Star
              className={cn(
                "h-4 w-4",
                filters.onlyFavorites && "fill-yellow-400 text-yellow-400"
              )}
            />
          </Button>

          {/* Gelişmiş Filtreler Sheet */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtreler</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Gelişmiş Filtreler</SheetTitle>
                <SheetDescription>
                  Aday listesini daraltmak için detaylı kriterler belirleyin
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Tarih Aralığı */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Son Mülakat Tarihi</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !localFilters.lastInterviewAfter && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {localFilters.lastInterviewAfter
                            ? format(new Date(localFilters.lastInterviewAfter), "PPP", { locale: tr })
                            : "Başlangıç"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={localFilters.lastInterviewAfter ? new Date(localFilters.lastInterviewAfter) : undefined}
                          onSelect={(date) =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              lastInterviewAfter: date, // Date objesi olarak sakla
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-muted-foreground">-</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !localFilters.lastInterviewBefore && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {localFilters.lastInterviewBefore
                            ? format(new Date(localFilters.lastInterviewBefore), "PPP", { locale: tr })
                            : "Bitiş"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={localFilters.lastInterviewBefore ? new Date(localFilters.lastInterviewBefore) : undefined}
                          onSelect={(date) =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              lastInterviewBefore: date,
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                {/* Minimum Mülakat Sayısı */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Minimum Mülakat Sayısı</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[localFilters.minInterviewCount || 0]}
                      onValueChange={([value]) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minInterviewCount: value > 0 ? value : undefined,
                        }))
                      }
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8 text-right">
                      {localFilters.minInterviewCount || 0}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* AI Skor Aralığı */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Ortalama AI Skoru</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[
                        localFilters.minOverallScore || 0,
                        localFilters.maxOverallScore || 100,
                      ]}
                      onValueChange={([min, max]) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minOverallScore: min > 0 ? min : undefined,
                          maxOverallScore: max < 100 ? max : undefined,
                        }))
                      }
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-16 text-right">
                      {localFilters.minOverallScore || 0} - {localFilters.maxOverallScore || 100}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Togglelar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Sadece Favoriler</Label>
                      <p className="text-xs text-muted-foreground">
                        Yalnızca favorilere eklediğiniz adayları göster
                      </p>
                    </div>
                    <Switch
                      checked={localFilters.onlyFavorites || false}
                      onCheckedChange={(checked) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          onlyFavorites: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <SheetFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleResetFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button onClick={applyFilters}>Filtreleri Uygula</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Aktif Filtre Rozetleri (Badges) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Aktif Filtreler:</span>
          
          {filters.status && filters.status.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Durum: {statusOptions.find((s) => s.value === filters.status![0])?.label}
              <button onClick={() => setFilters({ status: undefined })} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.positionIds && filters.positionIds.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Pozisyon: {availablePositions.find((p) => p._id === filters.positionIds![0])?.title || "Seçili"}
              <button onClick={() => setFilters({ positionIds: undefined })} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.lastInterviewAfter || filters.lastInterviewBefore) && (
            <Badge variant="secondary" className="gap-1">
              Tarih: {filters.lastInterviewAfter ? format(new Date(filters.lastInterviewAfter), "dd/MM") : "..."} -{" "}
              {filters.lastInterviewBefore ? format(new Date(filters.lastInterviewBefore), "dd/MM") : "..."}
              <button
                onClick={() => setFilters({ lastInterviewAfter: undefined, lastInterviewBefore: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.minInterviewCount && (
            <Badge variant="secondary" className="gap-1">
              Min. {filters.minInterviewCount} mülakat
              <button onClick={() => setFilters({ minInterviewCount: undefined })} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.minOverallScore || filters.maxOverallScore) && (
            <Badge variant="secondary" className="gap-1">
              AI Skoru: {filters.minOverallScore || 0} - {filters.maxOverallScore || 100}
              <button
                onClick={() => setFilters({ minOverallScore: undefined, maxOverallScore: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.onlyFavorites && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Favoriler
              <button onClick={() => setFilters({ onlyFavorites: false })} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleResetFilters}
          >
            Tümünü Temizle
          </Button>
        </div>
      )}
    </div>
  );
}