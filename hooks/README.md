# 🪝 Hooks Module - Custom React Hooks

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nde kullanılan özel React hook'larını içerir. Hook'lar, bileşenler arasında yeniden kullanılabilir mantık sağlar ve separation of concerns prensibini destekler.

## 🏗️ Mimari Yapı

```
hooks/
├── useAuth.tsx                    # 🔐 Authentication hook
├── useApplication.ts              # 📋 Application data hook
├── useApplicationAnalysisStatus.ts # 📊 AI analiz durumu hook
├── use-mobile.tsx                 # 📱 Mobile detection hook
└── use-toast.ts                   # 🔔 Toast notification hook
```

---

## 🔐 useAuth Hook (`useAuth.tsx`)

Kullanıcı kimlik doğrulama durumunu ve işlevlerini sağlar.

### Amaç

- Auth state'ine kolay erişim
- Sayfa yüklendiğinde kullanıcı bilgilerini otomatik çekme
- Login, logout, register gibi auth işlemlerini expose etme

### Implementasyon

```typescript
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { authService } from "@/services/authService";

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isEmailVerified,
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
    setUser,
  } = useAuthStore();

  // Sayfa yüklendiğinde kullanıcı bilgilerini al
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR koruma

    if (!user) {
      authService.getCurrentUser()
        .then((fetchedUser) => {
          if (fetchedUser) setUser(fetchedUser);
        })
        .catch(() => {
          console.error("Kullanıcı bilgileri alınamadı.");
        });
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    isEmailVerified,
    isAuthenticated: !!user,
    login,
    register,
    verifyEmail,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
  };
};
```

### Dönen Değerler

| Değer | Tip | Açıklama |
|-------|-----|----------|
| `user` | `User \| null` | Mevcut kullanıcı bilgisi |
| `isLoading` | `boolean` | Auth işlemi devam ediyor mu |
| `error` | `string \| null` | Hata mesajı |
| `isEmailVerified` | `boolean` | E-posta doğrulandı mı |
| `isAuthenticated` | `boolean` | Kullanıcı giriş yapmış mı |
| `login` | `Function` | Giriş fonksiyonu |
| `register` | `Function` | Kayıt fonksiyonu |
| `verifyEmail` | `Function` | E-posta doğrulama |
| `refreshToken` | `Function` | Token yenileme |
| `logout` | `Function` | Çıkış fonksiyonu |
| `requestPasswordReset` | `Function` | Şifre sıfırlama talebi |
| `resetPassword` | `Function` | Şifre sıfırlama |

### Kullanım Örnekleri

```tsx
// Protected Layout'ta
export default function ProtectedLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);

  if (isLoading) return <LoadingSpinner />;
  
  return <div>{children}</div>;
}
```

```tsx
// Login Modal'da
function LoginModal() {
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert variant="error">{error}</Alert>}
      <Input name="email" />
      <Input name="password" type="password" />
      <Button disabled={isLoading}>
        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
}
```

```tsx
// Header'da logout
function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Çıkış Yap
    </DropdownMenuItem>
  );
}
```

---

## 📋 useApplication Hook (`useApplication.ts`)

Tek bir başvurunun verilerini çeker ve yönetir.

### Amaç

- ID ile başvuru detaylarını çekme
- Loading ve error state yönetimi
- Toast notification entegrasyonu

### Implementasyon

```typescript
import { useState, useEffect } from 'react';
import { Application } from '@/types/application';
import { getApplicationById } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';

export const useApplication = (id: string) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Başvuru getirilirken hata oluştu.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id, toast]);

  return { application, loading };
};
```

### Dönen Değerler

| Değer | Tip | Açıklama |
|-------|-----|----------|
| `application` | `Application \| null` | Başvuru verisi |
| `loading` | `boolean` | Yükleme durumu |

### Kullanım Örneği

```tsx
function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { application, loading } = useApplication(params.id);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!application) {
    return <NotFound />;
  }

  return (
    <div>
      <h1>{application.candidate.name}</h1>
      <p>Status: {application.status}</p>
      {/* ... */}
    </div>
  );
}
```

---

## 📊 useApplicationAnalysisStatus Hook (`useApplicationAnalysisStatus.ts`)

Başvurunun AI analiz durumunu takip eder.

### Amaç

- AI analiz sürecini polling ile takip etme
- Analiz tamamlandığında bildirim
- Real-time güncelleme sağlama

### Kullanım Örneği

```tsx
function ApplicationDetail({ applicationId }) {
  const { analysisStatus, isAnalyzing, refetch } = useApplicationAnalysisStatus(applicationId);

  return (
    <div>
      {isAnalyzing && (
        <Badge variant="warning">
          <Loader2 className="animate-spin mr-2" />
          AI Analiz Devam Ediyor...
        </Badge>
      )}
      
      {analysisStatus === 'completed' && (
        <Badge variant="success">Analiz Tamamlandı</Badge>
      )}
      
      <Button onClick={refetch}>Durumu Güncelle</Button>
    </div>
  );
}
```

---

## 📱 useMobile Hook (`use-mobile.tsx`)

Mobil cihaz tespiti için kullanılır.

### Implementasyon

```typescript
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

### Kullanım Örneği

```tsx
function ResponsiveComponent() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout />;
  }

  return <DesktopLayout />;
}
```

```tsx
function Sidebar() {
  const isMobile = useIsMobile();

  return (
    <Sheet>
      {isMobile ? (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
      ) : (
        <aside className="w-64 border-r">
          <Navigation />
        </aside>
      )}
    </Sheet>
  );
}
```

---

## 🔔 useToast Hook (`use-toast.ts`)

Toast bildirimlerini yönetir.

### Amaç

- Global toast notification sistemi
- Reducer pattern ile state yönetimi
- Otomatik dismiss süresi

### Implementasyon Özeti

```typescript
import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Reducer action types
type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

// Hook return type
function useToast() {
  return {
    toast: (props: Toast) => void,
    dismiss: (toastId?: string) => void,
    toasts: ToasterToast[],
  };
}
```

### Toast Variants

| Variant | Kullanım |
|---------|----------|
| `default` | Genel bildirimler |
| `destructive` | Hata mesajları |

### Kullanım Örnekleri

```tsx
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  // Başarı mesajı
  const showSuccess = () => {
    toast({
      title: "Başarılı",
      description: "İşlem tamamlandı.",
    });
  };

  // Hata mesajı
  const showError = () => {
    toast({
      variant: "destructive",
      title: "Hata",
      description: "Bir şeyler yanlış gitti.",
    });
  };

  // Action butonlu toast
  const showWithAction = () => {
    toast({
      title: "Değişiklikler kaydedildi",
      description: "Geri almak ister misiniz?",
      action: (
        <ToastAction altText="Geri Al" onClick={handleUndo}>
          Geri Al
        </ToastAction>
      ),
    });
  };

  return (
    <div>
      <Button onClick={showSuccess}>Başarı</Button>
      <Button onClick={showError}>Hata</Button>
      <Button onClick={showWithAction}>Action</Button>
    </div>
  );
}
```

---

## 🎯 Hook Patterns

### 1. Data Fetching Hook Pattern

```typescript
function useData<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, deps);

  return { data, loading, error };
}
```

### 2. Store Selector Hook Pattern

```typescript
// Store'dan spesifik veri seçme
function useSelectedCandidate() {
  return useCandidateStore((state) => state.selectedCandidate);
}

function useCandidateLoading() {
  return useCandidateStore((state) => state.isLoading);
}
```

### 3. Combined Hook Pattern

```typescript
// Birden fazla store/hook birleştirme
function useCandidateManagement() {
  const candidateStore = useCandidateStore();
  const favoriteStore = useFavoriteCandidatesStore();
  const { toast } = useToast();

  const handleFavoriteToggle = async (id: string) => {
    if (favoriteStore.isFavorite(id)) {
      favoriteStore.removeFavorite(id);
      toast({ title: "Favorilerden çıkarıldı" });
    } else {
      const candidate = candidateStore.getCandidateById(id);
      if (candidate) {
        favoriteStore.addFavorite({
          id: candidate._id,
          name: candidate.name,
          position: candidate.lastAppliedPosition,
          score: candidate.aggregateScore?.overall || 0,
        });
        toast({ title: "Favorilere eklendi" });
      }
    }
  };

  return {
    ...candidateStore,
    favorites: favoriteStore.favorites,
    isFavorite: favoriteStore.isFavorite,
    handleFavoriteToggle,
  };
}
```

### 4. Debounced Hook Pattern

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Kullanım
function SearchComponent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // API çağrısı sadece debounce'dan sonra
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
}
```

---

## 📦 Dependencies

- **react** - React hooks
- **@/store/**** - Zustand stores
- **@/services/**** - API services
- **@/types/**** - TypeScript types

---

## 🚀 Best Practices

1. **SSR Safety**: `typeof window === "undefined"` kontrolü
2. **Cleanup**: useEffect cleanup fonksiyonları
3. **Dependency Array**: Doğru dependency tracking
4. **Type Safety**: Tam TypeScript tiplemesi
5. **Separation of Concerns**: Her hook tek bir sorumluluğa sahip
6. **Reusability**: Hook'lar birden fazla component'te kullanılabilir
7. **Error Handling**: Her async işlem için error handling
8. **Loading States**: Kullanıcı feedback için loading states

---

## 📝 Hook Oluşturma Rehberi

Yeni bir hook oluştururken:

1. **İsim Konvansiyonu**: `use` prefix'i ile başla (örn: `useUserPreferences`)
2. **Dosya Konumu**: `hooks/` klasörüne ekle
3. **TypeScript**: Return type'ı açıkça tanımla
4. **Dokümantasyon**: JSDoc yorumları ekle
5. **Test**: Unit test yaz

```typescript
/**
 * Kullanıcı tercihlerini yöneten hook
 * @returns {Object} Tercihler ve güncelleme fonksiyonları
 */
export function useUserPreferences() {
  // Implementation
  return {
    preferences,
    updatePreferences,
    isLoading,
  };
}
```
