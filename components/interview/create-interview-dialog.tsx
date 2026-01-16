"use client";

import { useState, useEffect } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, Brain, Eye } from "lucide-react";
import { InterviewGeneralInfo } from "./InterviewGeneralInfo";
import { AIQuestionCreation } from "./AIQuestionCreation";
import { EvaluationSettings } from "./EvaluationSettings";
import { PublishSettings } from "./PublishSettings";
import { InterviewPreview } from "./InterviewPreview";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createInterviewSchema, CreateInterviewDTO } from "@/types/createInterviewDTO";
import { Interview, InterviewStatus } from "@/types/interview"; 
import { useInterviewStore } from "@/store/interviewStore";
import { toast } from "@/components/ui/use-toast"; 

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewToEdit: Interview | null; 
}

export function CreateInterviewDialog({ open, onOpenChange, interviewToEdit }: CreateInterviewDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { createInterview, updateInterview } = useInterviewStore(); 

  const isEditing = !!interviewToEdit; 
  
  // ----------------------------------------------------
  // 📌 Varsayılan Değerler ve Form Yönetimi
  // ----------------------------------------------------
  const form = useForm<CreateInterviewDTO>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      title: "",
      description: "",
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      position: {
        title: "",
        department: "",
        description: "",
        competencyWeights: {
          technical: 40,
          communication: 30,
          problem_solving: 30,
        },
      },
      // ✅ EKLENDİ: AI Analiz Ayarları Varsayılan Değerleri
      aiAnalysisSettings: {
        useAutomaticScoring: true,
        gestureAnalysis: true,
        speechAnalysis: true,
        eyeContactAnalysis: false,
        tonalAnalysis: false,
        keywordMatchScore: 0
      },
      personalityTestId: "",
      status: InterviewStatus.DRAFT, 
      stages: {
        personalityTest: false,
        questionnaire: true,
      },
      questions: [],
    },
  });

  /**
   * 📌 EFFECT: Düzenleme verisi geldiğinde formu resetle
   */
  useEffect(() => {
    if (open && interviewToEdit) {
      // API'den gelen verileri doğrudan forma yüklüyoruz.
      form.reset({
        title: interviewToEdit.title || "",
        description: interviewToEdit.description || "",
        expirationDate: interviewToEdit.expirationDate 
          ? new Date(interviewToEdit.expirationDate).toISOString() 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        position: {
          title: interviewToEdit.position?.title || "",
          department: interviewToEdit.position?.department || "",
          description: interviewToEdit.position?.description || "",
          competencyWeights: {
            technical: interviewToEdit.position?.competencyWeights?.technical ?? 40,
            communication: interviewToEdit.position?.competencyWeights?.communication ?? 30,
            problem_solving: interviewToEdit.position?.competencyWeights?.problem_solving ?? 30,
          },
        },
        // ✅ EKLENDİ: AI Ayarlarını Geri Yükleme (Edit Mode)
        aiAnalysisSettings: {
            useAutomaticScoring: interviewToEdit.aiAnalysisSettings?.useAutomaticScoring ?? true,
            gestureAnalysis: interviewToEdit.aiAnalysisSettings?.gestureAnalysis ?? true,
            speechAnalysis: interviewToEdit.aiAnalysisSettings?.speechAnalysis ?? true,
            eyeContactAnalysis: interviewToEdit.aiAnalysisSettings?.eyeContactAnalysis ?? false,
            tonalAnalysis: interviewToEdit.aiAnalysisSettings?.tonalAnalysis ?? false,
            keywordMatchScore: interviewToEdit.aiAnalysisSettings?.keywordMatchScore ?? 0,
        },
        personalityTestId: interviewToEdit.personalityTestId || "",
        status: interviewToEdit.status || InterviewStatus.DRAFT,
        stages: interviewToEdit.stages || { personalityTest: false, questionnaire: true },
        questions: interviewToEdit.questions || [],
      });
      setActiveTab("general");
    } else if (open && !interviewToEdit) {
      // Yeni oluşturma modunda modal açıldığında formu sıfırla
      form.reset({
        title: "",
        description: "",
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        position: {
          title: "",
          department: "",
          description: "",
          competencyWeights: {
            technical: 40,
            communication: 30,
            problem_solving: 30,
          },
        },
        // ✅ EKLENDİ: Resetlerken de AI ayarlarını sıfırla
        aiAnalysisSettings: {
            useAutomaticScoring: true,
            gestureAnalysis: true,
            speechAnalysis: true,
            eyeContactAnalysis: false,
            tonalAnalysis: false,
            keywordMatchScore: 0
        },
        personalityTestId: "",
        status: InterviewStatus.DRAFT,
        stages: { personalityTest: false, questionnaire: true },
        questions: [],
      });
      setActiveTab("general");
    }
  }, [open, interviewToEdit, form]); // form dependency eklendi


  /**
   * ✅ KAYDETME/GÜNCELLEME
   */
  const handleSaveDraft = async (values: CreateInterviewDTO) => {
    setLoading(true);
    try {
        const formattedData: CreateInterviewDTO = {
            ...values,
            status: InterviewStatus.DRAFT, 
        };

        if (isEditing && interviewToEdit?._id) {
            // Update fonksiyonu Partial<UpdateInterviewDTO> bekler, 
            // ancak Zod infer type'ı CreateInterviewDTO ile neredeyse aynıdır.
            // Type casting gerekebilir.
            await updateInterview(interviewToEdit._id, formattedData as any);
            toast({ title: "Başarılı", description: "Mülakat taslağı güncellendi." });
        } else {
            await createInterview(formattedData); 
            toast({ title: "Başarılı", description: "Yeni mülakat taslak olarak oluşturuldu." });
        }
        
        onOpenChange(false); 

    } catch (error) {
        console.error("İşlem hatası:", error);
        toast({ title: "Hata", description: "İşlem başarısız oldu.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] p-0 h-[90vh] max-h-[900px] flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Mülakatı Düzenle" : "Yeni Mülakat Oluştur"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Sol Sidebar */}
          <TabsList className="flex flex-row md:flex-col items-stretch justify-start space-x-1 md:space-x-0 md:space-y-1 rounded-none border-b md:border-b-0 md:border-r bg-muted/50 p-2 w-full md:w-64 shrink-0 overflow-x-auto md:overflow-x-visible">
            <TabsTrigger value="general" className="justify-start gap-2 whitespace-nowrap">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Genel Bilgiler</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="justify-start gap-2 whitespace-nowrap">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Sorular</span>
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="justify-start gap-2 whitespace-nowrap">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI & Değerlendirme</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="justify-start gap-2 whitespace-nowrap">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Önizleme</span>
            </TabsTrigger>
          </TabsList>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 h-full">
              <div className="p-4 md:p-6 space-y-6 min-h-full pb-8">
                <TabsContent value="general" className="mt-0 min-h-0">
                  <InterviewGeneralInfo form={form} />
                </TabsContent>
                
                <TabsContent value="questions" className="mt-0 min-h-0">
                  <AIQuestionCreation form={form} />
                </TabsContent>
                
                <TabsContent value="evaluation" className="mt-0 min-h-0">
                  <EvaluationSettings form={form} />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0 min-h-0">
                  <InterviewPreview form={form} />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
        
        <div className="flex justify-between items-center space-x-2 p-6 pt-4 border-t bg-muted/30 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <div className="space-x-2">
           <Button
            disabled={loading}
            onClick={form.handleSubmit(
                handleSaveDraft,
                (errors) => {
                    console.error("ZOD Validasyon Hataları:", errors);
                    // Hatalı alanı bulup kullanıcıya göstermek için
                    const errorFields = Object.keys(errors).join(", ");
                    toast({ 
                        title: "Validasyon Hatası", 
                        description: `Lütfen şu alanları kontrol edin: ${errorFields}`, 
                        variant: "destructive" 
                    });
                }
            )}
          >
              {loading ? <LoadingSpinner /> : (isEditing ? "Değişiklikleri Kaydet" : "Taslak Olarak Kaydet")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}