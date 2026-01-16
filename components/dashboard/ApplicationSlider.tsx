"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Info, FileText, Plus, ChevronRightIcon, CheckCircle2, Loader2, Star } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import type { RecentApplication } from "@/types/dashboard";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { recentApplications, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Maksimum 5 başvuru göster
  const displayedApplications = recentApplications.slice(0, 5);
  const visibleCardCount = Math.min(3, displayedApplications.length);

  const nextSlide = () => {
    if (startIndex < displayedApplications.length - visibleCardCount) {
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
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Son Başvurular</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    En son gelen aday başvuruları. AI analizi tamamlanan başvuruları öncelikli değerlendirebilirsiniz.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {recentApplications.length > 0 && (
              <Link 
                href="/applications" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Tümünü Gör ({recentApplications.length})
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
                  <Skeleton className="h-36 w-full" />
                </div>
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            /* Boş durum - aksiyon içeren mesaj */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">Henüz başvuru bulunmuyor</p>
              <p className="text-xs text-muted-foreground mb-4">
                Mülakat oluşturarak aday başvurularını toplamaya başlayın.
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
                  style={{ transform: `translateX(-${startIndex * (100 / visibleCardCount)}%)` }}
                >
                  {displayedApplications.map((application: RecentApplication) => (
                    <Link
                      key={application._id}
                      href={`/applications/${application._id}`}
                      className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] group"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow relative">
                        <CardContent className="p-4">
                          {/* Favorite indicator */}
                          {application.isFavorite && (
                            <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-400 fill-yellow-400" />
                          )}
                          
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={`https://i.pravatar.cc/150?u=${application._id}`}
                                alt={application.candidateName}
                              />
                              <AvatarFallback className="text-xs">
                                {application.candidateName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                {application.candidateName}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {application.candidateEmail}
                              </p>
                            </div>
                          </div>
                          
                          {/* Mülakat başlığı */}
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {application.interviewTitle}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <StatusBadge status={application.status as any} size="sm" />
                            <div className="flex flex-col items-end gap-1">
                              {application.aiScore != null && (
                                <span className="text-xs font-medium text-primary">
                                  %{Math.round(application.aiScore)}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {application.createdAt && !isNaN(new Date(application.createdAt).getTime()) 
                                  ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true, locale: tr })
                                  : "Bilinmeyen tarih"
                                }
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {displayedApplications.length > visibleCardCount && (
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
                    disabled={startIndex >= displayedApplications.length - visibleCardCount}
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
