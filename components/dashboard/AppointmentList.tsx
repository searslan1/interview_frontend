"use client";

import { useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appointment";

interface AppointmentListProps {
  date: Date | undefined;
}

export function AppointmentList({ date }: AppointmentListProps) {
  const { appointments, deleteAppointment, sendReminder } = useAppointmentStore();

  // ✅ Date formatlama hatalarını engellemek için kesin `Date` nesnesine çeviriyoruz
  const formattedDate = date ? new Date(date).toDateString() : "";

  // ✅ Tarih karşılaştırmasını güvenli hale getirdik
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date).toDateString();
    return appointmentDate === formattedDate;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) {
      deleteAppointment(id);
    }
  };

  const handleSendReminder = (appointment: Appointment) => {
    sendReminder(appointment);
    alert("Hatırlatma gönderildi!");
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
                    {new Date(appointment.date).toLocaleTimeString()} - {appointment.type} {/* ✅ Tarih dönüşüm hatası çözüldü */}
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
