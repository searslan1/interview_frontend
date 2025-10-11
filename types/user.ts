export type UserRole = "admin" | "company" | "user" | "super_admin";


export interface User {
  _id: string; 
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean; 

  // Güvenlik & Hesap Durumu
  emailVerified: boolean;
  phoneVerified: boolean;
  phone?: string;
  failedLoginAttempts: number;
  accountLockedUntil?: string;
  twoFactorEnabled: boolean;
  lastActiveAt?: string; // ✅ Kullanıcının en son aktif olduğu tarih
  preferences?: UserPreference; // ✅ Eklenmiş hali


  // Profil Bilgileri
  profilePicture?: string;
  bio?: string;

  // Erişim İzinleri
  permissions: {
    module: string;
    accessLevel: "read" | "write" | "delete";
  }[];

  // Zaman damgaları
  createdAt: string;
  updatedAt: string;
}

// ✅ Kullanıcı Tercihleri Modeli (Backend'deki `UserPreference`)
export interface UserPreference {
  userId: string;
  language: "en" | "es" | "fr" | "tr";
  theme: {
    mode: "light" | "dark";
    customColors?: Record<string, string>;
  };
  notificationsEnabled: boolean;
  timezone: string;
}