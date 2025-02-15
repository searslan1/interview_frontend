"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function AISettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">AI & Otomasyon Ayarları</h2>

      <Card>
        <CardHeader>
          <CardTitle>AI Destekli Öneriler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>AI Öneri Yoğunluğu</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>Otomatik Mülakat Sorusu Oluşturma</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Otomatik Mülakat Değerlendirmesi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>AI Değerlendirme Kriterleri</Label>
            {/* AI değerlendirme kriterleri ayarları */}
          </div>
          <div className="space-y-2">
            <Label>AI Rapor Detay Seviyesi</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Sohbet Robotu Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* AI sohbet robotu ayarları */}</CardContent>
      </Card>
    </div>
  )
}

