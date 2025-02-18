"use client";

import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EvaluationSettingsProps {
  form: UseFormReturn<any>;
}

export function EvaluationSettings({ form }: EvaluationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Değerlendirme Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.useAutomaticScoring"
            checked={form.watch("aiMetadata.useAutomaticScoring")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.useAutomaticScoring", checked)}
          />
          <Label htmlFor="aiMetadata.useAutomaticScoring">AI Otomatik Puanlama Kullan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.gestureAnalysis"
            checked={form.watch("aiMetadata.gestureAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.gestureAnalysis", checked)}
          />
          <Label htmlFor="aiMetadata.gestureAnalysis">Jest & Mimik Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.speechAnalysis"
            checked={form.watch("aiMetadata.speechAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.speechAnalysis", checked)}
          />
          <Label htmlFor="aiMetadata.speechAnalysis">Konuşma Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.eyeContactAnalysis"
            checked={form.watch("aiMetadata.eyeContactAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.eyeContactAnalysis", checked)}
          />
          <Label htmlFor="aiMetadata.eyeContactAnalysis">Göz Teması Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.tonalAnalysis"
            checked={form.watch("aiMetadata.tonalAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.tonalAnalysis", checked)}
          />
          <Label htmlFor="aiMetadata.tonalAnalysis">Ses Tonu Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="aiMetadata.keywordMatchScore"
            checked={!!form.watch("aiMetadata.keywordMatchScore")}
            onCheckedChange={(checked) => form.setValue("aiMetadata.keywordMatchScore", checked ? 1 : 0)}
          />
          <Label htmlFor="aiMetadata.keywordMatchScore">Anahtar Kelime Eşleşme Skoru</Label>
        </div>
      </CardContent>
    </Card>
  );
}
