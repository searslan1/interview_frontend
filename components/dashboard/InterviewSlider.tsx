"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";
import type { Interview } from "@/types/interview";

export function InterviewSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { interviews, fetchAllInterviews } = useInterviewStore(); // ✅ API'den veri çekiyoruz

  useEffect(() => {
    fetchAllInterviews();
  }, [fetchAllInterviews]);

  const nextSlide = () => {
    if (startIndex < interviews.length - 3) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4 text-primary">Aktif Mülakatlar</h2>

      {/* Eğer hiç mülakat yoksa */}
      {interviews.length === 0 ? (
        <p className="text-center text-muted-foreground">Henüz aktif mülakat bulunmamaktadır.</p>
      ) : (
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${startIndex * 33.33}%)` }}
          >
            {interviews.map((interview: Interview) => (
              <Card key={interview.id} className="flex-shrink-0 w-1/3 mr-4 bg-white shadow-md">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">{interview.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      {interview.questions.length} Soru
                    </span>
                    <Badge>{interview.status === "active" ? "Aktif" : "Pasif"}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    AI Başarı Tahmini:{" "}
                    <span className="font-semibold text-primary">
                      {interview.questions.reduce((total, q) => total + q.duration, 0) || "N/A"} dakika
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Önceki ve sonraki butonlar */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white"
        onClick={prevSlide}
        disabled={startIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-primary hover:bg-primary hover:text-white"
        onClick={nextSlide}
        disabled={startIndex >= interviews.length - 3}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
