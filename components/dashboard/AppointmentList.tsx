"use client";

import { useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ✅ Appointment yerine PlainAppointment import edildi
import type { PlainAppointment } from "@/types/appointment"; 

interface AppointmentListProps {
  date: Date | undefined;
}

export function AppointmentList({ date }: AppointmentListProps) {
  // appointments listesi zaten PlainAppointment tipinde geliyor
  const { appointments, deleteAppointment, sendReminder } = useAppointmentStore();

  const formattedDate = date ? new Date(date).toDateString() : "";

  // appointments listesi (PlainAppointment[]) zaten uygun tipte olduğu için filtreleme düzgün çalışır
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date).toDateString();
    return appointmentDate === formattedDate;
  });

  const handleDelete = (id: string) => {
    // Backend entegrasyonu tamamlandığı için onay penceresini kullanmak yerine Toast/Dialog tercih edilmeliydi, 
    // ancak geçici window.confirm bırakıldı.
    if (window.confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) {
      deleteAppointment(id);
    }
  };

  // ✅ HATA ÇÖZÜMÜ 1 & 2: Parametre tipi PlainAppointment olarak düzeltildi.
  // ✅ sendReminder Store'da iki argüman (id, candidateName) beklediği için çağrı güncellendi.
  const handleSendReminder = (appointment: PlainAppointment) => {
    sendReminder(appointment.id, appointment.candidateName); // ✅ Store'un beklediği 2 argüman gönderildi
    // alert("Hatırlatma gönderildi!"); // Store içinde toast kullanıldığı için bu gereksizdir.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Randevular</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length === 0 ? (
          <p>Bu tarih için randevu bulunmamaktadır.</p>
        ) : (
          <ul className="space-y-2">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{appointment.candidateName}</p>
                  <p className="text-sm text-gray-500">
                    {/* new Date(appointment.date) string'i kabul ettiği için bu satır hala çalışır */}
                    {new Date(appointment.date).toLocaleTimeString()} - {appointment.type} 
                  </p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleSendReminder(appointment)}>
                    Hatırlat
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(appointment.id)}>
                    Sil
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
