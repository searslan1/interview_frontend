"use client"

  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  import { Application, GeneralAIAnalysis } from "@/types/application"; // ✅ Application ve IGeneralAIAnalysis import edildi

  interface AIGeneralAnalysisProps {
    application: Application; // ✅ Prop adı 'candidate' yerine 'application' olarak değiştirildi
  }

  export function AIGeneralAnalysis({ application }: AIGeneralAnalysisProps) {
    // 🚀 GERÇEK VERİ BAĞLANTISI: application objesinden generalAIAnalysis çekiliyor
    const generalAnalysis = application.generalAIAnalysis || {}; 
    const personalityResults = application.personalityTestResults || {};

    // Not: personalityType ve currentMood gibi alanlar Backend IGeneralAIAnalysis'te yok. 
    // Backend'in bu tür metin alanlarını recommendation veya strengths içinde dönmesi gerekebilir.
    // Şimdilik Backend yapımızdaki mevcut skorları kullanıyoruz.

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI Genel Analizi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          
          {/* OVERALL AI SCORE (Genel Puan) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold">Genel AI Skoru</h3>
            {/* overallScore kullanılıyor */}
            <Progress value={generalAnalysis.overallScore || 0} className="w-full h-2" />
            <p className="text-center text-sm font-bold mt-1">{generalAnalysis.overallScore ?? "N/A"}%</p>
          </div>
          
          {/* TEKNİK YETENEK SKORU */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold">Teknik Yetenek Skoru</h3>
            {/* technicalSkillsScore kullanılıyor */}
            <Progress value={generalAnalysis.technicalSkillsScore || 0} className="w-full h-2" />
            <p className="text-center text-sm font-bold mt-1">{generalAnalysis.technicalSkillsScore ?? "N/A"}%</p>
          </div>
          
          {/* İLETİŞİM SKORU */}
          <div>
            <h3 className="font-semibold">İletişim Skoru</h3>
            {/* communicationScore kullanılıyor */}
            <p className="text-sm font-bold">{generalAnalysis.communicationScore ?? "N/A"}%</p>
          </div>

          {/* PROBLEM ÇÖZME SKORU */}
          <div>
            <h3 className="font-semibold">Problem Çözme Skoru</h3>
            {/* problemSolvingScore kullanılıyor */}
            <p className="text-sm font-bold">{generalAnalysis.problemSolvingScore ?? "N/A"}%</p>
          </div>
          
          {/* KİŞİLİK UYUM SKORU */}
          <div className="col-span-2">
            <h3 className="font-semibold">Kişilik Uyum Skoru (AI)</h3>
            {/* personalityMatchScore kullanılıyor */}
            <Progress value={generalAnalysis.personalityMatchScore || 0} className="w-full h-2" />
            <p className="text-center text-sm font-bold mt-1">{generalAnalysis.personalityMatchScore ?? "N/A"}%</p>
          </div>
        
        </CardContent>
      </Card>
    )
  }