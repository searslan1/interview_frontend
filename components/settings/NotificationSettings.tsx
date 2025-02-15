"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Bildirim Ayarları</h2>

      <Card>
        <CardHeader>
          <CardTitle>E-posta & SMS Bildirimleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Yeni Başvurular</Label>
              <p className="text-sm text-muted-foreground">Yeni başvurular hakkında bildirim alın</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mülakat Değişiklikleri</Label>
              <p className="text-sm text-muted-foreground">Mülakat programında değişiklikler olduğunda bildirim alın</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uygulama İçi Bildirimler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* Uygulama içi bildirim ayarları */}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anlık Bildirim Tercihleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* Anlık bildirim tercihleri */}</CardContent>
      </Card>
    </div>
  )
}

