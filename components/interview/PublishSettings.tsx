"use client"


import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PublishSettingsProps {
  form: UseFormReturn<any>
}

export function PublishSettings({ form }: PublishSettingsProps) {
  const generateUniqueLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 15)
    return `https://yourdomain.com/interview/${uniqueId}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yayınlama ve Erişim Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="applicationLink">Özel Başvuru Linki</Label>
          <div className="flex space-x-2">
            <Input id="applicationLink" readOnly value={form.watch("accessSettings.applicationLink") || ""} />
            <Button onClick={() => form.setValue("accessSettings.applicationLink", generateUniqueLink())}>
              Link Oluştur
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="visibleTo">Başvuruları Kimler Görebilir?</Label>
          <Input
            id="visibleTo"
            placeholder="E-posta adreslerini virgülle ayırarak girin"
            value={form.watch("accessSettings.visibleTo").join(", ")}
            onChange={(e) =>
              form.setValue(
                "accessSettings.visibleTo",
                e.target.value.split(",").map((email) => email.trim()),
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="linkedPosition">Bağlı Olduğu Pozisyon</Label>
          <Input
            id="linkedPosition"
            placeholder="Pozisyon adını girin"
            {...form.register("accessSettings.linkedPosition")}
          />
        </div>
      </CardContent>
    </Card>
  )
}

