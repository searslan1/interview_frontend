"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Info, Plus, Video, ChevronRightIcon } from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";
import type { Interview } from "@/types/interview";
import Link from "next/link";

export function InterviewSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { interviews, fetchInterviews } = useInterviewStore();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Maksimum 5 mülakat göster
  const displayedInterviews = interviews.slice(0, 5);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aktif</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Tamamlandı</Badge>;
      case "draft":
        return <Badge variant="secondary">Taslak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            {interviews.length > 0 && (
              <Link 
                href="/interviews" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Tümünü Gör ({interviews.length})
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Boş durum - aksiyon içeren mesaj */}
          {interviews.length === 0 ? (
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
                  {displayedInterviews.map((interview: Interview) => (
                    <Link
                      key={interview._id}
                      href={`/interviews/${interview._id}`}
                      className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] group"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {interview.title}
                            </h3>
                            {getStatusBadge(interview.status)}
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>{interview.questions.length} Soru</p>
                            <p>
                              Toplam Süre:{" "}
                              <span className="font-medium">
                                {interview.questions.reduce((total, q) => total + q.duration, 0)} dk
                              </span>
                            </p>
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
