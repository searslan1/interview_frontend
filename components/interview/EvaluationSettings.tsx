"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface EvaluationSettingsProps {
  form: UseFormReturn<any>
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
            id="useAutomaticScoring"
            checked={form.watch("aiEvaluation.useAutomaticScoring")}
            onCheckedChange={(checked) => form.setValue("aiEvaluation.useAutomaticScoring", checked)}
          />
          <Label htmlFor="useAutomaticScoring">AI Otomatik Puanlama Kullan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="gestureAnalysis"
            checked={form.watch("aiEvaluation.gestureAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiEvaluation.gestureAnalysis", checked)}
          />
          <Label htmlFor="gestureAnalysis">Jest & Mimik Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="speechAnalysis"
            checked={form.watch("aiEvaluation.speechAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiEvaluation.speechAnalysis", checked)}
          />
          <Label htmlFor="speechAnalysis">Konuşma Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="eyeContactAnalysis"
            checked={form.watch("aiEvaluation.eyeContactAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiEvaluation.eyeContactAnalysis", checked)}
          />
          <Label htmlFor="eyeContactAnalysis">Göz Teması Analizi</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="tonalAnalysis"
            checked={form.watch("aiEvaluation.tonalAnalysis")}
            onCheckedChange={(checked) => form.setValue("aiEvaluation.tonalAnalysis", checked)}
          />
          <Label htmlFor="tonalAnalysis">Ses Tonu Analizi</Label>
        </div>
      </CardContent>
    </Card>
  )
}

