import type { Notification } from "@/types/notification"

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    userId: "admin-001",
    type: "new_application",
    message: "Yeni başvuru: Ahmet Yılmaz, Senior Frontend Developer pozisyonu için başvurdu.",
    createdAt: new Date("2023-07-02T10:30:00"),
    read: false,
    actionUrl: "/applications/app-001",
  },
  {
    id: "notif-002",
    userId: "hr-123",
    type: "interview_reminder",
    message: "Hatırlatma: Yarın saat 14:00'de Ayşe Kaya ile Product Manager mülakatı var.",
    createdAt: new Date("2023-08-01T09:00:00"),
    read: true,
    actionUrl: "/interviews/int-002",
  },
  {
    id: "notif-003",
    userId: "admin-002",
    type: "ai_recommendation",
    message: "AI Önerisi: Ahmet Yılmaz, Senior Frontend Developer pozisyonu için güçlü bir aday.",
    createdAt: new Date("2023-07-03T15:45:00"),
    read: false,
    actionUrl: "/candidates/cand-001",
  },
]

