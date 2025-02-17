"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useProfileStore } from "@/store/profileStore";
import { Loader2 } from "lucide-react";

export function GeneralSettings() {
  const { user, getProfile, updateProfile, isLoading, uploadProfilePicture } = useProfileStore();
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "", /*language: "tr", timezone: "europe-istanbul", twoFactorEnabled: false */});

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
        bio: user.bio || "",
        //language: user.language || "tr",
       // timezone: user.timezone || "europe-istanbul",
        //twoFactorEnabled: user.twoFactorEnabled || false,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await uploadProfilePicture(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfile(formData);
  };

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
              <AvatarImage src={user?.profilePicture || "/placeholder-avatar.jpg"} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <input type="file" onChange={handleFileUpload} className="mt-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Biyografi</Label>
              <Input name="bio" value={formData.bio} onChange={handleChange} />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Profili Güncelle"}
          </Button>
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
              <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
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
              <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
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
            <Switch checked={formData.twoFactorEnabled} onCheckedChange={(value) => setFormData({ ...formData, twoFactorEnabled: value })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
