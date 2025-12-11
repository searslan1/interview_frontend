// src/components/interview/ExtendDurationDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";
import { Interview } from "@/types/interview";
import { useInterviewStore } from "@/store/interviewStore";
import { extendDurationSchema, ExtendDurationDTO } from "@/types/extendDurationDTO"; // Yeni DTO

interface ExtendDurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
}

export function ExtendDurationDialog({ open, onOpenChange, interview }: ExtendDurationDialogProps) {
  const [loading, setLoading] = useState(false);
  // Store içindeki link güncelleme metodunu kullanacağız (PATCH /:id/link)
  const { updateInterviewLink } = useInterviewStore(); 

  const form = useForm<ExtendDurationDTO>({
    resolver: zodResolver(extendDurationSchema),
    defaultValues: {
      expirationDate: interview?.expirationDate ? new Date(interview.expirationDate).toISOString() : new Date().toISOString(),
    },
  });

  // Mülakat değiştiğinde formu resetleme
  useEffect(() => {
    if (interview) {
      form.reset({
        expirationDate: interview.expirationDate ? new Date(interview.expirationDate).toISOString() : new Date().toISOString(),
      });
    }
  }, [interview, form]);
  
  // Modal kapandığında formu sıfırla
  useEffect(() => {
      if (!open) {
          form.reset();
      }
  }, [open, form]);

  /**
   * Süreyi uzatma ve yeni linki oluşturma işlemini yönetir (PATCH /:id/link)
   */
  const onSubmit = async (values: ExtendDurationDTO) => {
    if (!interview?._id) {
      toast({ title: "Hata", description: "Mülakat kimliği bulunamadı.", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    // Backend'e sadece yeni bitiş tarihini gönderiyoruz
    const updateData = {
        expirationDate: values.expirationDate, // ISO string formatında
    };

    try {
      // Backend'deki PATCH /:id/link rotası bu veriyi alıp hem süreyi uzatmalı hem de yeni linki oluşturmalı.
      // updateInterviewLink metodu, linki döndürmelidir.
      const newLink = await updateInterviewLink(interview._id, updateData);
      
      toast({ 
        title: "Başarılı", 
        description: `Mülakat süresi uzatıldı. Yeni link: ${newLink}`, 
        // Burada kullanıcıya linki kopyalama aksiyonu da sunulabilir.
      });
      onOpenChange(false);
      
    } catch (error) {
      console.error("Süre uzatma hatası:", error);
      toast({ title: "Hata", description: "Süre uzatma işlemi başarısız oldu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          {/* Mülakat başlığını modala taşıyarak İK'ya bağlam sunuyoruz */}
          <DialogTitle className="text-xl font-bold">
            Süre Uzatma: {interview?.title || "Mülakat"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="py-4">
              
              <p className="text-sm text-muted-foreground mb-4">
                Mevcut linkin süresini uzatmak için yeni bir bitiş tarihi seçin. Link güncellenecek ve yeni bir URL oluşturulacaktır.
              </p>
              
              {/* Tarih Seçici Alanı */}
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yeni Bitiş Tarihi</FormLabel>
                    <FormControl>
                      <DatePicker
                        id="expirationDate"
                        // Field değeri string (ISO) olduğu için Date objesine çevrilir
                        date={field.value ? new Date(field.value) : undefined} 
                        // Seçilen Date objesi tekrar ISO string'e çevrilerek forma yazılır
                        onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            
            {/* Butonlar */}
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                    ? <LoadingSpinner /> 
                    : "Süreyi Uzat ve Linki Yenile"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}