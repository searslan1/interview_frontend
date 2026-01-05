"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Info, FileText, Plus, ChevronRightIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useApplicationStore } from "@/store/applicationStore";
import type { Application } from "@/types/application";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function ApplicationSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { applications, fetchApplications, loading } = useApplicationStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Maksimum 5 başvuru göster
  const displayedApplications = applications.slice(0, 5);
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

  // Analiz durumu badge'i - "AI Skoru" yerine daha aksiyonel dil
  const getAnalysisBadge = (application: Application) => {
    const hasAnalysis = application.generalAIAnalysis?.overallScore != null;
    
    if (hasAnalysis) {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Analiz Hazır
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Analiz Devam Ediyor
      </Badge>
    );
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
            {applications.length > 0 && (
              <Link 
                href="/applications" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Tümünü Gör ({applications.length})
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : applications.length === 0 ? (
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
                  {displayedApplications.map((application: Application) => (
                    <Link
                      key={application._id}
                      href={`/applications/${application._id}`}
                      className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] group"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={`https://i.pravatar.cc/150?u=${application._id}`}
                                alt={application.candidate?.name || "Aday"}
                              />
                              <AvatarFallback className="text-xs">
                                {application.candidate?.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                {application.candidate?.name || "Bilinmiyor"}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {application.candidate?.email || "E-posta mevcut değil"}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            {getAnalysisBadge(application)}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true, locale: tr })}
                            </span>
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
