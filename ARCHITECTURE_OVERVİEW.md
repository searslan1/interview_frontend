# Interview App – Yapı Rehberi

## 1. Sayfa Yapısı

- `app/(public)` → Giriş, kayıt, şifre sıfırlama gibi herkese açık sayfalar
- `app/(protected)` → Giriş yapmış kullanıcıların göreceği sayfalar (dashboard, adaylar, mülakatlar)

## 2. Bileşenler

### `components/interview/`

- Mülakat oluşturma, soru yönetimi ve yapay zeka analizleri burada
- Örn: `AIQuestionCreation.tsx`, `InterviewPreview.tsx`

### `components/candidate/`

- Aday listeleme ve analiz ekranları
- Örn: `candidate-detail-popup.tsx`, `ai-detailed-reports.tsx`

### `components/dashboard/`

- Ana ekran için istatistik, takvim, grafik bileşenleri
- Örn: `OverviewStats.tsx`, `InterviewCalendar.tsx`

## 3. State Yönetimi

- Tüm global state’ler `store/` dizinindedir (Zustand)
- Örn: `candidateStore.ts` → aday filtreleme ve listeleme
- Lokal state’ler çoğunlukla modallarda kullanılır

## 4. API Servisleri

- Her modülün kendi `Service` dosyası var (`services/`)
- Async işlemler burada soyutlanır → `authService`, `interviewService`

## 5. Hooklar

- `useAuth()` → kullanıcı oturumu
- `useApplication()` → başvuruya dair context işlemleri

## 6. UI Bileşenleri

- `components/ui/` → ShadCN tabanlı ortak UI parçaları
- Örn: `button.tsx`, `dialog.tsx`, `accordion.tsx`
