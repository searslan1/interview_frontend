Interview App Frontend

Bu proje, yapay zeka destekli mülakat süreçlerini dijital ortama taşıyan kapsamlı bir insan kaynakları yönetim sisteminin frontend tarafını içerir. Next.js (App Router), TailwindCSS, TypeScript ve Zustand kullanılarak geliştirilmiştir.

🚀 Hızlı Başlangıç

# Bağımlılıkları yükleyin

npm install

# Geliştirme sunucusunu başlatın

npm run dev

Tarayıcınızda http://localhost:3000 adresini ziyaret edin.

🧱 Proje Yapısı

.
├── app/ # Sayfa rotaları (Next.js App Router)
│ ├── (public) # Giriş, kayıt, şifre sıfırlama gibi herkese açık sayfalar
│ ├── (protected) # Giriş yaptıktan sonra erişilen sayfalar (dashboard, candidates, interviews)
│ ├── api/ # API route'lar (örn: /api/chat)
│ └── layout.tsx # Root layout
├── components/ # UI ve modül bileşenleri (dashboard, interview, candidate vs.)
├── hooks/ # Custom React hook'lar
├── lib/ # Genel yardımcı fonksiyonlar
├── middlewares/ # Middleware'lar (auth, error)
├── public/ # Statik dosyalar (görseller vs.)
├── services/ # API servis çağrıları (auth, interview vs.)
├── store/ # Zustand global state yöneticileri
├── styles/ # Tailwind ve global CSS
├── types/ # TypeScript tür tanımları
├── utils/ # API config, token ve validation yardımcıları
└── README.md

🔑 Giriş Noktaları

Klasör / Dosya

Açıklama

app/(public)

Login, register, verify-email, reset-password gibi açık sayfalar

app/(protected)

Yetki gerektiren sayfalar (dashboard, interviews, candidates, settings vs.)

components/ui/

Buton, modal, input, spinner gibi temel UI bileşenleri (shadcn/ui bazlı)

services/

Backend API'leriyle haberleşen servis dosyaları (örn: authService.ts)

store/

Global state yönetimi için zustand store’lar

components/interview/

AI destekli mülakat soru üretimi, istatistikler, kartlar

👨‍💻 Geliştirici Kılavuzu

1. Kod Standartları

Proje TypeScript ile yazılmıştır.

Kod formatı ESLint + Prettier kurallarına uygundur.

UI bileşenleri ShadCN + TailwindCSS kullanılarak oluşturulmuştur.

2. Katkı Süreci

Fork → Yeni branch → Geliştirme → PR

Kod yorumları ve commit mesajları İngilizce yazılmalıdır.

3. Dosya / Klasör İsimlendirme Kuralları

Bileşenler PascalCase, dosyalar kebab-case formatındadır.

components/feature-name/ altında modül bazlı gruplanır.

📦 Kullanılan Teknolojiler

Teknoloji

Açıklama

Next.js (App Router)

Dosya tabanlı yönlendirme ve SSR desteği

TailwindCSS

Utility-first stil kütüphanesi

TypeScript

Tip güvenliği ve geliştirme deneyimi

Zustand

Global state yönetimi

ShadCN UI

Tailwind ile entegre headless UI bileşenleri

Vercel

Otomatik deployment altyapısı

🧪 Test Altyapısı (Planlanıyor)

Jest + React Testing Library: UI bileşen testleri için

Cypress / Playwright: E2E testler için

msw: Mock servisler için (isteğe bağlı)

📊 Yol Haritası

🧠 Katkı Sağlayanlar

Rol

İsim

👤 CEO / PO

Adınız

👨‍💻 Frontend

Developer1

🎨 UI/UX

DesignerName

🤖 AI Dev

ML EngineerName

🌍 Deployment

Bu proje Vercel ile CI/CD pipeline üzerinden otomatik olarak dağıtılır.

# Production build için:

npm run build

🛠 README, projenin sürdürülebilirliğini ve geliştirilebilirliğini artırmak için kapsamlı hazırlanmıştır. Projeye yeni dahil olan geliştiriciler için sonraki adım: dev-roadmap.md (Yol Haritası) dosyasıdır.
