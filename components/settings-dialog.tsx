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
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] max-h-[95vh] p-0 gap-0 overflow-hidden flex flex-col">
        <Tabs defaultValue="general" className="h-full flex flex-col md:flex-row overflow-hidden">
          {/* Sol Sidebar - Sabit */}
          <TabsList className="flex flex-row md:flex-col items-stretch justify-start space-x-1 md:space-x-0 md:space-y-1 rounded-none border-b md:border-b-0 md:border-r bg-muted/50 p-2 w-full md:w-60 flex-shrink-0 overflow-x-auto md:overflow-x-visible">
            <TabsTrigger value="general" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Genel Ayarlar</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Hesap & Yetkilendirme</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Abonelik & Faturalandırma</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Bildirim Ayarları</span>
            </TabsTrigger>
            <TabsTrigger value="customization" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">Kişiselleştirme</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI & Otomasyon</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="justify-start gap-2 whitespace-nowrap px-3 py-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Veri & Gizlilik</span>
            </TabsTrigger>
          </TabsList>

          {/* Sağ İçerik Alanı - Scroll Edilebilir */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-6 space-y-0">
                <TabsContent value="general" className="m-0 focus-visible:outline-none">
                  <GeneralSettings />
                </TabsContent>
                <TabsContent value="subscription" className="m-0 focus-visible:outline-none">
                  <SubscriptionSettings />
                </TabsContent>
                <TabsContent value="account" className="m-0 focus-visible:outline-none">
                  <AccountSettings />
                </TabsContent>
                <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
                  <NotificationSettings />
                </TabsContent>
                <TabsContent value="customization" className="m-0 focus-visible:outline-none">
                  <CustomizationSettings />
                </TabsContent>
                <TabsContent value="ai" className="m-0 focus-visible:outline-none">
                  <AISettings />
                </TabsContent>
                <TabsContent value="privacy" className="m-0 focus-visible:outline-none">
                  <PrivacySettings />
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

