"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export function CustomizationSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8 pb-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Kişiselleştirme</h2>
        <p className="text-muted-foreground">Arayüz temanızı ve görünüm tercihlerinizi özelleştirin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Görünümü</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* Dashboard görünüm ayarları */}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema Seçenekleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Tema seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Açık</SelectItem>
                <SelectItem value="dark">Koyu</SelectItem>
                <SelectItem value="system">Sistem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Özel Raporlar & Görselleştirme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* Özel rapor ve görselleştirme ayarları */}</CardContent>
      </Card>
    </div>
  )
}

