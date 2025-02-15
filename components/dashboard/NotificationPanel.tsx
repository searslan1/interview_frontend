"use client"


import { useNotificationStore } from "@/store/notification-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, UserCheck, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NotificationPanel() {
  const { notifications, markAsRead } = useNotificationStore()

  const getIcon = (type: string) => {
    switch (type) {
      case "new_application":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "interview_reminder":
        return <Calendar className="h-5 w-5 text-green-500" />
      case "ai_recommendation":
        return <UserCheck className="h-5 w-5 text-purple-500" />
      case "system_update":
        return <Info className="h-5 w-5 text-orange-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Son Bildirimler</CardTitle>
        <Button variant="ghost" asChild>
          <Link href="/notifications">Tümünü Gör</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4">
              {getIcon(notification.type)}
              <div className="space-y-1 flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                  Okundu
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

