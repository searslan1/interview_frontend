"use client";

import { useState, useEffect } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
      type: "async-video",
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
        type: interviewToEdit.type || "async-video",
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
        type: "async-video",
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
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Mülakatı Düzenle" : "Yeni Mülakat Oluştur"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="questions">Sorular</TabsTrigger>
            <TabsTrigger value="evaluation">Değerlendirme</TabsTrigger>
            <TabsTrigger value="preview">Önizleme</TabsTrigger>
          </TabsList>
          
          <div className="flex-grow overflow-auto px-4 pb-4">
            <TabsContent value="general">
              {/* Form prop'u child component'e iletiliyor, bu doğru */}
              <InterviewGeneralInfo form={form} />
            </TabsContent>
            
            <TabsContent value="questions">
              <AIQuestionCreation form={form} />
            </TabsContent>
            
            <TabsContent value="evaluation">
              {/* Burası AI Ayarlarını içermeli */}
              <EvaluationSettings form={form} />
            </TabsContent>
            
            <TabsContent value="publish">
              <PublishSettings form={form} />
            </TabsContent>
            
            <TabsContent value="preview">
              <InterviewPreview form={form} />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-between space-x-2 mt-4 pt-4 border-t">
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