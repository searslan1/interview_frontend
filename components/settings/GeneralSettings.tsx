"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Genel Ayarlar</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button variant="outline">Fotoğraf Değiştir</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad</Label>
              <Input placeholder="Adınız" />
            </div>
            <div className="space-y-2">
              <Label>Soyad</Label>
              <Input placeholder="Soyadınız" />
            </div>
            <div className="space-y-2">
              <Label>Unvan</Label>
              <Input placeholder="Unvanınız" />
            </div>
            <div className="space-y-2">
              <Label>Şirket Adı</Label>
              <Input placeholder="Şirket Adı" />
            </div>
            <div className="space-y-2">
              <Label>Departman</Label>
              <Input placeholder="Departmanınız" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dil ve Bölge Seçenekleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Uygulama Dili</Label>
              <Select defaultValue="tr">
                <SelectTrigger>
                  <SelectValue placeholder="Dil seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Saat Dilimi</Label>
              <Select defaultValue="europe-istanbul">
                <SelectTrigger>
                  <SelectValue placeholder="Saat dilimi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-istanbul">İstanbul (GMT+3)</SelectItem>
                  <SelectItem value="europe-london">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Güvenlik & Giriş Tercihleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>İki Faktörlü Kimlik Doğrulama (2FA)</Label>
              <p className="text-sm text-muted-foreground">Hesabınızı daha güvenli hale getirin</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Aktif Cihazlar</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Chrome - Windows 10</p>
                  <p className="text-sm text-muted-foreground">Son giriş: 2 saat önce</p>
                  <p className="text-sm text-muted-foreground">IP: 192.168.1.1</p>
                </div>
                <Button variant="outline" size="sm">
                  Oturumu Kapat
                </Button>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Son Girişler ve IP Geçmişi</h4>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-lg">
                <p className="font-medium">23.05.2023 14:30</p>
                <p className="text-sm text-muted-foreground">IP: 192.168.1.2</p>
                <p className="text-sm text-muted-foreground">Konum: İstanbul, Türkiye</p>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <p className="font-medium">22.05.2023 09:15</p>
                <p className="text-sm text-muted-foreground">IP: 192.168.1.3</p>
                <p className="text-sm text-muted-foreground">Konum: Ankara, Türkiye</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

