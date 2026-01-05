# 📱 App Module - Next.js Routing & Pages

## 📋 Genel Bakış

Bu modül, Next.js 13+ App Router mimarisini kullanarak uygulamanın tüm sayfa yapısını ve routing mantığını yönetir. HR-AI İnsan Kaynakları Yönetim Paneli'nin ana navigasyon ve sayfa düzenini içerir.

## 🏗️ Mimari Yapı

```
app/
├── layout.tsx              # Root layout - tüm sayfalar için ana wrapper
├── page.tsx                # Landing page - ana giriş sayfası
├── globals.css             # Global CSS stilleri
├── README_Landing_Page.md  # Landing page dokümantasyonu
│
├── (protected)/            # Korumalı rotalar (giriş gerektirir)
│   ├── layout.tsx          # Protected layout - auth kontrolü
│   ├── dashboard/          # Dashboard modülü
│   ├── candidates/         # Aday yönetimi modülü
│   ├── applications/       # Başvuru yönetimi modülü
│   ├── interviews/         # Mülakat yönetimi modülü
│   └── reports/            # Raporlama modülü
│
├── (public)/               # Public rotalar (giriş gerektirmez)
│   ├── layout.tsx          # Public layout
│   ├── reset-password/     # Şifre sıfırlama
│   └── verify-email/       # E-posta doğrulama
│
└── api/                    # API Routes
    ├── README.md           # API dokümantasyonu
    └── chat/               # Chat API endpoint'i
        └── route.ts        # Chat route handler
```

## 🔐 Route Groups

### `(protected)` - Korumalı Rotalar

Authentication gerektiren tüm sayfaları içerir. Bu grubun layout'u şu özelliklere sahiptir:

- **Auth Kontrolü**: `useAuth` hook'u ile kullanıcı durumu kontrol edilir
- **Redirect**: Giriş yapılmamışsa landing page'e yönlendirilir
- **Loading State**: Auth kontrol edilirken loading spinner gösterilir
- **Dashboard Header**: Tüm korumalı sayfalarda ortak header

```tsx
// (protected)/layout.tsx örneği
export default function ProtectedLayout({ children }) {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);
  
  return (
    <div className="flex">
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}
```

### `(public)` - Public Rotalar

Giriş gerektirmeyen sayfaları içerir:

- **reset-password**: Şifre sıfırlama sayfası
- **verify-email**: E-posta doğrulama sayfası

## 📄 Sayfalar Detayı

### 1. Landing Page (`page.tsx`)

**Amaç**: Uygulamanın ana giriş noktası ve pazarlama sayfası

**Özellikler**:
- Framer Motion animasyonları
- Hero section with value proposition
- Nasıl çalışır bölümü
- Özellik kartları
- Login/Register modal yönetimi
- Otomatik dashboard yönlendirmesi (giriş yapıldıysa)

**Kullanılan Componentler**:
- `LandingPageHeader`
- `AuthModal`
- `RegisterModal`

---

### 2. Dashboard (`(protected)/dashboard/page.tsx`)

**Amaç**: Ana kontrol paneli - özet bilgiler ve hızlı aksiyonlar

**Özellikler**:
- KPI kartları (`OverviewStats`)
- Öne çıkan mülakat kartı
- Mülakat takvimi
- Aktif mülakatlar slider
- Son başvurular slider
- Grafikler (charts)
- Favori adaylar
- Bildirim paneli
- AI Chat asistanı

**State Management**: `useInterviewStore`

---

### 3. Candidates (`(protected)/candidates/page.tsx`)

**Amaç**: Talent Pool - Tüm adayların merkezi yönetimi

**Özellikler**:
- Aday listesi ve filtreleme
- Detay paneli (side panel)
- Favori yönetimi
- Durum güncelleme
- İstatistik kartları (toplam, favori, kısa liste, aktif)
- Sıralama ve sayfalama

**State Management**: `useCandidateStore`, `useFavoriteCandidatesStore`

---

### 4. Applications (`(protected)/applications/page.tsx`)

**Amaç**: Başvuru yönetimi - Netflix tarzı UI

**Özellikler**:
- Çoklu görünüm modu (Netflix, Grid, List, Table)
- Akıllı gruplama:
  - Son gelen başvurular
  - Yüksek AI skorlu adaylar
  - Favori adaylar
  - Değerlendirme bekleyenler
  - Pozisyon bazlı gruplar
- Detaylı başvuru modal
- Filtre bar

**State Management**: `useApplicationStore`, `useInterviewStore`, `useFavoriteCandidatesStore`

---

### 5. Interviews (`(protected)/interviews/page.tsx`)

**Amaç**: Mülakat oluşturma ve yönetimi

**Özellikler**:
- Mülakat listesi
- Filtreleme (durum, tip, tarih)
- Yeni mülakat oluşturma dialog
- Mülakat düzenleme
- Süre uzatma dialog
- Mülakat yayınlama

**State Management**: `useInterviewStore`

**Alt Sayfalar**:
- `[id]/` - Mülakat detay sayfası
- `add/` - Yeni mülakat ekleme

---

### 6. Reports (`(protected)/reports/page.tsx`)

**Amaç**: Stratejik analiz ve raporlama

**Özellikler**:
- Filtre bazlı raporlama
- KPI özet strip
- Pozisyon analizi grafiği
- Aday dağılım grafikleri
- Soru etkinlik analizi
- AI-HR uyum grafiği
- Zaman trendi grafikleri
- PDF export

**State Management**: `useReportingStore`

## 🛣️ API Routes

### Chat API (`api/chat/route.ts`)

AI chat asistanı için server-side API endpoint'i.

```typescript
// POST /api/chat
// Request body: { message: string, context?: object }
// Response: { response: string, suggestions?: string[] }
```

## 🎨 Layout Hiyerarşisi

```
RootLayout (app/layout.tsx)
├── ClientQueryProvider (React Query)
├── ThemeProvider (Dark/Light mode)
├── Toaster (Toast notifications)
│
├── (protected)/layout.tsx
│   ├── DashboardHeader
│   └── Page Content
│
└── (public)/layout.tsx
    └── Centered Card Layout
```

## 📦 Dependencies

### Required Packages
- `next` - Next.js framework
- `react` - React library
- `framer-motion` - Animasyonlar
- `lucide-react` - İkonlar

### Internal Dependencies
- `@/components/*` - UI componentleri
- `@/store/*` - Zustand stores
- `@/hooks/*` - Custom hooks
- `@/types/*` - TypeScript tipleri

## 🔧 Konfigürasyon

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=http://localhost:3001/api
```

### Next.js Config
```javascript
// next.config.mjs
export default {
  // ... configuration
}
```

## 📱 Responsive Design

Tüm sayfalar responsive tasarıma sahiptir:
- **Mobile**: Single column layout
- **Tablet**: 2 column grid
- **Desktop**: Full layout with sidebars

## 🚀 Performance

- **Code Splitting**: Her sayfa otomatik olarak ayrı bundle
- **Lazy Loading**: Componentler ihtiyaç duyulduğunda yüklenir
- **ISR/SSR**: Gerekli sayfalarda server-side rendering

## 📝 Best Practices

1. **Route Groups**: `(protected)` ve `(public)` ile mantıksal gruplama
2. **Loading States**: Her sayfada loading durumu yönetimi
3. **Error Boundaries**: Hata yakalama ve kullanıcı bilgilendirme
4. **SEO**: Metadata tanımlamaları
5. **Accessibility**: ARIA labels ve keyboard navigation
