"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, XCircle, Brain, MessageSquare, Code2, UserCircle } from "lucide-react"
import { Application } from "@/types/application"

interface AIDetailedReportsProps {
  application: Application
  activeQuestionId: string
}

export function AIDetailedReports({ application, activeQuestionId }: AIDetailedReportsProps) {
  
  // 1. Aktif soruya ait analiz sonucunu bul
  const currentAnalysis = useMemo(() => {
    if (!application.aiAnalysisResults || !Array.isArray(application.aiAnalysisResults)) return null;

    // Backend populate ettiği için objeler içinde arama yapıyoruz
    // Not: Type definition'da string[] | any[] demiştik, burada any olarak işlem görüyor
    return application.aiAnalysisResults.find((analysis: any) => 
        // analysis objesi varsa ve questionId eşleşiyorsa
        analysis && analysis.questionId === activeQuestionId
    );
  }, [application.aiAnalysisResults, activeQuestionId]);

  // Analiz yoksa veya bekleniyorsa
  if (!currentAnalysis) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
          <AlertCircle className="h-10 w-10 mb-4 opacity-50" />
          <p>Bu soru için henüz detaylı yapay zeka analizi oluşturulmadı.</p>
          <p className="text-sm mt-2">Video yüklendikten kısa bir süre sonra analiz burada görünecektir.</p>
        </CardContent>
      </Card>
    );
  }

  // Skorları güvenli bir şekilde al (Yoksa 0)
  const scores = {
    communication: currentAnalysis.communicationScore || 0,
    technical: currentAnalysis.technicalSkillsScore || 0,
    problemSolving: currentAnalysis.problemSolvingScore || 0,
    personality: currentAnalysis.personalityMatchScore || 0,
    overall: currentAnalysis.overallScore || 0
  };

  return (
    <div className="space-y-6">
      
      {/* 1. İletişim ve Sunum Analizi */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">İletişim Yetkinliği</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>İletişim Puanı</span>
              <span className="font-medium">{scores.communication}/100</span>
            </div>
            <Progress value={scores.communication} className="h-2" />
          </div>
          {/* İleride Backend'den 'voiceTone', 'clarity' gibi alt kırılımlar gelirse buraya eklenir */}
        </CardContent>
      </Card>

      {/* 2. Teknik ve Problem Çözme */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Teknik & Analitik</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Teknik Bilgi</span>
              <span className="font-medium">{scores.technical}/100</span>
            </div>
            <Progress value={scores.technical} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Problem Çözme</span>
              <span className="font-medium">{scores.problemSolving}/100</span>
            </div>
            <Progress value={scores.problemSolving} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Kişilik Uyumu */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">Kültürel & Kişilik Uyumu</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
           <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Uyum Skoru</span>
              <span className="font-medium">{scores.personality}/100</span>
            </div>
            <Progress value={scores.personality} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Güçlü Yönler ve Gelişim Alanları (Yan Yana) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Güçlü Yönler */}
        <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Güçlü Yönler</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentAnalysis.strengths && currentAnalysis.strengths.length > 0 ? (
                currentAnalysis.strengths.map((strength: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">Veri bulunamadı.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Gelişim Alanları */}
        <Card className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-base">Gelişim Alanları</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentAnalysis.improvementAreas && currentAnalysis.improvementAreas.length > 0 ? (
                currentAnalysis.improvementAreas.map((area: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                     <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">Veri bulunamadı.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 5. AI Önerisi (Recommendation) */}
      {currentAnalysis.recommendation && (
          <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                  <CardTitle className="text-base text-primary">Yapay Zeka Görüşü</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm leading-relaxed">{currentAnalysis.recommendation}</p>
              </CardContent>
          </Card>
      )}

    </div>
  )
}