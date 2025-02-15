"use client"


import { create } from "zustand"
import type { Appointment } from "@/types/appointment"

interface AppointmentStore {
  appointments: Appointment[]
  fetchAppointments: () => Promise<void>
  addAppointment: (appointment: Appointment) => void
  deleteAppointment: (id: string) => void
  sendReminder: (appointment: Appointment) => void
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  fetchAppointments: async () => {
    // Burada gerçek bir API çağrısı yapılacak
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        candidateName: "Ahmet Yılmaz",
        type: "interview",
        date: new Date(2023, 5, 15, 10, 0),
        duration: 60,
      },
      {
        id: "2",
        candidateName: "Ayşe Kaya",
        type: "followup",
        date: new Date(2023, 5, 16, 14, 30),
        duration: 30,
      },
    ]
    set({ appointments: mockAppointments })
  },
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id),
    })),
  sendReminder: (appointment) => {
    // Burada gerçek bir hatırlatma gönderme işlemi yapılacak
    console.log(`Hatırlatma gönderildi: ${appointment.candidateName} - ${appointment.date}`)
  },
}))

