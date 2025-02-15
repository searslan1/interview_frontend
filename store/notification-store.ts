"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type NotificationType = "new_application" | "interview_reminder" | "ai_recommendation" | "system_update"

export interface Notification {
  id: number
  type: NotificationType
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read" | "time">) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  clearAllNotifications: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 1,
          type: "new_application",
          message: "Yeni başvuru: Frontend Developer pozisyonu için Ali Yılmaz",
          time: "5 dakika önce",
          read: false,
          actionUrl: "/applications/123",
        },
        {
          id: 2,
          type: "interview_reminder",
          message: "Hatırlatma: Yarın saat 14:00'de UX Designer mülakatı var",
          time: "1 saat önce",
          read: false,
          actionUrl: "/interviews/456",
        },
        {
          id: 3,
          type: "ai_recommendation",
          message: "AI Önerisi: Data Scientist pozisyonu için Ayşe Kara uygun bir aday olabilir",
          time: "3 saat önce",
          read: false,
          actionUrl: "/candidates/789",
        },
      ],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { id: Date.now(), read: false, time: new Date().toLocaleString(), ...notification },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        })),
      clearAllNotifications: () => set({ notifications: [] }),
      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "notification-storage",
    },
  ),
)

