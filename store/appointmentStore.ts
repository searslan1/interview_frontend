"use client";

import { create } from "zustand";
import type { Appointment } from "@/types/appointment";

// Plain obje olarak saklayacağımız randevu tipi:
type PlainAppointment = Omit<Appointment, "date"> & { date: string };

interface AppointmentStore {
  appointments: PlainAppointment[];
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  sendReminder: (appointment: PlainAppointment) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],

  // ✅ API'den randevuları çek
  fetchAppointments: async () => {
    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Randevular yüklenemedi.");

      const data: Appointment[] = await response.json();

      set({
        appointments: data.map((appointment) => ({
          ...appointment,
          // Date nesnesi yerine ISO string kullanıyoruz
          date: new Date(appointment.date).toISOString(),
        })),
      });
    } catch (error) {
      console.error("Randevular çekilirken hata oluştu:", error);
    }
  },

  // ✅ Yeni randevu ekle
  addAppointment: async (appointment) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });
      if (!response.ok) throw new Error("Randevu eklenemedi.");

      const newAppointment: Appointment = await response.json();

      set((state) => ({
        appointments: [
          ...state.appointments,
          {
            ...newAppointment,
            date: new Date(newAppointment.date).toISOString(),
          },
        ],
      }));
    } catch (error) {
      console.error("Randevu eklerken hata oluştu:", error);
    }
  },

  // ✅ Randevu sil
  deleteAppointment: async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Randevu silinemedi.");

      set((state) => ({
        appointments: state.appointments.filter((appointment) => appointment.id !== id),
      }));
    } catch (error) {
      console.error("Randevu silerken hata oluştu:", error);
    }
  },

  // ✅ Hatırlatma gönder
  sendReminder: async (appointment) => {
    try {
      const response = await fetch(`/api/appointments/${appointment.id}/reminder`, { method: "POST" });
      if (!response.ok) throw new Error("Hatırlatma gönderilemedi.");

      console.log(`Hatırlatma gönderildi: ${appointment.candidateName} - ${appointment.date}`);
    } catch (error) {
      console.error("Hatırlatma gönderirken hata oluştu:", error);
    }
  },
}));
