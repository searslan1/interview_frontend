"use client";

import { create } from "zustand";
import type { Appointment, PlainAppointment, CreateAppointmentPayload } from "@/types/appointment";
// ✅ Yeni servis import edildi
import { appointmentService } from "@/services/appointmentService";
import { toast } from "@/components/ui/use-toast"; // ✅ Hata bildirimi için toast import edildi


interface AppointmentStore {
  appointments: PlainAppointment[];
  fetchAppointments: () => Promise<void>;
  // Payload tipi, servisin beklediği tipe (ISO string) göre güncellendi
  addAppointment: (payload: CreateAppointmentPayload) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  sendReminder: (id: string, candidateName: string) => Promise<void>; // Sadece ID gönderimi daha mantıklı
}

/**
 * Helper: API'den gelen Appointment objesini (Date nesneleri içerir), 
 * Zustand'da saklanacak PlainAppointment objesine (ISO string'ler içerir) dönüştürür.
 */
const toPlainAppointment = (appointment: Appointment): PlainAppointment => ({
    ...appointment,
    date: appointment.date.toISOString(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
});


export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],

  // --- 1. Randevuları Çekme ---
  fetchAppointments: async () => {
    try {
      // ✅ Servis çağrısı kullanıldı
      const data = await appointmentService.fetchAppointments();
      
      if (data && data.length > 0) {
        set({
            // ✅ Verileri ISO string'e dönüştürerek state'e kaydet
            appointments: data.map(toPlainAppointment)
        });
      }

    } catch (error) {
      console.error("Randevular çekilirken hata oluştu:", error);
      toast({
          title: "Hata",
          description: "Randevu listesi yüklenemedi.",
          variant: "destructive",
      });
    }
  },

  // --- 2. Yeni Randevu Ekleme ---
  addAppointment: async (payload) => {
    try {
      // ✅ Servis çağrısı kullanıldı
      const newAppointment = await appointmentService.createAppointment(payload);

      if (newAppointment) {
          set((state) => ({
            appointments: [
              ...state.appointments,
              // ✅ Yeni randevuyu ISO string'e dönüştürerek ekle
              toPlainAppointment(newAppointment),
            ],
          }));
          
          toast({
              title: "Başarılı",
              description: `${newAppointment.candidateName} için randevu oluşturuldu.`,
          });
      }
    } catch (error) {
      console.error("Randevu eklerken hata oluştu:", error);
      throw error; // Formdan gelen hatayı yakalaması için tekrar fırlatılabilir
    }
  },

  // --- 3. Randevu Silme ---
  deleteAppointment: async (id) => {
    try {
      // ✅ Servis çağrısı kullanıldı
      await appointmentService.deleteAppointment(id);

      set((state) => ({
        // ✅ State'ten sil
        appointments: state.appointments.filter((appointment) => appointment.id !== id),
      }));
      
      toast({
          title: "Silindi",
          description: "Randevu başarıyla silindi.",
          variant: "destructive",
      });
    } catch (error) {
      console.error("Randevu silerken hata oluştu:", error);
      throw error;
    }
  },

  // --- 4. Hatırlatma Gönderme ---
  sendReminder: async (id, candidateName) => {
    try {
      // ✅ Servis çağrısı kullanıldı (sadece ID gönderiliyor)
      await appointmentService.sendReminder(id);

      // ✅ UI/UX İyileştirmesi: Başarılı bildirim
      toast({
          title: "Hatırlatma Gönderildi",
          description: `${candidateName} adlı adaya bildirim gönderildi.`,
      });
      
    } catch (error) {
      console.error("Hatırlatma gönderirken hata oluştu:", error);
      toast({
          title: "Hata",
          description: "Hatırlatma gönderilemedi.",
          variant: "destructive",
      });
    }
  },
}));
