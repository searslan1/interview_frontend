"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

interface AIPrePublishCheckProps {
  form: UseFormReturn<any>
}

export function AIPrePublishCheck({ form }: AIPrePublishCheckProps) {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runAICheck = async () => {
    setIsLoading(true)
    // Simulate AI check
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAiSuggestions([
      "Mülakat süresi biraz kısa olabilir. Toplam süreyi artırmayı düşünebilirsiniz.",
      "Teknik beceriler için daha fazla soru ekleyebilirsiniz.",
      "Kişilik envanteri testi eklemeyi düşünebilirsiniz.",
    ])
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Değerlendirme Kriterleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Teknik Beceriler (%)</Label>
            <Slider
              value={[form.watch("aiEvaluationCriteria.technicalSkills")]}
              onValueChange={(value) => form.setValue("aiEvaluationCriteria.technicalSkills", value[0])}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label>İletişim Becerileri (%)</Label>
            <Slider
              value={[form.watch("aiEvaluationCriteria.communicationSkills")]}
              onValueChange={(value) => form.setValue("aiEvaluationCriteria.communicationSkills", value[0])}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label>Problem Çözme (%)</Label>
            <Slider
              value={[form.watch("aiEvaluationCriteria.problemSolving")]}
              onValueChange={(value) => form.setValue("aiEvaluationCriteria.problemSolving", value[0])}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label>Kültürel Uyum (%)</Label>
            <Slider
              value={[form.watch("aiEvaluationCriteria.culturalFit")]}
              onValueChange={(value) => form.setValue("aiEvaluationCriteria.culturalFit", value[0])}
              max={100}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>AI Ön Yayın Kontrolü</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runAICheck} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kontrol Ediliyor...
              </>
            ) : (
              "AI Kontrolünü Başlat"
            )}
          </Button>
          {aiSuggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">AI Önerileri:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

