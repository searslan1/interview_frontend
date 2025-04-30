# Interview App Frontend

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

## 🧱 Proje Yapısı

```
.
├── app/                # Sayfa rotaları (Next.js App Router)
│   ├── (public)        # Giriş, kayıt, şifre sıfırlama gibi herkese açık sayfalar
│   ├── (protected)     # Giriş yaptıktan sonra erişilen sayfalar (dashboard, candidates, interviews)
│   ├── api/            # API route'lar ("/api/chat" gibi)
│   └── layout.tsx      # Root layout
├── components/         # UI ve modül bileşenleri (dashboard, interview, candidate vs.)
├── hooks/              # Custom React hook'lar
├── lib/                # Genel yardımcı fonksiyonlar
├── middlewares/        # Middleware'lar (auth, error)
├── public/             # Statik dosyalar (görseller vs.)
├── services/           # API servis çağrıları (auth, interview vs.)
├── store/              # Zustand global state yöneticileri
├── styles/             # Tailwind ve global CSS
├── types/              # TypeScript tür tanımları
├── utils/              # API config, token ve validation yardımcıları
└── README.md
```

---

## 🔑 Giriş Noktaları

| Klasör / Dosya | Açıklama |
|----------------|------------|
| `app/(public)` | Login, register, verify-email, reset-password gibi açık sayfalar |
| `app/(protected)` | Yetki gerektiren sayfalar (dashboard, interviews, candidates, settings vs.) |
| `components/ui/` | Temel UI bileşenleri (button, modal, input, spinner vs.) |
| `services/` | API servis çağrılarının yapıldığı katman |
| `store/` | Global state yönetimi (zustand) |
| `components/interview/` | AI destekli mülakat bileşenleri |

---

## 👨‍💼 Geliştirici Kılavuzu

### 1. Kod Standartları
- Proje `TypeScript` ile yazılmıştır.
- Kodlar `ESLint` + `Prettier` kurallarına uygun formatlanmaktadır.
- UI bileşenleri `ShadCN` + `TailwindCSS` tabanlıdır.

### 2. Katkı Süreci
- Fork → Yeni branch → Geliştirme → Pull Request
- Kod yorumları ve commit mesajları **İngilizce** yazılmalıdır.

### 3. Dosya / Klasör Kurallıları
- Bileşenler `PascalCase`, dosyalar `kebab-case` ile adlandırılır.
- `components/feature-name/` altında modül bazlı gruplama bulunur.

---

## 📦 Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| Next.js (App Router) | Dosya tabanlı yönlendirme ve SSR desteği |
| TailwindCSS | Utility-first stil kütüphanesi |
| TypeScript | Tip güvenliği |
| Zustand | Global state yönetimi |
| ShadCN UI | Headless UI + Tailwind bileşenleri |
| Vercel | Otomatik deployment ortamı |

---

## 🔮 Test Altyapısı _(Planlanıyor)_

- **Jest + React Testing Library**: UI bileşen testleri
- **Cypress / Playwright**: E2E testler
- **MSW**: Mock servis entegrasyonu

---

## 🌍 Deployment

Bu uygulama Vercel ile CI/CD pipeline üzerinden otomatik olarak yayına alınır.

```bash
# Production için build alın
npm run build
```

---

## 💡 Notlar
- Bu README dosyası, projenin anlaşılabilirliğini artırmak için hazırlanmıştır.
- Projeye yeni başlayan geliştiricilerin `MODULE_GUIDE.md` ve `Developer Roadmap` dokümanlarına da göz atması önerilir.

