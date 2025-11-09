"use client";

import { useState } from "react";
import { useInterviewStore } from "@/store/interviewStore";
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
import { InterviewStatus } from "@/types/interview";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInterviewDialog({ open, onOpenChange }: CreateInterviewDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { createInterview } = useInterviewStore();

  const form = useForm<CreateInterviewDTO>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      title: "",
      expirationDate: new Date().toISOString(), // ✅ Backend için uygun ISO format
      personalityTestId: undefined,
      status: InterviewStatus.DRAFT, // Varsayılan olarak "Taslak"
      stages: {
        personalityTest: false,
        questionnaire: true,
      },
      questions: [],
    },
  });

  /**
   * ✅ Mülakat oluşturma işlemini API'ye gönderen fonksiyon
   */
  const handleCreateInterview = async (status: InterviewStatus) => {
    setLoading(true);
    try {
      const data = form.getValues();

      const formattedData: CreateInterviewDTO = {
        ...data,
        status, // ✅ Gelen parametreye göre taslak veya yayın durumu belirleniyor
        expirationDate: new Date(data.expirationDate).toISOString(),
        questions: data.questions.map(({ _id, aiMetadata, ...rest }) => ({
          ...rest,
          aiMetadata: {
            complexityLevel: aiMetadata.complexityLevel,
            requiredSkills: aiMetadata.requiredSkills,
          },
        })),
      };

      await createInterview(formattedData);
      setTimeout(() => onOpenChange(false), 100); // ✅ Modal kapatılıyor
    } catch (error) {
      console.error("Interview creation error:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmitValidated = async (values: CreateInterviewDTO, status: InterviewStatus) => {
    setLoading(true);
    try {
        const formattedData: CreateInterviewDTO = {
            ...values,
            status, 
            // ... diğer formatlama işlemleri
        };
        await createInterview(formattedData);
        setTimeout(() => onOpenChange(false), 100); 
    } catch (error) {
        console.error("Interview creation error:", error);
        // Hata mesajını UI'a gösterin (örn: Toast)
    } finally {
        setLoading(false);
    }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Mülakat Oluştur</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="questions">Sorular</TabsTrigger>
            <TabsTrigger value="evaluation">Değerlendirme</TabsTrigger>
            <TabsTrigger value="publish">Yayınlama</TabsTrigger>
            <TabsTrigger value="preview">Önizleme</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-auto px-4 pb-4">
            <TabsContent value="general">
              <InterviewGeneralInfo form={form} />
            </TabsContent>
            <TabsContent value="questions">
              <AIQuestionCreation form={form} />
            </TabsContent>
            <TabsContent value="evaluation">
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
            {/* ✅ Taslak olarak kaydetme butonu */}
           <Button
    variant="outline"
    disabled={loading}
    // Sadece Taslak Kaydı: Validasyon gerekmeyen alanları geç
    onClick={() => onSubmitValidated(form.getValues(), InterviewStatus.DRAFT)} 
>
              {loading ? <LoadingSpinner /> : "Taslak Olarak Kaydet"}
            </Button>
            {/* ✅ Yayınla butonu */}
            <Button
              disabled={loading}
onClick={form.handleSubmit((values) => onSubmitValidated(values, InterviewStatus.PUBLISHED),
  (errors) => {
                      // Hata varsa konsola yazdır ve kullanıcıya bildir
                      console.error("ZOD VALIDATION FAILED:", errors);
                      const firstError = Object.values(errors)[0]?.message || 'Lütfen tüm zorunlu alanları doldurun.';
                      alert(`Yayınlama hatası: ${firstError}`); 
                      // NOT: Console'daki 'ZOD VALIDATION FAILED' çıktısı, size hangi alanın boş kaldığını gösterecektir.
                  }
              )}   
         >
              {loading ? <LoadingSpinner /> : "Yayınla"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
