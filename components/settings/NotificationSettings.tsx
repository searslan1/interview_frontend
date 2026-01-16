"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <div className="space-y-8 pb-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bildirim Ayarları</h2>
        <p className="text-muted-foreground">Bildirim tercihlerinizi ve bildirim kanalını yönetin</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">E-posta & SMS Bildirimleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Yeni Başvurular</Label>
              <p className="text-sm text-muted-foreground">Yeni başvurular hakkında bildirim alın</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Mülakat Değişiklikleri</Label>
              <p className="text-sm text-muted-foreground">Mülakat programında değişiklikler olduğunda bildirim alın</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">AI Analiz Tamamlandı</Label>
              <p className="text-sm text-muted-foreground">AI analizi tamamlandığında bildirim alın</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Uygulama İçi Bildirimler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Anlık Bildirimler</Label>
              <p className="text-sm text-muted-foreground">Tarayıcı üzerinden anlık bildirim alın</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Ses Bildirimleri</Label>
              <p className="text-sm text-muted-foreground">Bildirimler için ses efekti çalın</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Anlık Bildirim Tercihleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Haftalık Özet</Label>
              <p className="text-sm text-muted-foreground">Haftalık aktivite özeti e-postası alın</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label className="text-base font-medium">Pazarlama E-postaları</Label>
              <p className="text-sm text-muted-foreground">Yeni özellik ve güncellemeler hakkında e-posta alın</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

