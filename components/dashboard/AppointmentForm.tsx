"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppointmentStore } from "@/store/appointmentStore"

const appointmentSchema = z.object({
  candidateName: z.string().min(2, "Aday adı en az 2 karakter olmalıdır."),
  type: z.enum(["interview", "followup"]),
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Geçerli bir saat giriniz (HH:MM)"),
  duration: z.number().min(15, "Süre en az 15 dakika olmalıdır."),
  sendEmail: z.boolean().default(true),
  sendSMS: z.boolean().default(true),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  date: Date | undefined
  onSubmit: () => void
  onCancel: () => void
}

export function AppointmentForm({ date, onSubmit, onCancel }: AppointmentFormProps) {
  const { addAppointment } = useAppointmentStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: date,
      type: "interview",
      duration: 60,
    },
  })

  const onFormSubmit = (data: AppointmentFormData) => {
    const [hours, minutes] = data.time.split(":").map(Number)
    const appointmentDate = new Date(data.date)
    appointmentDate.setHours(hours, minutes)

    addAppointment({
      id: Date.now().toString(),
      candidateName: data.candidateName,
      type: data.type,
      date: appointmentDate,
      duration: data.duration,
      sendEmail: data.sendEmail,
      sendSMS: data.sendSMS,
    })
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Input {...register("candidateName")} placeholder="Aday Adı" />
        {errors.candidateName && <p className="text-red-500 text-sm">{errors.candidateName.message}</p>}
      </div>
      <div>
        <Select {...register("type")}>
          <SelectTrigger>
            <SelectValue placeholder="Randevu Türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="interview">Mülakat</SelectItem>
            <SelectItem value="followup">Takip Görüşmesi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input {...register("time")} type="time" />
        {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
      </div>
      <div>
        <Input {...register("duration", { valueAsNumber: true })} type="number" placeholder="Süre (dakika)" />
        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="sendEmail" {...register("sendEmail")} defaultChecked />
        <label
          htmlFor="sendEmail"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          E-posta Gönder
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="sendSMS" {...register("sendSMS")} defaultChecked />
        <label
          htmlFor="sendSMS"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          SMS Gönder
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">Kaydet</Button>
      </div>
    </form>
  )
}

