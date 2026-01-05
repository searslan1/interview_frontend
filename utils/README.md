# 🔧 Utils & Lib Modules - Yardımcı Fonksiyonlar

## 📋 Genel Bakış

Bu modüller, HR-AI İnsan Kaynakları Yönetim Paneli'nde kullanılan yardımcı fonksiyonları, API konfigürasyonunu ve mock verileri içerir.

## 🏗️ Mimari Yapı

### Utils Klasörü

```
utils/
├── api.ts                 # 🌐 Axios instance ve interceptors
├── api_README.md          # API dokümantasyonu
├── tokenUtils.ts          # 🔑 Token yönetim fonksiyonları
├── validationSchemas.ts   # ✅ Zod validation şemaları
└── validationUtils.ts     # ✅ Validation yardımcı fonksiyonları
```

### Lib Klasörü

```
lib/
├── utils.ts               # 🛠️ Genel yardımcı fonksiyonlar
├── mockData.ts            # 📊 Mock veri tanımları
└── mock-applications.ts   # 📋 Mock başvuru verileri
```

---

## 🌐 API Configuration (`utils/api.ts`)

Axios instance ve interceptor konfigürasyonu.

### Temel Konfigürasyon

```typescript
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  withCredentials: true, // Cookie tabanlı auth için
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
```

### Request Interceptor

```typescript
api.interceptors.request.use(
  (config) => {
    // İstek öncesi işlemler (logging, header ekleme vb.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor - Token Refresh

```typescript
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized hatası ve henüz retry yapılmamışsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Refresh devam ediyorsa kuyruğa ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Token yenile
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Kullanım Örneği

```typescript
import api from "@/utils/api";

// GET isteği
const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// POST isteği
const createUser = async (userData: CreateUserDTO) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// PUT isteği
const updateUser = async (id: string, data: UpdateUserDTO) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// DELETE isteği
const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};
```

---

## 🔑 Token Utils (`utils/tokenUtils.ts`)

Token yönetim fonksiyonları.

### Fonksiyonlar

```typescript
// Token decode (JWT)
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Token expiry kontrolü
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

// Token kalan süre
export const getTokenRemainingTime = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  return Math.max(0, decoded.exp * 1000 - Date.now());
};
```

---

## ✅ Validation Schemas (`utils/validationSchemas.ts`)

Zod ile form validation şemaları.

### Login Schema

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(1, "Şifre zorunludur")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### Register Schema

```typescript
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Ad Soyad zorunludur")
    .min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(1, "Şifre zorunludur")
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
    ),
  confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

### Interview Schema

```typescript
export const createInterviewSchema = z.object({
  title: z
    .string()
    .min(1, "Başlık zorunludur")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional(),
  expirationDate: z.string().min(1, "Bitiş tarihi zorunludur"),
  type: z.enum(["async-video", "live-video", "audio-only", "text-based"]).optional(),
  position: z.object({
    title: z.string().min(1, "Pozisyon başlığı zorunludur"),
    department: z.string().optional(),
    description: z.string().optional(),
    competencyWeights: z.object({
      technical: z.number().min(0).max(100),
      communication: z.number().min(0).max(100),
      problem_solving: z.number().min(0).max(100),
    }).optional(),
  }).optional(),
  questions: z.array(z.object({
    questionText: z.string().min(1, "Soru metni zorunludur"),
    expectedAnswer: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    duration: z.number().min(30).max(300),
    order: z.number(),
  })).optional(),
});

export type CreateInterviewFormData = z.infer<typeof createInterviewSchema>;
```

---

## ✅ Validation Utils (`utils/validationUtils.ts`)

Validation yardımcı fonksiyonları.

```typescript
// E-posta validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Telefon validation (Türkiye)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Tarih validation (gelecek tarih)
export const isFutureDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  return inputDate > new Date();
};

// Şifre güçlülük kontrolü
export const getPasswordStrength = (password: string): {
  score: number;
  label: "weak" | "medium" | "strong";
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: "weak" };
  if (score <= 4) return { score, label: "medium" };
  return { score, label: "strong" };
};
```

---

## 🛠️ General Utils (`lib/utils.ts`)

Genel yardımcı fonksiyonlar.

### Class Name Utility

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS class birleştirme
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Kullanım

```typescript
import { cn } from "@/lib/utils";

// Dinamik class oluşturma
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class",
  className // prop olarak gelen class
)} />
```

### Diğer Utility Fonksiyonlar

```typescript
// Tarih formatlama
export const formatDate = (date: string | Date, format?: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Süre formatlama
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Debounce fonksiyonu
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle fonksiyonu
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Slug oluşturma
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Truncate text
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Deep clone
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Random ID oluşturma
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
```

---

## 📊 Mock Data (`lib/mockData.ts`)

Development için mock veri tanımları.

```typescript
// Mock kullanıcılar
export const mockUsers = [
  {
    _id: "user1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  // ...
];

// Mock mülakatlar
export const mockInterviews = [
  {
    _id: "interview1",
    title: "Senior Frontend Developer",
    status: "published",
    // ...
  },
  // ...
];

// Mock adaylar
export const mockCandidates = [
  {
    _id: "candidate1",
    name: "Ali",
    surname: "Yılmaz",
    email: "ali@example.com",
    status: "active",
    // ...
  },
  // ...
];
```

---

## 📋 Mock Applications (`lib/mock-applications.ts`)

Başvuru mock verileri.

```typescript
export const mockApplications = [
  {
    _id: "app1",
    interviewId: "interview1",
    candidate: {
      _id: "candidate1",
      name: "Ali",
      surname: "Yılmaz",
    },
    status: "completed",
    generalAIAnalysis: {
      overallScore: 85,
      technicalSkillsScore: 90,
      communicationScore: 80,
    },
    createdAt: "2024-01-15T10:00:00Z",
  },
  // ...
];
```

---

## 🎯 Utils Patterns

### 1. Pure Functions

```typescript
// Pure function - aynı input, aynı output
export const add = (a: number, b: number): number => a + b;

// Side effect yok
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};
```

### 2. Type Guards

```typescript
// Type guard fonksiyonu
export const isCandidate = (obj: any): obj is Candidate => {
  return obj && typeof obj._id === 'string' && typeof obj.name === 'string';
};

// Kullanım
if (isCandidate(data)) {
  console.log(data.name); // TypeScript artık bilir
}
```

### 3. Error Handling

```typescript
// Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const safeParseJSON = <T>(json: string): Result<T> => {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

---

## 📦 Dependencies

### Utils
- **axios** - HTTP client
- **zod** - Schema validation

### Lib
- **clsx** - Class name utility
- **tailwind-merge** - Tailwind class merging

---

## 🚀 Best Practices

1. **Pure Functions**: Side effect'siz fonksiyonlar yaz
2. **Type Safety**: Tam TypeScript tiplemesi
3. **Single Responsibility**: Her fonksiyon tek bir iş yapsın
4. **Documentation**: JSDoc yorumları ekle
5. **Testing**: Unit test yaz
6. **Naming**: Açıklayıcı fonksiyon isimleri
7. **Error Handling**: Her fonksiyonda hata yönetimi
8. **Immutability**: Mümkünse immutable operasyonlar kullan
