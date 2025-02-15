"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: any[]) => void
  interviewType: string
}

export function AIQuestionGenerator({ onQuestionsGenerated, interviewType }: AIQuestionGeneratorProps) {
  const [questionCount, setQuestionCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)

  const mockQuestions = [
    {
      text: "Bu pozisyon için neden başvuruyorsunuz?",
      expectedAnswer:
        "Adayın motivasyonunu net bir şekilde ifade etmesi, şirket veya pozisyon hakkında bilgi sahibi olması, kariyer hedefleriyle pozisyonun uyumunu göstermesi",
      keywords: ["motivasyon", "kariyer", "hedef", "şirket adı", "gelişim", "uyum"],
      criticalExpressions: [
        "Şirketinizin misyonu ile kendi hedeflerimin uyumlu olduğunu düşünüyorum",
        "Bu pozisyonun bana sunacağı gelişim fırsatları",
        "Uzun vadeli kariyer planlarımla örtüşüyor",
      ],
    },
    {
      text: "Takım çalışması hakkında ne düşünüyorsunuz?",
      expectedAnswer:
        "Adayın işbirliğine açık olduğunu göstermesi, takım içindeki rolünü anlaması, farklı fikirlere saygı duyduğunu belirtmesi",
      keywords: ["işbirliği", "iletişim", "uyum", "sorumluluk", "paylaşım"],
      criticalExpressions: [
        "Farklı bakış açılarının projeye katkı sağladığına inanıyorum",
        "Takım içinde açık iletişimin önemini vurgularım",
        "Ortak hedef için birlikte çalışmak",
      ],
    },
    {
      text: "Stresli durumlarla nasıl başa çıkarsınız?",
      expectedAnswer:
        "Adayın stres yönetimi tekniklerini açıklaması, öz-farkındalık göstermesi, problem çözme yaklaşımını anlatması",
      keywords: ["önceliklendirme", "zaman yönetimi", "problem çözme", "esneklik"],
      criticalExpressions: [
        "Stres altında sakin kalmak için derin nefes alma tekniklerini kullanırım",
        "Karmaşık durumları küçük, yönetilebilir parçalara bölerim",
        "Gerektiğinde yardım istemekten çekinmem",
      ],
    },
  ]

  const generateQuestions = async () => {
    setIsGenerating(true)
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Select random questions from the mock questions array
      const selectedQuestions = []
      for (let i = 0; i < questionCount; i++) {
        const randomIndex = Math.floor(Math.random() * mockQuestions.length)
        selectedQuestions.push(mockQuestions[randomIndex])
      }

      onQuestionsGenerated(selectedQuestions)
    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number.parseInt(e.target.value))}
        min={1}
        max={20}
        className="w-full"
      />
      <Button onClick={generateQuestions} disabled={isGenerating} className="w-full">
        {isGenerating ? "Sorular Oluşturuluyor..." : "AI ile Soru Üret"}
      </Button>
    </div>
  )
}

