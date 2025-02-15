"use client"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Veri & Gizlilik</h2>

      <Card>
        <CardHeader>
          <CardTitle>GDPR / KVKK Uyumluluğu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Kişisel Verilerin İşlenmesi</Label>
              <p className="text-sm text-muted-foreground">Kişisel verilerin nasıl işlendiğini kontrol edin</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veri Silme / Anonimleştirme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Otomatik Veri Silme Süresi</Label>
            {/* Otomatik veri silme ayarları */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hesap Silme İşlemi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Hesabınızı ve tüm verilerinizi kalıcı olarak silmek için aşağıdaki butona tıklayın.
          </p>
          <Button variant="destructive">Hesabı Sil</Button>
        </CardContent>
      </Card>
    </div>
  )
}

