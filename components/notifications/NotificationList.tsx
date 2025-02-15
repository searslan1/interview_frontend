"use client"

import { useNotificationStore, Notification, type NotificationType } from "@/store/notification-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, UserCheck, Info, Trash2, CheckCircle, X } from "lucide-react"
import Link from "next/link"

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotificationStore()

  const getIcon = (type: NotificationType) => {
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
        <CardTitle>Bildirimler</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Tümünü Okundu İşaretle
          </Button>
          <Button variant="outline" onClick={clearAllNotifications}>
            Tümünü Temizle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">Bildirim bulunmamaktadır.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${
                  notification.read ? "bg-muted" : "bg-accent"
                }`}
              >
                {getIcon(notification.type)}
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {notification.actionUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={notification.actionUrl}>Görüntüle</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

