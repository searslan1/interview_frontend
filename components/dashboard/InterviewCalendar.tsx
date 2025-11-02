"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/dashboard/AppointmentForm";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { useAppointmentStore } from "@/store/appointmentStore";

export function InterviewCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { appointments, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getAppointmentsForDate = (day: Date | undefined) => {
    if (!day) return [];
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date); // ✅ Kesin Date objesine çeviriyoruz
      return appointmentDate.toDateString() === day.toDateString();
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsAddDialogOpen(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Mülakat ve Randevu Takvimi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="w-2/3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => {
                  if (!date) return null; // ✅ Eğer date yoksa render etme
                  const dayAppointments = getAppointmentsForDate(date);
                  return (
                    <div className="relative w-full h-full">
                      <div>{new Date(date).getDate()}</div> {/* ✅ Kesin `Date` nesnesine çeviriyoruz */}
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-0 right-0 flex space-x-1">
                          {dayAppointments.slice(0, 3).map((appointment, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                appointment.type === "interview" ? "bg-blue-500" : "bg-green-500"
                              }`}
                            />
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500">+{dayAppointments.length - 3}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
          <div className="w-1/3">
            <AppointmentList date={date} />
          </div>
        </div>
      </CardContent>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Randevu Ekle</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            date={date}
            onSubmit={() => setIsAddDialogOpen(false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
