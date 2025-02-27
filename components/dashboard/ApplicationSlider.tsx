"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useApplicationStore from "@/store/applicationStore";
import type { Application } from "@/types/application";

export function ApplicationSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { applications, fetchApplications, loading } = useApplicationStore(); // ✅ Güncellendi

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const visibleCardCount = 3; // Slider'da görünen kart sayısı

  const nextSlide = () => {
    if (startIndex < applications.length - visibleCardCount) {
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
      <h2 className="text-2xl font-bold mb-4 text-primary">Son Başvurular</h2>

      {loading ? (
        <p className="text-center text-muted-foreground">Yükleniyor...</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-muted-foreground">Henüz başvuru bulunmamaktadır.</p>
      ) : (
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${startIndex * (100 / visibleCardCount)}%)` }}
          >
            {applications.map((application: Application) => (
              <Card key={application._id} className="flex-shrink-0 w-1/3 mr-4 bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${application._id}`}
                        alt={application.candidate?.name || "Aday"}
                      />
                      <AvatarFallback>
                        {application.candidate?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {application.candidate?.name || "Bilinmiyor"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {application.candidate?.email || "E-posta mevcut değil"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      AI Skoru: {application.generalAIAnalysis?.overallScore ?? "N/A"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
        disabled={startIndex >= applications.length - visibleCardCount}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
