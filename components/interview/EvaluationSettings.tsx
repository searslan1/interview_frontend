"use client";

import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BrainCircuit, Eye, Mic, Activity, MessageSquare, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EvaluationSettingsProps {
  form: UseFormReturn<any>;
}

export function EvaluationSettings({ form }: EvaluationSettingsProps) {
  
  // ✅ DÜZELTME: 'checked: boolean' yerine 'value: any' yapıldı.
  // Böylece hem boolean (true/false) hem de number (1/0) değerlerini kabul eder.
  const handleSwitchChange = (field: string, value: any) => {
    form.setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Yapay Zeka Değerlendirme Ayarları
          </CardTitle>
          <CardDescription>
            Adayların video yanıtlarını analiz ederken hangi AI modüllerinin kullanılacağını seçin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          
          {/* Otomatik Puanlama */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="aiAnalysisSettings.useAutomaticScoring" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                AI Otomatik Puanlama
              </Label>
              <span className="text-sm text-muted-foreground">
                Adayın yanıtlarını belirlenen kriterlere göre otomatik puanlar.
              </span>
            </div>
            <Switch
              id="aiAnalysisSettings.useAutomaticScoring"
              checked={form.watch("aiAnalysisSettings.useAutomaticScoring")}
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.useAutomaticScoring", checked)}
            />
          </div>

          <Separator />

          {/* Jest & Mimik Analizi */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-col space-y-1">
                <Label htmlFor="aiAnalysisSettings.gestureAnalysis" className="font-medium">
                  Jest & Mimik Analizi
                </Label>
                <span className="text-sm text-muted-foreground">
                  Adayın yüz ifadelerini ve duygu durumunu analiz eder (Heyecan, Stres, Güven).
                </span>
              </div>
            </div>
            <Switch
              id="aiAnalysisSettings.gestureAnalysis"
              checked={form.watch("aiAnalysisSettings.gestureAnalysis")}
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.gestureAnalysis", checked)}
            />
          </div>

          {/* Konuşma Analizi */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-col space-y-1">
                <Label htmlFor="aiAnalysisSettings.speechAnalysis" className="font-medium">
                  Konuşma İçeriği Analizi
                </Label>
                <span className="text-sm text-muted-foreground">
                  Kelime dağarcığı, akıcılık ve dolgu kelime (hmm, eee) kullanımını ölçer.
                </span>
              </div>
            </div>
            <Switch
              id="aiAnalysisSettings.speechAnalysis"
              checked={form.watch("aiAnalysisSettings.speechAnalysis")}
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.speechAnalysis", checked)}
            />
          </div>

          {/* Ses Tonu Analizi */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-col space-y-1">
                <Label htmlFor="aiAnalysisSettings.tonalAnalysis" className="font-medium">
                  Ses Tonu Analizi
                </Label>
                <span className="text-sm text-muted-foreground">
                  Sesin perdesini, tonlamasını ve enerji seviyesini analiz eder.
                </span>
              </div>
            </div>
            <Switch
              id="aiAnalysisSettings.tonalAnalysis"
              checked={form.watch("aiAnalysisSettings.tonalAnalysis")}
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.tonalAnalysis", checked)}
            />
          </div>

          {/* Göz Teması Analizi */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex flex-col space-y-1">
                <Label htmlFor="aiAnalysisSettings.eyeContactAnalysis" className="font-medium">
                  Göz Teması Analizi
                </Label>
                <span className="text-sm text-muted-foreground">
                  Adayın kameraya odaklanma süresini ve göz temasını takip eder.
                </span>
              </div>
            </div>
            <Switch
              id="aiAnalysisSettings.eyeContactAnalysis"
              checked={form.watch("aiAnalysisSettings.eyeContactAnalysis")}
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.eyeContactAnalysis", checked)}
            />
          </div>

          <Separator />

          {/* Anahtar Kelime Skoru */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="flex flex-col space-y-1">
                <Label htmlFor="aiAnalysisSettings.keywordMatchScore" className="font-medium">
                  Anahtar Kelime Eşleşmesi
                </Label>
                <span className="text-sm text-muted-foreground">
                  Adayın cevabında beklenen anahtar kelimelerin geçme sıklığını puanlar.
                </span>
              </div>
            </div>
            <Switch
              id="aiAnalysisSettings.keywordMatchScore"
              // DTO'da number olduğu için boolean'a çevirip kontrol ediyoruz
              checked={!!form.watch("aiAnalysisSettings.keywordMatchScore")} 
              // Switch true ise 1, false ise 0 gönderiyoruz. Artık hata vermeyecek.
              onCheckedChange={(checked) => handleSwitchChange("aiAnalysisSettings.keywordMatchScore", checked ? 1 : 0)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}