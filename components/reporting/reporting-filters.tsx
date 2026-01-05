"use client";

import { useEffect } from "react";
import { useReportingStore } from "@/store/reportingStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  CalendarIcon,
  Star,
  X,
  Check,
  RotateCcw,
  ChevronDown,
  Briefcase,
  User,
  Tag,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Etiket seçenekleri
const tagOptions = [
  { value: "strong", label: "Güçlü", color: "bg-green-500" },
  { value: "medium", label: "Orta", color: "bg-yellow-500" },
  { value: "weak", label: "Zayıf", color: "bg-red-500" },
];

export function ReportingFilters() {
  const {
    filters,
    availablePositions,
    availableReviewers,
    availableInterviewTypes,
    setFilters,
    resetFilters,
    setDatePreset,
    fetchFilterOptions,
  } = useReportingStore();

  // Filtre seçeneklerini yükle
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Pozisyon seçimi toggle
  const togglePosition = (positionId: string) => {
    const newPositions = filters.positions.includes(positionId)
      ? filters.positions.filter((p) => p !== positionId)
      : [...filters.positions, positionId];
    setFilters({ positions: newPositions });
  };

  // Etiket seçimi toggle
  const toggleTag = (tag: "strong" | "medium" | "weak") => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setFilters({ tags: newTags });
  };

  // Aktif filtre sayısı
  const activeFilterCount = [
    filters.positions.length > 0,
    filters.datePreset !== "30d",
    filters.interviewIds && filters.interviewIds.length > 0,
    filters.reviewerIds && filters.reviewerIds.length > 0,
    filters.tags && filters.tags.length > 0,
    filters.favoritesOnly,
  ].filter(Boolean).length;

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Pozisyon Multi-Select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[180px] justify-start">
              <Briefcase className="h-4 w-4" />
              {filters.positions.length === 0 ? (
                <span>Pozisyon Seç</span>
              ) : (
                <span>{filters.positions.length} pozisyon</span>
              )}
              <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Pozisyon ara..." />
              <CommandList>
                <CommandEmpty>Pozisyon bulunamadı.</CommandEmpty>
                <CommandGroup>
                  {availablePositions.map((position) => (
                    <CommandItem
                      key={position.id}
                      onSelect={() => togglePosition(position.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.positions.includes(position.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <p>{position.name}</p>
                        {position.department && (
                          <p className="text-xs text-muted-foreground">
                            {position.department} • {position.applicationCount} başvuru
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Tarih Aralığı */}
        <div className="flex items-center gap-1 rounded-md border">
          <Button
            variant={filters.datePreset === "30d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDatePreset("30d")}
            className="rounded-r-none"
          >
            30 Gün
          </Button>
          <Button
            variant={filters.datePreset === "60d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDatePreset("60d")}
            className="rounded-none border-x"
          >
            60 Gün
          </Button>
          <Button
            variant={filters.datePreset === "90d" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDatePreset("90d")}
            className="rounded-none"
          >
            90 Gün
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={filters.datePreset === "custom" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none border-l"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: new Date(filters.dateRange.from),
                  to: new Date(filters.dateRange.to),
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setFilters({
                      datePreset: "custom",
                      dateRange: {
                        from: range.from.toISOString().split("T")[0],
                        to: range.to.toISOString().split("T")[0],
                      },
                    });
                  }
                }}
                numberOfMonths={2}
                locale={tr}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Mülakat Türü */}
        <Select
          value={filters.interviewIds?.[0] || "all"}
          onValueChange={(value) =>
            setFilters({ interviewIds: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Mülakat Türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Türler</SelectItem>
            {availableInterviewTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reviewer */}
        <Select
          value={filters.reviewerIds?.[0] || "all"}
          onValueChange={(value) =>
            setFilters({ reviewerIds: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger className="w-[160px]">
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Reviewer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Reviewerlar</SelectItem>
            {availableReviewers.map((reviewer) => (
              <SelectItem key={reviewer.id} value={reviewer.id}>
                {reviewer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Etiketler */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Tag className="h-4 w-4" />
              Etiket
              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]" align="start">
            <div className="space-y-2">
              {tagOptions.map((tag) => (
                <div
                  key={tag.value}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted",
                    filters.tags?.includes(tag.value as any) && "bg-muted"
                  )}
                  onClick={() => toggleTag(tag.value as "strong" | "medium" | "weak")}
                >
                  <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                  <span className="flex-1">{tag.label}</span>
                  {filters.tags?.includes(tag.value as any) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Favoriler Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
          <Star
            className={cn(
              "h-4 w-4",
              filters.favoritesOnly && "fill-yellow-400 text-yellow-400"
            )}
          />
          <Label htmlFor="favorites-toggle" className="text-sm cursor-pointer">
            Favoriler
          </Label>
          <Switch
            id="favorites-toggle"
            checked={filters.favoritesOnly}
            onCheckedChange={(checked) => setFilters({ favoritesOnly: checked })}
          />
        </div>

        {/* Filtreleri Sıfırla */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </Button>
        )}
      </div>

      {/* Aktif Filtre Etiketleri */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
          <span className="text-sm text-muted-foreground">Aktif Filtreler:</span>

          {/* Seçili Pozisyonlar */}
          {filters.positions.map((posId) => {
            const pos = availablePositions.find((p) => p.id === posId);
            return (
              <Badge key={posId} variant="secondary" className="gap-1">
                {pos?.name || posId}
                <button onClick={() => togglePosition(posId)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Tarih */}
          {filters.datePreset !== "30d" && (
            <Badge variant="secondary" className="gap-1">
              {filters.datePreset === "custom"
                ? `${format(new Date(filters.dateRange.from), "dd MMM", { locale: tr })} - ${format(
                    new Date(filters.dateRange.to),
                    "dd MMM",
                    { locale: tr }
                  )}`
                : filters.datePreset === "60d"
                ? "Son 60 Gün"
                : "Son 90 Gün"}
              <button onClick={() => setDatePreset("30d")} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Mülakat Türü */}
          {filters.interviewIds && filters.interviewIds.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {availableInterviewTypes.find((t) => t.id === filters.interviewIds?.[0])?.title}
              <button
                onClick={() => setFilters({ interviewIds: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Reviewer */}
          {filters.reviewerIds && filters.reviewerIds.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {availableReviewers.find((r) => r.id === filters.reviewerIds?.[0])?.name}
              <button
                onClick={() => setFilters({ reviewerIds: undefined })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Etiketler */}
          {filters.tags?.map((tag) => {
            const tagInfo = tagOptions.find((t) => t.value === tag);
            return (
              <Badge key={tag} variant="secondary" className="gap-1">
                <div className={cn("w-2 h-2 rounded-full", tagInfo?.color)} />
                {tagInfo?.label}
                <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {/* Favoriler */}
          {filters.favoritesOnly && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Sadece Favoriler
              <button
                onClick={() => setFilters({ favoritesOnly: false })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

// Legacy export for backward compatibility
export default ReportingFilters;

