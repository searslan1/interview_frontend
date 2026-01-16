"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SubscriptionSettings() {
  return (
    <div className="space-y-8 pb-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Abonelik & Faturalandırma</h2>
        <p className="text-muted-foreground">Plan ve ödeme bilgilerinizi yönetin</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Mevcut Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-semibold text-lg">Pro Plan</p>
            <p className="text-sm text-muted-foreground">Aylık $99</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Kullanılabilir Özellikler:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
              <li>Sınırsız mülakat oluşturma</li>
              <li>AI destekli aday analizi</li>
              <li>Gelişmiş raporlama ve analitik</li>
              <li>7/24 öncelikli destek</li>
            </ul>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">Planı Yükselt</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ödeme Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>01.05.2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">Ödendi</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>01.04.2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">Ödendi</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>01.03.2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">Ödendi</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>01.02.2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-yellow-600 font-medium">Beklemede</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Güncelleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Mevcut Plan: Pro Plan</h4>
            <p className="text-sm text-muted-foreground">Aylık $99</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Diğer Planlar:</h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Enterprise Plan</span>
                <Button variant="outline">Yükselt</Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Basic Plan</span>
                <Button variant="outline">Düşür</Button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ek Hizmetler:</h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Özel AI Modeli Eğitimi</span>
                <Button variant="outline">Satın Al</Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Gelişmiş Entegrasyonlar</span>
                <Button variant="outline">Satın Al</Button>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fatura Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Şirket Adı</Label>
              <Input placeholder="Şirket Adı" />
            </div>
            <div className="space-y-2">
              <Label>Vergi Numarası</Label>
              <Input placeholder="Vergi Numarası" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Adres</Label>
              <Input placeholder="Adres" />
            </div>
            <div className="space-y-2">
              <Label>Şehir</Label>
              <Input placeholder="Şehir" />
            </div>
            <div className="space-y-2">
              <Label>Ülke</Label>
              <Input placeholder="Ülke" />
            </div>
            <div className="space-y-2">
              <Label>Posta Kodu</Label>
              <Input placeholder="Posta Kodu" />
            </div>
          </div>
          <Button className="w-full md:w-auto">Fatura Bilgilerini Güncelle</Button>
        </CardContent>
      </Card>
    </div>
  )
}

