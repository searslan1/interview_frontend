"use client";

import { usePublicApplicationStore } from "@/store/usePublicApplicationStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  FileText, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  CalendarDays,
  ShieldCheck 
} from "lucide-react";

export function LandingView() {
  const { interview, setStep } = usePublicApplicationStore();

  if (!interview) return null;

  // Toplam tahmini süre (dakika)
  const totalDurationMinutes = Math.ceil(
    interview.questions.reduce((acc, q) => acc + (q.duration || 2), 0) + 5 // +5 dk profil doldurma payı
  );

  return (
    <div className="flex flex-col items-center justify-center fade-in animate-in zoom-in-95 duration-500">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
           <Video className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {interview.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {interview.description || "Bu video mülakat süreci, yeteneklerinizi ve deneyimlerinizi daha iyi anlamamız için tasarlanmıştır."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl">
        {/* Sol Taraf: Bilgi Kartı */}
        <Card className="md:col-span-2 shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Süreç Hakkında
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* İstatistikler */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center text-center border">
                <Clock className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{totalDurationMinutes} dk</span>
                <span className="text-xs text-muted-foreground">Tahmini Süre</span>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center text-center border">
                <Video className="h-6 w-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{interview.questions.length}</span>
                <span className="text-xs text-muted-foreground">Video Soru</span>
              </div>
            </div>

            <Separator />

            {/* Adımlar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Başvuru Adımları
              </h3>
              <div className="space-y-4">
                <StepItem 
                  icon={<FileText className="h-4 w-4" />}
                  title="Profil Bilgileri"
                  desc="Eğitim ve deneyim bilgilerinizi girin."
                />
                <StepItem 
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Sistem Kontrolü"
                  desc="Kamera ve mikrofonunuzu test edin."
                />
                <StepItem 
                  icon={<Video className="h-4 w-4" />}
                  title="Video Mülakat"
                  desc="Soruları süre sınırları içinde yanıtlayın."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sağ Taraf: Önemli Notlar & Action */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Önemli Hatırlatmalar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 text-muted-foreground">
              <p>• Sessiz ve iyi aydınlatılmış bir ortamda olduğunuzdan emin olun.</p>
              <p>• İnternet bağlantınızın stabil olduğunu kontrol edin.</p>
              <p>• Tarayıcınızın kamera ve mikrofon izinlerini vermeniz gerekecektir.</p>
              {interview.expirationDate && (
                <div className="pt-2 flex items-center gap-2 text-destructive font-medium">
                  <CalendarDays className="h-4 w-4" />
                  <span>Son Başvuru: {new Date(interview.expirationDate).toLocaleDateString("tr-TR")}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-11 text-base shadow-md hover:shadow-lg transition-all" 
                onClick={() => setStep("auth")}
              >
                Başvuruyu Başlat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>KVKK kapsamında verileriniz korunmaktadır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}