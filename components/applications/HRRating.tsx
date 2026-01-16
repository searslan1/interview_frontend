"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface HRRatingProps {
  currentRating?: number;
  onRatingChange: (rating: number) => Promise<void>;
  disabled?: boolean;
}

export function HRRating({ currentRating = 0, onRatingChange, disabled = false }: HRRatingProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleRatingClick = async (rating: number) => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      await onRatingChange(rating);
      toast({
        title: "Başarılı",
        description: `Başvuru ${rating} yıldız olarak derecelendirildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Derecelendirme güncellenirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Çok Zayıf";
      case 2:
        return "Zayıf";
      case 3:
        return "Orta";
      case 4:
        return "İyi";
      case 5:
        return "Mükemmel";
      default:
        return "Derecelendirilmemiş";
    }
  };

  const displayRating = hoveredRating || currentRating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">İK Değerlendirmesi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          {/* Yıldızlar */}
          <div className="flex gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                disabled={disabled || loading}
                variant="ghost"
                size="sm"
                className={cn(
                  "transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed p-1",
                  disabled && "opacity-50"
                )}
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-gray-300"
                  )}
                />
              </Button>
            ))}
          </div>

          {/* Rating Label */}
          <div className="text-center">
            <p className="text-sm font-medium">
              {getRatingLabel(displayRating)}
            </p>
            {currentRating > 0 && (
              <p className="text-xs text-muted-foreground">
                {currentRating} / 5 yıldız
              </p>
            )}
          </div>

          {/* Temizle Butonu */}
          {currentRating > 0 && !disabled && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRatingClick(0)}
              disabled={loading}
              className="text-xs"
            >
              Derecelendirmeyi Temizle
            </Button>
          )}
        </div>

        {/* Açıklama */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p className="font-medium">Derecelendirme Rehberi:</p>
          <ul className="space-y-1 pl-4 list-disc">
            <li>⭐ - Aday çok zayıf, kesinlikle uygun değil</li>
            <li>⭐⭐ - Aday zayıf, bazı eksiklikleri var</li>
            <li>⭐⭐⭐ - Aday orta seviye, değerlendirilebilir</li>
            <li>⭐⭐⭐⭐ - Aday iyi, pozisyona uygun</li>
            <li>⭐⭐⭐⭐⭐ - Aday mükemmel, kesinlikle işe alınmalı</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
