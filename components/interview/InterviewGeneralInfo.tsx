"use client"


import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import { useState } from "react"
import Image from "next/image"


interface InterviewGeneralInfoProps {
  form: UseFormReturn<any>
}

export function InterviewGeneralInfo({ form }: InterviewGeneralInfoProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        form.setValue("logo", file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mülakat Genel Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Mülakat Başlığı</Label>
          <Input id="title" {...form.register("title")} />
        </div>
        <div>
          <Label htmlFor="type">Mülakat Türü</Label>
          <Select onValueChange={(value) => form.setValue("type", value)} defaultValue={form.getValues("type")}>
            <SelectTrigger>
              <SelectValue placeholder="Mülakat türü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Teknik</SelectItem>
              <SelectItem value="softSkills">Soft Skills</SelectItem>
              <SelectItem value="behavioral">Davranışsal</SelectItem>
              <SelectItem value="personality">Kişilik Envanteri</SelectItem>
              <SelectItem value="video">Video Mülakat</SelectItem>
              <SelectItem value="live">Canlı Mülakat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Mülakat Açıklaması</Label>
          <Textarea id="description" {...form.register("description")} />
        </div>
        <div className="flex space-x-4">
          <div>
            <Label htmlFor="startDate">Başlangıç Tarihi</Label>
            <DatePicker
              id="startDate"
              date={form.getValues("startDate")}
              onSelect={(date) => form.setValue("startDate", date as Date)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Bitiş Tarihi</Label>
            <DatePicker
              id="endDate"
              date={form.getValues("endDate")}
              onSelect={(date) => form.setValue("endDate", date as Date)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="hasPersonalityTest"
            checked={form.getValues("hasPersonalityTest")}
            onCheckedChange={(checked) => form.setValue("hasPersonalityTest", checked)}
          />
          <Label htmlFor="hasPersonalityTest">Kişilik Envanteri İçersin</Label>
        </div>
        <div>
          <Label htmlFor="logo">Mülakat Görseli / Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="w-full" />
            {logoPreview && (
              <div className="relative w-16 h-16">
                <Image src={logoPreview || "/placeholder.svg"} alt="Logo preview" layout="fill" objectFit="cover" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

