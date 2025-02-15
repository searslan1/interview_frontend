"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Hesap & Yetkilendirme</h2>

      <Card>
        <CardHeader>
          <CardTitle>Yetkilendirilmiş Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Yeni Kullanıcı Ekle</Label>
            <div className="flex space-x-2">
              <Input placeholder="E-posta adresi" className="flex-grow" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Yetki seviyesi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Mülakat Yöneticisi</SelectItem>
                  <SelectItem value="viewer">Görüntüleyici</SelectItem>
                </SelectContent>
              </Select>
              <Button>Ekle</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mevcut Yetkilendirilmiş Kullanıcılar</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Yetki Seviyesi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Kaldır
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>Mülakat Yöneticisi</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Kaldır
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Erişim Kontrolleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mülakat Erişim İzinleri</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Mülakat</TableHead>
                  <TableHead>Erişim Seviyesi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>Yazılım Geliştirici Mülakatı</TableCell>
                  <TableCell>Tam Erişim</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>Ürün Yöneticisi Mülakatı</TableCell>
                  <TableCell>Sadece Görüntüleme</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giriş ve Aktivite Logları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>john@example.com</TableCell>
                <TableCell>Yeni mülakat oluşturuldu</TableCell>
                <TableCell>23.05.2023 14:30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>jane@example.com</TableCell>
                <TableCell>Aday değerlendirildi</TableCell>
                <TableCell>22.05.2023 09:15</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

