  "use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Users, CreditCard, Bell, Paintbrush, Brain, Shield } from "lucide-react"

import { GeneralSettings } from "@/components/settings/ProfileSetting"
import { AccountSettings } from "@/components/settings/AccountSettings"
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings"
import { NotificationSettings } from "@/components/settings/NotificationSettings"
import { CustomizationSettings } from "@/components/settings/CustomizationSettings"
import { AISettings } from "@/components/settings/AISettings"
import { PrivacySettings } from "@/components/settings/PrivacySettings"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 h-[90vh]">
        <Tabs defaultValue="general" className="h-full flex">
          {/* Sol Sidebar */}
          <TabsList className="h-full flex flex-col items-stretch justify-start space-y-1 rounded-none border-r bg-muted/50 p-2 w-52">
            <TabsTrigger value="general" className="justify-start gap-2">
              <Settings className="h-4 w-4" />
              Genel Ayarlar
            </TabsTrigger>
            <TabsTrigger value="account" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              Hesap & Yetkilendirme
            </TabsTrigger>
            <TabsTrigger value="subscription" className="justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Abonelik & Faturalandırma
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start gap-2">
              <Bell className="h-4 w-4" />
              Bildirim Ayarları
            </TabsTrigger>
            <TabsTrigger value="customization" className="justify-start gap-2">
              <Paintbrush className="h-4 w-4" />
              Kişiselleştirme
            </TabsTrigger>
            <TabsTrigger value="ai" className="justify-start gap-2">
              <Brain className="h-4 w-4" />
              AI & Otomasyon
            </TabsTrigger>
            <TabsTrigger value="privacy" className="justify-start gap-2">
              <Shield className="h-4 w-4" />
              Veri & Gizlilik
            </TabsTrigger>
          </TabsList>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TabsContent value="general">
                  <GeneralSettings />
                </TabsContent>
                <TabsContent value="account">
                  <AccountSettings />
                </TabsContent>
                <TabsContent value="subscription">
                  <SubscriptionSettings />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
                <TabsContent value="customization">
                  <CustomizationSettings />
                </TabsContent>
                <TabsContent value="ai">
                  <AISettings />
                </TabsContent>
                <TabsContent value="privacy">
                  <PrivacySettings />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

