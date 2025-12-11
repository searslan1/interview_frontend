"use client";

import { useState, useEffect } from "react"; // useEffect eklendi
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
import { Interview, InterviewStatus } from "@/types/interview"; // Interview tipi import edildi
import { useInterviewStore } from "@/store/interviewStore";
import { toast } from "@/components/ui/use-toast"; // Toast eklendi

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 📌 YENİ PROP: Düzenleme modunda mülakat verisi
  interviewToEdit: Interview | null; 
}

export function CreateInterviewDialog({ open, onOpenChange, interviewToEdit }: CreateInterviewDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { createInterview, updateInterview } = useInterviewStore(); // updateInterview eklendi

  // Düzenleme modunda olup olmadığımızı belirler
  const isEditing = !!interviewToEdit; 
  
  // ----------------------------------------------------
  // 📌 Varsayılan Değerler ve Form Yönetimi
  // ----------------------------------------------------
  const form = useForm<CreateInterviewDTO>({
    resolver: zodResolver(createInterviewSchema),
    // Formun verileri, interviewToEdit varsa onunla, yoksa varsayılanlarla başlar
    defaultValues: {
      title: "",
      // API'den gelen tarih ISO string olacağı için:
      expirationDate: new Date().toISOString(), 
      personalityTestId: undefined,
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
      // Not: Interview tipiniz ile CreateInterviewDTO tipiniz birebir örtüşmeli.
      form.reset({
        ...interviewToEdit,
        // Tarih alanını formatı koruyarak yüklüyoruz.
        expirationDate: interviewToEdit.expirationDate ? new Date(interviewToEdit.expirationDate).toISOString() : new Date().toISOString(),
        // Sorular ve diğer iç içe alanlar burada doğru şekilde eşleştirilmelidir.
      } as Partial<CreateInterviewDTO>);
      setActiveTab("general"); // Her zaman Genel Bilgiler sekmesinde başlat
    } else if (open && !interviewToEdit) {
      // Yeni oluşturma modunda modal açıldığında formu sıfırla
      form.reset({
        title: "",
        expirationDate: new Date().toISOString(),
        personalityTestId: undefined,
        status: InterviewStatus.DRAFT,
        stages: { personalityTest: false, questionnaire: true },
        questions: [],
      });
      setActiveTab("general");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, interviewToEdit]); // open veya interviewToEdit değiştiğinde tetiklenir


  /**
   * ✅ KAYDETME/GÜNCELLEME: Mülakatı kaydeder (DRAFT olarak oluşturur veya günceller).
   */
  const handleSaveDraft = async (values: CreateInterviewDTO) => {
    setLoading(true);
    try {
        const formattedData: CreateInterviewDTO = {
            ...values,
            // Düzenleme modunda bile, kart üzerindeki butondan kaydetme her zaman taslak durumunda olmalıdır.
            status: InterviewStatus.DRAFT, 
            // API'ye gönderilecek veriye sadece gerekli alanları dahil etmelisiniz.
        };

        let result;
        if (isEditing && interviewToEdit?._id) {
            // DÜZENLEME (PUT rotası)
            result = await updateInterview(interviewToEdit._id, formattedData);
            toast({ title: "Başarılı", description: "Mülakat taslağı güncellendi." });
        } else {
            // YENİ OLUŞTURMA (POST rotası)
            result = await createInterview(formattedData); 
            toast({ title: "Başarılı", description: "Yeni mülakat taslak olarak oluşturuldu." });
        }
        
        onOpenChange(false); 
        // Başarılıysa, listeyi yenileme aksiyonunu tetikleyin (useInterviewStore içinde olmalı).

    } catch (error) {
        console.error(isEditing ? "Güncelleme sırasında hata:" : "Oluşturma sırasında hata:", error);
        toast({ title: "Hata", description: isEditing ? "Güncelleme başarısız oldu." : "Oluşturma başarısız oldu.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };
 
  // ----------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          {/* Başlık, moda göre değişir */}
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Mülakatı Düzenle" : "Yeni Mülakat Oluştur"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          {/* Sekmeler */}
          <TabsList className="mb-4">
            <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="questions">Sorular</TabsTrigger>
            <TabsTrigger value="evaluation">Değerlendirme</TabsTrigger>
            <TabsTrigger value="preview">Önizleme</TabsTrigger>
          </TabsList>
          {/* İçerik Alanı */}
          <div className="flex-grow overflow-auto px-4 pb-4">
            <TabsContent value="general">
              <InterviewGeneralInfo form={form} />
            </TabsContent>
            {/* ... Diğer sekmeler (questions, evaluation, publish, preview) */}
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
        {/* Butonlar */}
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
                    toast({ title: "Hata", description: 'Lütfen zorunlu alanları doldurun.', variant: "destructive" });
                }
            )}
          >
              {/* Buton metni moda göre değişir */}
              {loading ? <LoadingSpinner /> : (isEditing ? "Değişiklikleri Kaydet" : "Taslak Olarak Kaydet")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}