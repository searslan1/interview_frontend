# 🎯 HR-AI Interview Frontend

Bu proje, yapay zeka destekli mülakat süreçlerini dijital ortama taşıyan kapsamlı bir insan kaynakları yönetim sisteminin frontend tarafını içerir. `Next.js (App Router)`, `TailwindCSS`, `TypeScript` ve `Zustand` kullanılarak geliştirilmiştir.

---

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

---

## 🏗️ Proje Mimarisi

```
interview_frontend/
├── 📱 app/                    # Next.js App Router - Sayfa rotaları
├── 🧩 components/             # UI ve feature bileşenleri
├── 🪝 hooks/                  # Custom React hooks
├── 🛠️ lib/                    # Yardımcı kütüphaneler
├── 🛡️ middlewares/            # Auth ve error middleware
├── 🔌 services/               # API entegrasyon katmanı
├── 🗃️ store/                  # Zustand state management
├── 📝 types/                  # TypeScript tip tanımları
├── 🔧 utils/                  # Utility fonksiyonlar
├── 🎨 styles/                 # Global CSS
└── 📁 public/                 # Statik dosyalar
```

---

## 📚 Modül Dokümantasyonları

Her modül için detaylı README dosyaları oluşturulmuştur:

| Modül | Dosya | Açıklama |
|-------|-------|----------|
| **App** | [`app/README.md`](./app/README.md) | Sayfa yapısı, routing, layout'lar |
| **Components** | [`components/README.md`](./components/README.md) | UI bileşenleri, feature components |
| **Services** | [`services/README_DETAILED.md`](./services/README_DETAILED.md) | API entegrasyonu, service pattern |
| **Store** | [`store/README_DETAILED.md`](./store/README_DETAILED.md) | Zustand state management |
| **Hooks** | [`hooks/README.md`](./hooks/README.md) | Custom React hooks |
| **Types** | [`types/README_DETAILED.md`](./types/README_DETAILED.md) | TypeScript tip tanımları |
| **Utils** | [`utils/README.md`](./utils/README.md) | API config, validation |
| **Lib** | [`lib/README.md`](./lib/README.md) | Yardımcı fonksiyonlar, mock data |
| **Middlewares** | [`middlewares/README_DETAILED.md`](./middlewares/README_DETAILED.md) | Auth middleware, error handling |

---

## 📱 App Module

Next.js 13+ App Router mimarisi ile sayfa yönetimi.

### Route Grupları

```
app/
├── page.tsx                # Landing Page
├── layout.tsx              # Root Layout
├── (protected)/            # 🔐 Korumalı rotalar (auth gerekli)
│   ├── dashboard/          # Ana kontrol paneli
│   ├── candidates/         # Talent Pool - Aday yönetimi
│   ├── applications/       # Başvuru yönetimi (Netflix UI)
│   ├── interviews/         # Mülakat yönetimi
│   └── reports/            # Raporlama & analitik
└── (public)/               # 🌐 Public rotalar
    ├── verify-email/       # E-posta doğrulama
    └── reset-password/     # Şifre sıfırlama
```

### Sayfa Özellikleri

| Sayfa | Özellikler |
|-------|-----------|
| **Dashboard** | KPI kartları, takvim, slider'lar, AI chat |
| **Candidates** | Filtreli liste, detay panel, favori yönetimi |
| **Applications** | Netflix UI, çoklu görünüm, AI skor |
| **Interviews** | Oluşturma wizard, soru yönetimi, yayınlama |
| **Reports** | Grafikler, KPI'lar, trend analizi |

---

## 🧩 Components Module

Atomic Design prensiplerine göre organize edilmiş bileşenler.

### Yapı

```
components/
├── ui/                     # 🎨 Shadcn/ui bileşenleri (50+)
├── applications/           # Başvuru bileşenleri + Netflix UI
├── candidate/              # Aday bileşenleri + Pool
├── charts/                 # Recharts grafikleri
├── dashboard/              # Dashboard bileşenleri
├── interview/              # Mülakat bileşenleri + AI
├── notifications/          # Bildirim bileşenleri
├── reporting/              # Rapor grafikleri
├── settings/               # Ayar panelleri
└── [Root Components]       # Header, Modal'lar, Provider'lar
```

### Temel UI Bileşenleri

- Button, Input, Select, Checkbox
- Dialog, Sheet, Popover, Tooltip
- Table, Card, Badge, Avatar
- Calendar, Date Picker
- Toast, Alert, Progress
- Tabs, Accordion, Collapsible

---

## 🔌 Services Module

API entegrasyon katmanı - Backend iletişimi.

### Servisler

| Servis | Endpoint'ler | Açıklama |
|--------|-------------|----------|
| `authService` | `/auth/*` | Login, register, token refresh |
| `candidateService` | `/candidates/*` | Aday CRUD, filtre, not |
| `interviewService` | `/interviews/*` | Mülakat CRUD, publish |
| `applicationService` | `/applications/*` | Başvuru listesi, durum |
| `notificationService` | `/notifications/*` | Bildirim yönetimi |
| `profileService` | `/profile/*` | Profil yönetimi |

### Pattern

```typescript
// Service örneği
export const candidateService = {
  async getCandidates(filters, page, limit) {
    const response = await api.get("/candidates", { params });
    return response.data;
  },
  // ...
};
```

---

## 🗃️ Store Module (Zustand)

Global state management.

### Store'lar

| Store | Amaç |
|-------|------|
| `authStore` | Kullanıcı auth durumu |
| `candidateStore` | Aday listesi, filtreler, pagination |
| `interviewStore` | Mülakat listesi, seçili mülakat |
| `applicationStore` | Başvurular, filtreler |
| `reportingStore` | Rapor verileri, filtreler |
| `notificationStore` | Bildirimler (persist) |
| `favoriteCandidatesStore` | Favori adaylar |

### Pattern

```typescript
// Store kullanımı
const { candidates, fetchCandidates, isLoading } = useCandidateStore();

useEffect(() => {
  fetchCandidates();
}, []);
```

---

## 🪝 Hooks Module

Custom React hooks.

| Hook | Amaç |
|------|------|
| `useAuth` | Auth state ve işlemleri |
| `useApplication` | Tek başvuru verisi |
| `useApplicationAnalysisStatus` | AI analiz durumu polling |
| `useMobile` | Responsive detection |
| `useToast` | Toast bildirimleri |

---

## 📝 Types Module

TypeScript tip tanımları.

### Ana Tipler

- `User`, `UserRole`, `UserPreference`
- `Candidate`, `CandidateStatus`, `CandidateFilters`
- `Interview`, `InterviewStatus`, `InterviewQuestion`
- `Application`, `ApplicationStatus`, `ApplicationFilters`
- `Notification`, `Report`, `Appointment`

### DTO'lar

- `CreateInterviewDTO`, `UpdateInterviewDTO`
- `ExtendDurationDTO`

---

## 🔧 Utils & Lib

### Utils

- `api.ts` - Axios instance, interceptors, token refresh
- `tokenUtils.ts` - JWT decode, expiry check
- `validationSchemas.ts` - Zod validation
- `validationUtils.ts` - Yardımcı validation fonksiyonları

### Lib

- `utils.ts` - `cn()` fonksiyonu (Tailwind class merge)
- `mockData.ts` - Mock veriler
- `mock-applications.ts` - Mock başvurular

---

## 🛡️ Middlewares

### Auth Middleware

```typescript
// Korumalı rotalar için token kontrolü
if (!accessToken && !refreshToken) {
  return NextResponse.redirect(new URL("/", req.url));
}
```

### Korumalı Rotalar

- `/dashboard/*`
- `/candidates/*`
- `/applications/*`
- `/interviews/*`
- `/reports/*`
- `/settings/*`

---

## 🎨 Styling

- **TailwindCSS** - Utility-first CSS
- **Shadcn/ui** - Headless UI components
- **CSS Variables** - Theme support (dark/light)
- **Framer Motion** - Animasyonlar

---

## 📦 Teknoloji Stack

| Kategori | Teknoloji |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS, Shadcn/ui |
| **State** | Zustand |
| **Forms** | React Hook Form + Zod |
| **HTTP** | Axios |
| **Charts** | Recharts |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |

---

## 🔐 Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001/api
```

---

## 📂 Dosya Konvansiyonları

| Tür | Konvansiyon | Örnek |
|-----|-------------|-------|
| Components | PascalCase | `InterviewCard.tsx` |
| Hooks | camelCase + use prefix | `useAuth.tsx` |
| Services | camelCase + Service suffix | `authService.ts` |
| Stores | camelCase + Store suffix | `authStore.ts` |
| Types | PascalCase | `Candidate` |
| Utils | camelCase | `tokenUtils.ts` |

---

## 🚀 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

---

## 🌍 Deployment

Vercel ile CI/CD pipeline üzerinden otomatik deployment.

```bash
# Production build
npm run build

# Vercel deploy
vercel --prod
```

---

## 🧪 Test (Planlanıyor)

- **Jest + RTL** - Unit tests
- **Cypress/Playwright** - E2E tests
- **MSW** - API mocking

---

## 👨‍💻 Geliştirici Rehberi

### Yeni Component Ekleme

1. `components/[feature]/` klasöründe oluştur
2. TypeScript props interface tanımla
3. Shadcn/ui bileşenlerini kullan
4. README'ye ekle

### Yeni Service Ekleme

1. `services/` klasöründe `[name]Service.ts` oluştur
2. API endpoint'lerini tanımla
3. Types klasöründe tipleri oluştur
4. README'ye ekle

### Yeni Store Ekleme

1. `store/` klasöründe `[name]Store.ts` oluştur
2. State ve actions tanımla
3. Service entegrasyonu yap
4. README'ye ekle

---

## 📖 Ek Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

---

## 📝 Lisans

Bu proje özel kullanım içindir.
