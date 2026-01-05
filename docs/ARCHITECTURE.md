# 🏗️ Online Mülakat Sistemi - Frontend Mimari Dokümantasyonu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Yığını](#teknoloji-yığını)
3. [Proje Yapısı](#proje-yapısı)
4. [Mimari Katmanlar](#mimari-katmanlar)
5. [Routing ve Sayfa Yapısı](#routing-ve-sayfa-yapısı)
6. [State Yönetimi](#state-yönetimi)
7. [API Entegrasyonu](#api-entegrasyonu)
8. [Bileşen Mimarisi](#bileşen-mimarisi)
9. [Tip Sistemi](#tip-sistemi)
10. [Güvenlik ve Kimlik Doğrulama](#güvenlik-ve-kimlik-doğrulama)
11. [UI/UX Sistemi](#uiux-sistemi)
12. [Veri Akışı](#veri-akışı)

---

## 🎯 Genel Bakış

Bu proje, **İnsan Kaynakları (İK) departmanları** için geliştirilmiş kapsamlı bir **Online Mülakat Yönetim Sistemi**'nin frontend uygulamasıdır. Sistem, mülakat oluşturma, aday değerlendirme, AI destekli analiz ve raporlama gibi özellikler sunar.

### Temel Özellikler
- 📝 **Mülakat Yönetimi**: Oluşturma, düzenleme, yayınlama
- 👥 **Aday Yönetimi**: Listeleme, filtreleme, değerlendirme
- 📊 **Başvuru Takibi**: Durum yönetimi, AI analizi
- 🤖 **AI Entegrasyonu**: Soru üretimi, aday değerlendirme
- 📈 **Raporlama**: İstatistikler, grafikler, analizler
- 🔔 **Bildirim Sistemi**: Gerçek zamanlı bildirimler
- 📅 **Takvim**: Mülakat planlama

---

## 🛠️ Teknoloji Yığını

### Core Framework
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Next.js** | 14.2.16 | React framework (App Router) |
| **React** | 18.x | UI kütüphanesi |
| **TypeScript** | 5.x | Tip güvenliği |

### State Management
| Teknoloji | Açıklama |
|-----------|----------|
| **Zustand** | Global state yönetimi |
| **TanStack Query** | Server state yönetimi ve caching |
| **Immer** | Immutable state güncellemeleri |

### Styling & UI
| Teknoloji | Açıklama |
|-----------|----------|
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn/ui** | Radix UI tabanlı component library |
| **Framer Motion** | Animasyonlar |
| **Lucide React** | İkon kütüphanesi |

### Form & Validation
| Teknoloji | Açıklama |
|-----------|----------|
| **React Hook Form** | Form yönetimi |
| **Zod** | Schema validation |
| **@hookform/resolvers** | Zod entegrasyonu |

### Veri Görselleştirme
| Teknoloji | Açıklama |
|-----------|----------|
| **Recharts** | Grafik kütüphanesi |
| **React Day Picker** | Tarih seçici |
| **Date-fns** | Tarih işlemleri |

### HTTP Client
| Teknoloji | Açıklama |
|-----------|----------|
| **Axios** | HTTP istekleri |

---

## 📁 Proje Yapısı

```
interview_frontend/
├── app/                          # Next.js App Router
│   ├── (protected)/              # Korumalı rotalar (auth gerekli)
│   │   ├── dashboard/            # Ana panel
│   │   ├── interviews/           # Mülakat yönetimi
│   │   │   ├── [id]/             # Mülakat detay (dinamik)
│   │   │   └── add/              # Yeni mülakat
│   │   ├── candidates/           # Aday yönetimi
│   │   ├── applications/         # Başvuru yönetimi
│   │   │   └── [id]/             # Başvuru detay (dinamik)
│   │   └── reports/              # Raporlama
│   ├── (public)/                 # Herkese açık rotalar
│   │   ├── reset-password/       # Şifre sıfırlama
│   │   └── verify-email/         # Email doğrulama
│   ├── api/                      # API routes (Next.js)
│   │   └── chat/                 # Chat API
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global stiller
│
├── components/                   # React bileşenleri
│   ├── ui/                       # Shadcn/ui bileşenleri (50+ bileşen)
│   ├── interview/                # Mülakat bileşenleri
│   ├── candidate/                # Aday bileşenleri
│   ├── applications/             # Başvuru bileşenleri
│   ├── dashboard/                # Dashboard bileşenleri
│   ├── reporting/                # Raporlama bileşenleri
│   ├── charts/                   # Grafik bileşenleri
│   ├── settings/                 # Ayar bileşenleri
│   └── notifications/            # Bildirim bileşenleri
│
├── store/                        # Zustand stores
│   ├── authStore.ts              # Kimlik doğrulama
│   ├── interviewStore.ts         # Mülakat state
│   ├── candidateStore.ts         # Aday state
│   ├── applicationStore.ts       # Başvuru state
│   ├── dashboardStore.ts         # Dashboard state
│   ├── reportingStore.ts         # Raporlama state
│   ├── notification-store.ts     # Bildirim state
│   ├── profileStore.ts           # Profil state
│   ├── question-store.ts         # Soru state
│   └── favorite-candidates-store.ts # Favori adaylar
│
├── services/                     # API servis katmanı
│   ├── authService.ts            # Auth işlemleri
│   ├── interviewService.ts       # Mülakat API
│   ├── candidateService.ts       # Aday API
│   ├── applicationService.ts     # Başvuru API
│   ├── appointmentService.ts     # Randevu API
│   ├── notificationService.ts    # Bildirim API
│   └── profileService.ts         # Profil API
│
├── types/                        # TypeScript tipleri
│   ├── interview.ts              # Mülakat tipleri
│   ├── candidate.ts              # Aday tipleri
│   ├── application.ts            # Başvuru tipleri
│   ├── user.ts                   # Kullanıcı tipleri
│   ├── question.ts               # Soru tipleri
│   └── notification.ts           # Bildirim tipleri
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.tsx               # Auth hook
│   ├── useApplication.ts         # Başvuru hook
│   ├── useApplicationAnalysisStatus.ts
│   ├── use-toast.ts              # Toast hook
│   └── use-mobile.tsx            # Responsive hook
│
├── utils/                        # Yardımcı fonksiyonlar
│   ├── api.ts                    # Axios instance
│   ├── tokenUtils.ts             # Token işlemleri
│   ├── validationSchemas.ts      # Zod şemaları
│   └── validationUtils.ts        # Validasyon helpers
│
├── middlewares/                  # Next.js middleware
│   ├── authMiddleware.ts         # Auth kontrolü
│   └── errorMiddleware.ts        # Hata yönetimi
│
├── lib/                          # Kütüphane helpers
│   └── utils.ts                  # cn() helper (Tailwind)
│
└── public/                       # Statik dosyalar
    └── placeholder-*.{png,svg,jpg}
```

---

## 🏛️ Mimari Katmanlar

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │  Layouts    │  │     Components      │  │
│  │  (app/)     │  │  (app/)     │  │    (components/)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                    │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   Zustand Stores    │  │    TanStack Query Cache     │   │
│  │     (store/)        │  │   (ClientQueryProvider)     │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Services (services/)                    │    │
│  │   authService │ interviewService │ candidateService  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Axios Instance (utils/api.ts)               │    │
│  │   - Request/Response Interceptors                   │    │
│  │   - Token Refresh Logic                             │    │
│  │   - Error Handling                                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                               │
│               (NEXT_PUBLIC_APP_URL)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛤️ Routing ve Sayfa Yapısı

### Route Groups (Next.js 14 App Router)

#### 1. Public Routes `(public)/`
Kimlik doğrulama gerektirmeyen sayfalar:

| Route | Açıklama |
|-------|----------|
| `/` | Landing Page |
| `/verify-email` | Email doğrulama |
| `/reset-password` | Şifre sıfırlama |

#### 2. Protected Routes `(protected)/`
Kimlik doğrulama gerektiren sayfalar:

| Route | Açıklama |
|-------|----------|
| `/dashboard` | Ana panel |
| `/interviews` | Mülakat listesi |
| `/interviews/[id]` | Mülakat detay |
| `/interviews/add` | Yeni mülakat |
| `/candidates` | Aday listesi |
| `/applications` | Başvuru listesi |
| `/applications/[id]` | Başvuru detay |
| `/reports` | Raporlama |

### Layout Hiyerarşisi

```
RootLayout (app/layout.tsx)
├── ClientQueryProvider (TanStack Query)
└── ThemeProvider (Dark/Light mode)
    ├── PublicLayout (app/(public)/layout.tsx)
    │   └── Minimal UI (centered card)
    │
    └── ProtectedLayout (app/(protected)/layout.tsx)
        ├── Auth Guard (useAuth kontrolü)
        ├── DashboardHeader (Navigation)
        └── Main Content Area
```

---

## 🗄️ State Yönetimi

### Zustand Store Yapısı

```typescript
// Örnek Store Pattern
interface StoreState {
  // Data
  items: Item[];
  selectedItem: Item | null;
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Pagination (opsiyonel)
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

interface StoreActions {
  // CRUD Operations
  fetchItems: () => Promise<void>;
  getItemById: (id: string) => Promise<void>;
  createItem: (data: CreateDTO) => Promise<Item>;
  updateItem: (id: string, data: UpdateDTO) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // State Helpers
  setFilters: (filters: Filters) => void;
  clearSelection: () => void;
}
```

### Store Listesi ve Sorumlulukları

| Store | Dosya | Sorumluluk |
|-------|-------|------------|
| **Auth Store** | `authStore.ts` | Kullanıcı oturumu, login/logout, token yönetimi |
| **Interview Store** | `interviewStore.ts` | Mülakat CRUD, soru yönetimi, yayınlama |
| **Candidate Store** | `candidateStore.ts` | Aday listeleme, filtreleme, durum güncelleme |
| **Application Store** | `applicationStore.ts` | Başvuru yönetimi, filtreleme, sayfalama |
| **Dashboard Store** | `dashboardStore.ts` | Dashboard metrikleri, grafikler |
| **Notification Store** | `notification-store.ts` | Bildirimler, okundu/okunmadı |
| **Reporting Store** | `reportingStore.ts` | Rapor verileri |
| **Profile Store** | `profileStore.ts` | Kullanıcı profili |
| **Question Store** | `question-store.ts` | Soru bankası |
| **Favorites Store** | `favorite-candidates-store.ts` | Favori adaylar |

### State Akışı

```
User Action → Component → Store Action → Service → API
                                              ↓
Component ← Store State Update ← Service Response
```

---

## 🔌 API Entegrasyonu

### Axios Instance Yapılandırması

```typescript
// utils/api.ts
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    withCredentials: true,  // Cookie-based auth
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});
```

### Interceptors

#### Request Interceptor
- İstek öncesi hazırlık
- Header ekleme

#### Response Interceptor
- **401 Unauthorized**: Otomatik token yenileme
- **Token Queue**: Birden fazla istek için sıralama
- **Auto Logout**: Yenileme başarısızsa çıkış

### API Endpoints

| Service | Base Path | Endpoints |
|---------|-----------|-----------|
| **Auth** | `/auth/` | `login`, `register`, `logout`, `refresh`, `verify-email`, `forgot-password`, `reset-password` |
| **Interview** | `/interviews/` | `GET /my`, `GET /:id`, `POST /`, `PUT /:id`, `PATCH /:id/publish`, `DELETE /:id` |
| **Application** | `/applications/` | `GET /`, `GET /:id`, `PATCH /:id/status` |
| **Profile** | `/profile/` | `GET /me` |

---

## 🧩 Bileşen Mimarisi

### Bileşen Kategorileri

#### 1. UI Bileşenleri (`components/ui/`)
Shadcn/ui tabanlı, yeniden kullanılabilir atomik bileşenler:

```
ui/
├── Inputs: button, input, textarea, select, checkbox, radio-group
├── Layout: card, dialog, sheet, drawer, separator
├── Navigation: tabs, navigation-menu, breadcrumb, pagination
├── Feedback: toast, alert, badge, progress
├── Data Display: table, avatar, calendar, chart
└── Overlay: popover, tooltip, dropdown-menu, context-menu
```

#### 2. Feature Bileşenleri

**Interview Module** (`components/interview/`)
```
interview/
├── InterviewCard.tsx          # Mülakat kartı
├── InterviewList.tsx          # Mülakat listesi
├── InterviewDetails.tsx       # Mülakat detay
├── create-interview-dialog.tsx # Oluşturma modalı
├── ExtendDurationDialog.tsx   # Süre uzatma
├── filter-section.tsx         # Filtreler
├── question-manager.tsx       # Soru yönetimi
├── AIQuestionCreation.tsx     # AI soru üretimi
└── InterviewPreview.tsx       # Önizleme
```

**Candidate Module** (`components/candidate/`)
```
candidate/
├── CandidateList.tsx          # Aday listesi
├── candidate-card.tsx         # Aday kartı
├── candidate-detail-popup.tsx # Detay popup
├── candidate-filters.tsx      # Filtreler
├── ai-detailed-reports.tsx    # AI raporları
├── video-player.tsx           # Video oynatıcı
└── video-transcript.tsx       # Transkript
```

**Dashboard Module** (`components/dashboard/`)
```
dashboard/
├── OverviewStats.tsx          # Genel istatistikler
├── DashboardCharts.tsx        # Grafikler
├── InterviewCalendar.tsx      # Takvim
├── InterviewSlider.tsx        # Mülakat slider
├── ApplicationSlider.tsx      # Başvuru slider
├── NotificationPanel.tsx      # Bildirimler
├── ChatAssistant.tsx          # AI asistan
└── FavoriteCandidates.tsx     # Favoriler
```

**Reporting Module** (`components/reporting/`)
```
reporting/
├── reporting-filters.tsx           # Filtreler
├── general-statistics.tsx          # Genel istatistikler
├── candidate-analysis.tsx          # Aday analizi
├── interview-quality-analysis.tsx  # Kalite analizi
├── ai-recommendations.tsx          # AI önerileri
└── visualizations-and-graphs.tsx   # Görselleştirme
```

### Bileşen Desenleri

#### Container/Presentational Pattern
```typescript
// Container (Page)
export default function InterviewsPage() {
  const { interviews, loading } = useInterviewStore();
  return <InterviewList interviews={interviews} loading={loading} />;
}

// Presentational
export function InterviewList({ interviews, loading }: Props) {
  // Sadece render mantığı
}
```

#### Compound Component Pattern
```typescript
// Dialog örneği
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

## 📝 Tip Sistemi

### Core Tipler

#### User & Auth
```typescript
type UserRole = "admin" | "company" | "user" | "super_admin";

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  permissions: Permission[];
  preferences?: UserPreference;
}
```

#### Interview
```typescript
enum InterviewStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DRAFT = "draft",
  INACTIVE = "inactive"
}

interface Interview {
  _id: string;
  title: string;
  expirationDate: string;
  status: InterviewStatus;
  stages: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  questions: InterviewQuestion[];
  interviewLink?: { link: string; expirationDate?: string };
}
```

#### Application
```typescript
type ApplicationStatus = 
  | 'pending' | 'in_progress' | 'completed'
  | 'rejected' | 'accepted'
  | 'awaiting_video_responses' | 'awaiting_ai_analysis';

interface Application {
  _id: string;
  interviewId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  responses: ApplicationResponse[];
  generalAIAnalysis?: GeneralAIAnalysis;
  aiAnalysisResults: string[];
}
```

### DTO Pattern
```typescript
// Create DTO
interface CreateInterviewDTO {
  title: string;
  expirationDate: string | Date;
  questions?: InterviewQuestion[];
}

// Update DTO (Partial)
interface UpdateInterviewDTO {
  title?: string;
  expirationDate?: string | Date;
  status?: InterviewStatus;
}
```

---

## 🔐 Güvenlik ve Kimlik Doğrulama

### Auth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│   Backend   │────▶│  Set Cookie │
│   Form      │     │   /auth/    │     │  (HttpOnly) │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Protected  │◀────│  useAuth()  │◀────│  Get User   │
│   Routes    │     │   Hook      │     │  /profile/  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Token Refresh Mekanizması

```typescript
// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue management for concurrent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
      
      // Refresh token
      await api.post('/auth/refresh');
      return api(originalRequest);
    }
  }
);
```

### Route Protection

#### Middleware Level
```typescript
// middlewares/authMiddleware.ts
export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
```

#### Layout Level
```typescript
// (protected)/layout.tsx
export default function ProtectedLayout({ children }) {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);
  
  if (isLoading) return <LoadingSpinner />;
  return children;
}
```

---

## 🎨 UI/UX Sistemi

### Theme System

```typescript
// Tailwind CSS Variables
const colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  muted: 'hsl(var(--muted))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',
};
```

### Dark Mode Support
```typescript
// ThemeProvider ile next-themes kullanımı
<ThemeProvider 
  attribute="class" 
  defaultTheme="system" 
  enableSystem
>
  {children}
</ThemeProvider>
```

### Animation System
```typescript
// Framer Motion pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

### Responsive Design
```typescript
// Tailwind breakpoints
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

---

## 📊 Veri Akışı

### Unidirectional Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER ACTION                          │
│                    (Click, Submit, etc.)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      COMPONENT EVENT                         │
│                   (onClick, onSubmit)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      STORE ACTION                            │
│              (useInterviewStore().createInterview)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE CALL                            │
│              (interviewService.createInterview)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API REQUEST                            │
│                    (axios.post('/...'))                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API RESPONSE                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     STORE UPDATE                             │
│                    (set({ interviews }))                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     COMPONENT RE-RENDER                      │
│                  (UI reflects new state)                     │
└─────────────────────────────────────────────────────────────┘
```

### Optimistic Updates Pattern
```typescript
// Önce UI güncelle, sonra API çağır
updateCandidateStatus: async (id, status) => {
  // 1. Optimistic update
  set((state) => ({
    candidates: state.candidates.map((c) =>
      c.id === id ? { ...c, status } : c
    ),
  }));

  // 2. API call
  await api.patch(`/candidates/${id}`, { status });
  
  // 3. Hata durumunda rollback (opsiyonel)
}
```

---

## 🔄 Modül İlişkileri

```
                    ┌─────────────────┐
                    │    Dashboard    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Interviews    │ │   Applications  │ │   Candidates    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         │         ┌─────────┴─────────┐         │
         │         │                   │         │
         ▼         ▼                   ▼         ▼
┌─────────────────────────────────────────────────────────┐
│                      AI Analysis                         │
│        (Soru üretimi, Aday değerlendirme)               │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                       Reporting                          │
│            (İstatistikler, Grafikler)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Geliştirici Notları

### Kod Standartları
- **TypeScript**: Strict mode aktif
- **ESLint**: Next.js standart kuralları
- **Path Aliases**: `@/*` → root dizin

### Performans Optimizasyonları
- `useCallback` ve `useMemo` kullanımı
- Lazy loading (dinamik importlar)
- Image optimization (next/image)
- Server components (mümkün olduğunda)

### Best Practices
1. **State**: Local state öncelikli, global sadece gerektiğinde
2. **API**: Service katmanı üzerinden erişim
3. **Types**: Her veri için açık tip tanımı
4. **Components**: Single responsibility prensibi
5. **Error Handling**: Toast bildirimleri ile kullanıcı feedback

---

## 🚀 Geliştirme Komutları

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

*Bu dokümantasyon, projenin mevcut durumunu yansıtmaktadır. Güncellemeler için lütfen ilgili modül dokümantasyonlarına bakınız.*
