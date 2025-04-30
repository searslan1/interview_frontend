# MODULE_GUIDE.md

Bu doküman, her modülün sorumluluklarını, kullandığı bileşenleri, state yönetimini ve ilgili API servislerini özetler. Yeni geliştiricilerin modüller arası geçişi daha kolay yapabilmesi için hazırlanmıştır.

---

## 📁 Interviews Modülü

**📍 Yol:** `app/(protected)/interviews/`

### 🔍 Amaç

Kullanıcının mülakat oluşturmasını, detayları yönetmesini, AI destekli soru üretmesini sağlar.

### 🔧 Ana Bileşenler

- `InterviewForm.tsx` – Yeni mülakat oluşturma
- `InterviewList.tsx` – Filtreli mülakat listesi
- `InterviewCard.tsx` – Mülakat kart görünümü
- `AIQuestionCreation.tsx` – GPT destekli soru üretimi
- `interview-statistics.tsx` – Performans analizleri

### 🔄 State

- Global: `interviewStore.ts`
- Lokal: Modal ve filtre durumları `useState`

### 🔌 API Servisleri

- `interviewService.ts`
  - `createInterview()`
  - `getUserInterviews()`
  - `getInterviewById()`
  - `updateInterview()`
  - `deleteInterview()`
  - `updateInterviewStatus()`

### 🧭 Başlangıç Noktası

- `interview-list.tsx` → Listeleme ve filtreleme mantığını öğren
- Form yapısı için `create-interview-dialog.tsx` dosyasını incele

---

## 📁 Applications Modülü

**📍 Yol:** `app/(protected)/applications/`

### 🔍 Amaç

Kullanıcının tüm başvuruları listelemesini, detayları görmesini ve filtrelemesini sağlar.

### 🔧 Ana Bileşenler

- `ApplicationList.tsx` – Başvuru listesi
- `ApplicationPreviewDialog.tsx` – Detay popup
- `AdvancedFilters.tsx` – Detaylı filtreleme

### 🔄 State

- Global: `applicationStore.ts`

### 🔌 API Servisleri

- `applicationService.ts`
  - `getApplications()`
  - `getApplicationById()`

### 🧭 Başlangıç Noktası

- `ApplicationList.tsx` + `ApplicationPreviewDialog.tsx`
- Sonsuz scroll vs filtre mantığını takip et

---

## 📁 Candidates Modülü

**📍 Yol:** `app/(protected)/candidates/`

### 🔍 Amaç

Başvuran adayların listelenmesi, filtrelenmesi ve değerlendirilmesi.

### 🔧 Ana Bileşenler

- `CandidateList.tsx` – Aday kartları
- `candidate-filters.tsx` – Aday filtreleri
- `candidate-detail-review.tsx` – Aday detay sayfası
- `video-player.tsx` – Aday video görüşme oynatıcı

### 🔄 State

- Global: `candidateStore.ts`

### 🔌 API Servisleri

- `candidateService.ts` (Gelecekte ayrıştırılacak)

### 🧭 Başlangıç Noktası

- Aday detay sayfasını anlamak için: `[id]/page.tsx`
- `CandidateList` bileşeninin filtreye tepkisi kritik

---

## 📁 Dashboard Modülü

**📍 Yol:** `app/(protected)/dashboard/`

### 🔍 Amaç

Genel özet, favori adaylar, istatistikler ve AI destekli asistan içeriğini sunar.

### 🔧 Ana Bileşenler

- `OverviewStats.tsx`
- `InterviewCalendar.tsx`
- `DashboardCharts.tsx`
- `FavoriteCandidates.tsx`
- `ChatAssistant.tsx`

### 🔄 State

- Global: `dashboardStore.ts` (planlanıyor)
- Lokal: Şimdilik store’lardan çekilen veriyle ilerliyor

### 🔌 API Servisleri

- Özel dashboard API endpoint’leri henüz ayrıştırılmadı (not olarak bırakıldı)

### 🧭 Başlangıç Noktası

- `dashboard/page.tsx` yapısını incele, ilk render ve conditional render mantığı önemli

---

## 📁 Auth / Public Modülleri

**📍 Yol:** `app/(public)/`

### 🔍 Amaç

Giriş, kayıt, e-posta doğrulama, şifre sıfırlama işlemleri

### 🔧 Ana Bileşenler

- `AuthModal.tsx`, `RegisterModal.tsx`
- `reset-password/page.tsx`, `verify-email/page.tsx`
- `authService.ts`

### 🔄 State

- Global: `authStore.ts`

### 🔌 API Servisleri

- `authService.ts`
  - `login()`, `register()`, `verifyEmail()`, `resetPassword()` vb.

### 🧭 Başlangıç Noktası

- `authStore` içinde token yönetimi ve kullanıcı bilgisinin güncellenmesini incele

---

## 📁 Reporting Modülü

**📍 Yol:** `components/reporting/`

### 🔍 Amaç

Adaylar, mülakatlar ve AI değerlendirmeleri üzerine veri görselleştirme sunmak

### 🔧 Ana Bileşenler

- `ai-recommendations.tsx`
- `candidate-analysis.tsx`
- `general-statistics.tsx`
- `reporting-filters.tsx`

### 🔄 State

- Global: `reportingStore.ts`

### 🧭 Başlangıç Noktası

- `general-statistics.tsx` + `reporting-filters.tsx` birlikte çalışıyor

---

## 📁 Settings Modülü

**📍 Yol:** `components/settings/`

### 🔍 Amaç

Kullanıcıların hesap, bildirim, abonelik ve AI ayarlarını düzenlemesi

### 🔧 Ana Bileşenler

- `AccountSettings.tsx`
- `NotificationSettings.tsx`
- `SubscriptionSettings.tsx`

### 🔄 State

- Global: `authStore` (tercihler burada)

### 🧭 Başlangıç Noktası

- `ProfileSetting.tsx` ile kullanıcı arayüzü ayarları anlaşılabilir

---

## 📁 Ortak Bileşenler & UI

**📍 Yol:** `components/ui/`

### Amaç

Tüm modüller arası tekrar kullanılabilir yapı taşlarını içerir. (Shadcn + Tailwind tabanlıdır.)

### Ana Örnekler

- `button.tsx`, `input.tsx`, `dialog.tsx`, `select.tsx`, `calendar.tsx`

---

## 📁 Middleware

- `authMiddleware.ts` → Token kontrolü ve yönlendirme
- `errorMiddleware.ts` → Hata yakalama (planlanıyor)

---

## 📁 API (Server Actions / Routes)

- `app/api/chat/route.ts` → AI destekli sohbet / görev önerisi

---

Geliştirici olarak yeni bir modülde çalışmaya başlamadan önce ilgili store → component → page sırasıyla dosyaları incelemeniz önerilir.

Her modül için store’ların ve servislerin senkron çalışması sağlanmalı, store’dan güncellenen verinin ilgili sayfalara yansıması kritik bir noktadır.

Detaylı rehber için README ve Developer Yol Haritası dokümanına göz atın.
