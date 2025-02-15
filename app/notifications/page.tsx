import { NotificationList } from "@/components/notifications/NotificationList"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bildirimler</h1>
      <NotificationList />
    </div>
  )
}

