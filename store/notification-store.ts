"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/types/notification";

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read" | "readAt">
  ) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/notifications");
          if (!res.ok) {
            throw new Error("Failed to fetch notifications");
          }
          const data: Notification[] = await res.json();
          // Tarihleri ISO string formatına çeviriyoruz
          const transformedData = data.map((notification) => ({
            ...notification,
            createdAt: notification.createdAt
              ? new Date(notification.createdAt).toISOString()
              : notification.createdAt,
            readAt: notification.readAt
              ? new Date(notification.readAt).toISOString()
              : notification.readAt,
          }));
          set({ notifications: transformedData, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch notifications", isLoading: false });
        }
      },

      addNotification: async (notificationData) => {
        // Geçici notification oluştururken ISO formatında tarih kullanıyoruz
        const tempNotification: Notification = {
          id: Date.now().toString(),
          userId: "currentUser", // Gerçek kullanıcı ID'si ile değiştirilmelidir.
          type: notificationData.type,
          message: notificationData.message,
          createdAt: new Date().toISOString(),
          read: false,
          actionUrl: notificationData.actionUrl,
        };

        set((state) => ({
          notifications: [tempNotification, ...state.notifications],
        }));

        try {
          const res = await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationData),
          });
          if (!res.ok) {
            throw new Error("Failed to add notification");
          }
          const savedNotification: Notification = await res.json();
          const transformedSavedNotification = {
            ...savedNotification,
            createdAt: savedNotification.createdAt
              ? new Date(savedNotification.createdAt).toISOString()
              : savedNotification.createdAt,
            readAt: savedNotification.readAt
              ? new Date(savedNotification.readAt).toISOString()
              : savedNotification.readAt,
          };

          // Geçici notification'ı gerçek olanla değiştiriyoruz.
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === tempNotification.id ? transformedSavedNotification : n
            ),
          }));
        } catch (error) {
          set({ error: "Failed to add notification" });
        }
      },

      markAsRead: async (id: string) => {
        // İlgili notification'ı read olarak işaretleyip readAt'ı ISO formatında ekliyoruz.
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true, readAt: new Date().toISOString() }
              : notification
          ),
        }));

        try {
          const res = await fetch(`/api/notifications/${id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) {
            throw new Error("Failed to mark notification as read");
          }
        } catch (error) {
          set({ error: "Failed to mark notification as read" });
        }
      },

      markAllAsRead: async () => {
        // Tüm notification'ların readAt tarihini ISO formatında güncelliyoruz.
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
            readAt: new Date().toISOString(),
          })),
        }));

        try {
          const res = await fetch("/api/notifications/markAllAsRead", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) {
            throw new Error("Failed to mark all notifications as read");
          }
        } catch (error) {
          set({ error: "Failed to mark all notifications as read" });
        }
      },

      deleteNotification: async (id: string) => {
        const previousNotifications = get().notifications;
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        }));

        try {
          const res = await fetch(`/api/notifications/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to delete notification");
          }
        } catch (error) {
          set({ error: "Failed to delete notification" });
          set({ notifications: previousNotifications });
        }
      },

      clearAllNotifications: async () => {
        const previousNotifications = get().notifications;
        set({ notifications: [] });

        try {
          const res = await fetch("/api/notifications", {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to clear notifications");
          }
        } catch (error) {
          set({ error: "Failed to clear notifications" });
          set({ notifications: previousNotifications });
        }
      },

      getUnreadCount: () =>
        get().notifications.filter((notification) => !notification.read).length,
    }),
    {
      name: "notification-storage",
    }
  )
);
