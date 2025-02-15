"use client"


import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InterviewPreviewProps {
  form: UseFormReturn<any>
}

export function InterviewPreview({ form }: InterviewPreviewProps) {
  const formData = form.getValues()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mülakat Önizleme</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-2">{formData.title}</h2>
          <p className="text-gray-600 mb-4">{formData.description}</p>
          <div className="flex space-x-2 mb-4">
            <Badge>{formData.type}</Badge>
            {formData.hasPersonalityTest && <Badge variant="outline">Kişilik Envanteri İçerir</Badge>}
          </div>
          <p>
            Başvuru Tarihleri: {formData.startDate.toLocaleDateString()} - {formData.endDate.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sorular</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.questions.map((question: any, index: number) => (
            <div key={question.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">
                Soru {index + 1}: {question.text}
              </h3>
              <p>Tür: {question.type}</p>
              <p>Süre: {question.duration} saniye</p>
              <p>Beklenen Cevap: {question.expectedAnswer}</p>
              <p>Anahtar Kelimeler: {question.keywords.join(", ")}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Değerlendirme Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>AI Otomatik Puanlama: {formData.aiEvaluation.useAutomaticScoring ? "Evet" : "Hayır"}</li>
            <li>Jest & Mimik Analizi: {formData.aiEvaluation.gestureAnalysis ? "Evet" : "Hayır"}</li>
            <li>Konuşma Analizi: {formData.aiEvaluation.speechAnalysis ? "Evet" : "Hayır"}</li>
            <li>Göz Teması Analizi: {formData.aiEvaluation.eyeContactAnalysis ? "Evet" : "Hayır"}</li>
            <li>Ses Tonu Analizi: {formData.aiEvaluation.tonalAnalysis ? "Evet" : "Hayır"}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yayınlama ve Erişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Başvuru Linki: {formData.accessSettings.applicationLink || "Henüz oluşturulmadı"}</p>
          <p>Görüntüleme İzni Olanlar: {formData.accessSettings.visibleTo.join(", ") || "Belirtilmedi"}</p>
          <p>Bağlı Pozisyon: {formData.accessSettings.linkedPosition || "Belirtilmedi"}</p>
        </CardContent>
      </Card>
    </div>
  )
}

