"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Info, Plus, Video, ChevronRightIcon, Users, CheckCircle2, Clock } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import type { ActiveInterview } from "@/types/dashboard";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function InterviewSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { activeInterviews, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Maksimum 5 mülakat göster
  const displayedInterviews = activeInterviews.slice(0, 5);
  const visibleCount = Math.min(3, displayedInterviews.length);

  const nextSlide = () => {
    if (startIndex < displayedInterviews.length - visibleCount) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <TooltipProvider>
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Aktif Mülakatlar</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    Şu anda aktif olan ve aday başvurularını kabul eden mülakatlarınız.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {activeInterviews.length > 0 && (
              <Link 
                href="/interviews" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Tümünü Gör ({activeInterviews.length})
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          ) : activeInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">Henüz aktif mülakat yok</p>
              <p className="text-xs text-muted-foreground mb-4">
                İlk mülakatınızı oluşturarak aday değerlendirmeye başlayın.
              </p>
              <Button asChild size="sm">
                <Link href="/interviews">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Mülakat Oluştur
                </Link>
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={sliderRef}>
                <div
                  className="flex transition-transform duration-300 ease-in-out gap-4"
                  style={{ transform: `translateX(-${startIndex * (100 / visibleCount)}%)` }}
                >
                  {displayedInterviews.map((interview: ActiveInterview) => (
                    <Link
                      key={interview.id}
                      href={`/interviews/${interview.id}`}
                      className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] group"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {interview.title}
                            </h3>
                            <StatusBadge status={interview.status} size="sm" />
                          </div>
                          
                          {/* Başvuru Durumu */}
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>Toplam</span>
                              </div>
                              <span className="font-medium text-foreground">{interview.totalApplications}</span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Bekleyen</span>
                              </div>
                              <span className="font-medium text-amber-600">{interview.pendingApplications}</span>
                            </div>
                            <div className="flex items-center justify-between text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Tamamlanan</span>
                              </div>
                              <span className="font-medium text-green-600">{interview.completedApplications}</span>
                            </div>
                            
                            {/* AI Skoru varsa göster */}
                            {interview.averageAIScore != null && (
                              <div className="pt-2 border-t">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Ort. AI Skoru</span>
                                  <span className="font-medium text-primary">%{Math.round(interview.averageAIScore)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {displayedInterviews.length > visibleCount && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 -left-3 transform -translate-y-1/2 h-8 w-8 rounded-full shadow-md"
                    onClick={prevSlide}
                    disabled={startIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-8 w-8 rounded-full shadow-md"
                    onClick={nextSlide}
                    disabled={startIndex >= displayedInterviews.length - visibleCount}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
