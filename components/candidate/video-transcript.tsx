"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface VideoTranscriptProps {
  /** AI tarafından çıkarılan transkripsiyon metni. */
  transcript: string;
}

/**
 * AI tarafından analiz edilen video yanıtının transkripsiyonunu (metin dökümünü) gösterir.
 */
export function VideoTranscript({ transcript }: VideoTranscriptProps) {
  return (
    <Card className="mt-4 h-[350px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">AI Transkripsiyonu (Metin Dökümü)</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        {transcript ? (
          <ScrollArea className="h-[250px] w-full border rounded-md p-4 bg-gray-50">
            {/* Metin düzenlemesini engellemek için Textarea kullanabilir veya sadece p etiketi ile gösterebiliriz. 
                Textarea kullanmak, kopyalama kolaylığı sağlar. */}
            <Textarea 
                value={transcript} 
                readOnly 
                className="h-full w-full border-none resize-none p-0 text-gray-700 leading-relaxed"
            />
          </ScrollArea>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-center text-gray-500 border rounded-md">
            Video yanıtı için henüz bir transkripsiyon bulunmamaktadır.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Düzeltme Notu: candidate-detail-review.tsx dosyasındaki geçici VideoTranscript tanımını kaldırın
// ve bu bileşeni import edip kullanın.