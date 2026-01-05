# 🧩 Components Module - UI Bileşenleri

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nin tüm UI bileşenlerini içerir. Atomic Design prensipleri ile organize edilmiş olup, yeniden kullanılabilir ve modüler bir yapıya sahiptir.

## 🏗️ Mimari Yapı

```
components/
├── ui/                         # 🎨 Temel UI bileşenleri (Shadcn/ui)
├── applications/               # 📋 Başvuru yönetimi bileşenleri
├── candidate/                  # 👤 Aday yönetimi bileşenleri
├── charts/                     # 📊 Grafik bileşenleri
├── dashboard/                  # 🏠 Dashboard bileşenleri
├── interview/                  # 🎤 Mülakat yönetimi bileşenleri
├── notifications/              # 🔔 Bildirim bileşenleri
├── reporting/                  # 📈 Raporlama bileşenleri
├── settings/                   # ⚙️ Ayarlar bileşenleri
│
├── Header.tsx                  # Ana navigation header
├── LandingPageHeader.tsx       # Landing page header
├── AuthModal.tsx               # Giriş modal
├── RegisterModal.tsx           # Kayıt modal
├── ForgotPasswordModal.tsx     # Şifre sıfırlama modal
├── VerifyEmailPage.tsx         # E-posta doğrulama sayfası
├── ClientQueryProvider.tsx     # React Query provider
├── theme-provider.tsx          # Tema provider
├── settings-dialog.tsx         # Ayarlar dialog
├── ai-analysis-card.tsx        # AI analiz kartı
└── ai-recommendations.tsx      # AI önerileri
```

---

## 🎨 UI Components (`/ui`)

Shadcn/ui tabanlı temel UI bileşenleri. Tamamen özelleştirilebilir ve tema desteği içerir.

### Mevcut Bileşenler

| Bileşen | Açıklama | Kullanım |
|---------|----------|----------|
| `accordion.tsx` | Açılır/kapanır içerik paneli | FAQ, detay bölümleri |
| `alert.tsx` | Uyarı mesajları | Bilgilendirme, hata |
| `alert-dialog.tsx` | Onay dialog'u | Silme, kritik işlemler |
| `avatar.tsx` | Kullanıcı avatarı | Profil gösterimi |
| `badge.tsx` | Etiket/rozet | Durum göstergesi |
| `button.tsx` | Buton bileşeni | Tüm aksiyonlar |
| `calendar.tsx` | Takvim | Tarih seçimi |
| `card.tsx` | Kart container | İçerik grupları |
| `checkbox.tsx` | Onay kutusu | Form elemanı |
| `dialog.tsx` | Modal dialog | Pop-up içerikler |
| `dropdown-menu.tsx` | Açılır menü | Navigasyon, seçenekler |
| `form.tsx` | Form wrapper | React Hook Form entegrasyonu |
| `input.tsx` | Metin girişi | Form elemanı |
| `label.tsx` | Etiket | Form elemanı |
| `popover.tsx` | Pop-over | Tooltip, bilgi |
| `progress.tsx` | İlerleme çubuğu | Yükleme durumu |
| `select.tsx` | Seçim kutusu | Dropdown seçimi |
| `skeleton.tsx` | Yükleme placeholder | Loading state |
| `slider.tsx` | Kaydırıcı | Değer seçimi |
| `switch.tsx` | Toggle switch | Boolean değerler |
| `table.tsx` | Tablo | Veri listesi |
| `tabs.tsx` | Sekme navigasyonu | İçerik grupları |
| `textarea.tsx` | Çok satırlı giriş | Uzun metinler |
| `toast.tsx` | Bildirim toast | Feedback mesajları |
| `tooltip.tsx` | İpucu | Yardım metni |

### Özel UI Bileşenleri

```typescript
// LoadingSpinner.tsx - Özel loading komponenti
export function LoadingSpinner() {
  return <div className="animate-spin..." />;
}

// date-picker.tsx - Tarih seçici
// date-range-picker.tsx - Tarih aralığı seçici
// chart.tsx - Recharts wrapper
```

---

## 📋 Applications Components (`/applications`)

Başvuru yönetimi için özel bileşenler.

### Dosya Yapısı

```
applications/
├── AdvancedFilters.tsx         # Gelişmiş filtre paneli
├── ApplicationList.tsx          # Başvuru listesi
├── ApplicationManager.tsx       # Başvuru yönetici
├── ApplicationPreviewDialog.tsx # Başvuru önizleme
├── InfiniteScroll.tsx          # Sonsuz kaydırma
├── candidate-detail-card.tsx    # Aday detay kartı
│
└── netflix/                     # Netflix tarzı UI
    ├── index.ts                 # Export barrel
    ├── ApplicationCard.tsx      # Başvuru kartı
    ├── ApplicationModal.tsx     # Detay modal
    ├── ApplicationRow.tsx       # Yatay slider row
    ├── NetflixFilterBar.tsx     # Filtre bar
    └── categories/              # Kategori bileşenleri
```

### Netflix UI Pattern

```tsx
// ApplicationRow.tsx - Horizontal scrolling row
<ApplicationRow 
  title="Son Gelen Başvurular"
  applications={recentApplications}
  onSelect={handleSelect}
/>

// ApplicationCard.tsx - Hover effect card
<ApplicationCard 
  application={app}
  onHover={showPreview}
  onClick={openModal}
/>
```

### Bileşen Açıklamaları

| Bileşen | Amaç | Props |
|---------|------|-------|
| `ApplicationList` | Tablo formatında liste | `applications`, `onSelect`, `filters` |
| `AdvancedFilters` | Multi-select filtreler | `filters`, `onFilterChange` |
| `ApplicationPreviewDialog` | Detaylı önizleme | `application`, `open`, `onClose` |
| `InfiniteScroll` | Lazy loading | `loadMore`, `hasMore`, `children` |

---

## 👤 Candidate Components (`/candidate`)

Aday yönetimi (Talent Pool) bileşenleri.

### Dosya Yapısı

```
candidate/
├── CandidateList.tsx           # Aday listesi
├── candidate-card.tsx          # Aday kartı
├── candidate-details.tsx       # Aday detayları
├── candidate-detail-popup.tsx  # Detay popup
├── candidate-detail-review.tsx # İnceleme görünümü
├── candidate-filters.tsx       # Filtre bileşeni
├── candidate-management.tsx    # Yönetim paneli
├── candidate-slider.tsx        # Yatay slider
├── video-player.tsx            # Video oynatıcı
├── video-transcript.tsx        # Video transkript
│
├── ai-detailed-reports.tsx     # AI detaylı raporlar
├── ai-general-analysis.tsx     # AI genel analiz
├── ai-report.tsx               # AI rapor kartı
│
└── pool/                       # Talent Pool bileşenleri
    ├── index.ts                # Export barrel
    ├── CandidatePoolList.tsx   # Pool listesi
    ├── CandidateRow.tsx        # Aday satırı
    ├── CandidateDetailPanel.tsx # Detay paneli
    └── CandidateFilterBar.tsx  # Filtre bar
```

### Temel Kullanım

```tsx
// Talent Pool sayfasında
import { 
  CandidateFilterBar, 
  CandidatePoolList, 
  CandidateDetailPanel 
} from "@/components/candidate/pool";

<CandidateFilterBar onFilterChange={setFilters} />
<CandidatePoolList 
  candidates={filteredCandidates}
  onSelect={setSelectedCandidate}
/>
<CandidateDetailPanel 
  candidate={selectedCandidate}
  onClose={handleClose}
/>
```

### Video Bileşenleri

```tsx
// video-player.tsx - Mülakat video oynatıcı
<VideoPlayer 
  src={videoUrl}
  onTimeUpdate={handleTimeUpdate}
  markers={answerMarkers}
/>

// video-transcript.tsx - Senkronize transkript
<VideoTranscript 
  transcript={transcript}
  currentTime={currentTime}
  onSeek={handleSeek}
/>
```

---

## 📊 Charts Components (`/charts`)

Dashboard ve raporlama grafikleri.

### Dosya Yapısı

```
charts/
├── daily-applications-chart.tsx      # Günlük başvuru grafiği
├── experience-distribution-chart.tsx # Deneyim dağılımı
├── interview-success-rate-chart.tsx  # Mülakat başarı oranı
└── sector-distribution-chart.tsx     # Sektör dağılımı
```

### Kullanılan Kütüphane

Tüm grafikler **Recharts** kütüphanesi ile oluşturulmuştur.

```tsx
// daily-applications-chart.tsx örneği
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export function DailyApplicationsChart({ data }) {
  return (
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
    </LineChart>
  );
}
```

---

## 🏠 Dashboard Components (`/dashboard`)

Ana kontrol paneli bileşenleri.

### Dosya Yapısı

```
dashboard/
├── OverviewStats.tsx           # KPI kartları
├── DashboardCharts.tsx         # Grafik container
├── InterviewCalendar.tsx       # Mülakat takvimi
├── InterviewSlider.tsx         # Aktif mülakatlar slider
├── ApplicationSlider.tsx       # Son başvurular slider
├── FavoriteCandidates.tsx      # Favori adaylar
├── NotificationPanel.tsx       # Bildirim paneli
├── ChatAssistant.tsx           # AI chat asistanı
│
├── AppointmentForm.tsx         # Randevu formu
├── AppointmentList.tsx         # Randevu listesi
├── CalendarView.tsx            # Takvim görünümü
│
├── hero-section.tsx            # Hero bölümü
├── featured-interview.tsx      # Öne çıkan mülakat
├── dashboard-filters.tsx       # Filtreler
└── dashboard-header.tsx        # Dashboard header
```

### KPI Kartları

```tsx
// OverviewStats.tsx
export function OverviewStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Toplam Başvuru" value={1234} change={+12.5} />
      <StatCard title="Aktif Mülakat" value={23} change={+5} />
      <StatCard title="Bu Hafta" value={89} change={-3.2} />
      <StatCard title="Değerlendirme Bekleyen" value={45} />
    </div>
  );
}
```

### Chat Asistanı

```tsx
// ChatAssistant.tsx - Floating AI chat
<ChatAssistant 
  position="bottom-right"
  initialMessage="Merhaba! Size nasıl yardımcı olabilirim?"
/>
```

---

## 🎤 Interview Components (`/interview`)

Mülakat yönetimi bileşenleri.

### Dosya Yapısı

```
interview/
├── InterviewCard.tsx               # Mülakat kartı
├── InterviewDetails.tsx            # Detay görünümü
├── InterviewGeneralInfo.tsx        # Genel bilgi formu
├── InterviewPreview.tsx            # Önizleme
├── InterviewPublishControl.tsx     # Yayın kontrolü
├── InterviewQuestionManager.tsx    # Soru yöneticisi
│
├── create-interview-dialog.tsx     # Oluşturma dialog
├── interview-list.tsx              # Mülakat listesi
├── interview-slider.tsx            # Mülakat slider
├── interview-statistics.tsx        # İstatistikler
├── interview-details-form.tsx      # Detay formu
│
├── filter-section.tsx              # Filtre bölümü
├── ExtendDurationDialog.tsx        # Süre uzatma
├── ApplicationManagement.tsx       # Başvuru yönetimi
├── EvaluationSettings.tsx          # Değerlendirme ayarları
├── PublishSettings.tsx             # Yayın ayarları
│
├── question-form.tsx               # Soru formu
├── question-list.tsx               # Soru listesi
├── question-manager.tsx            # Soru yöneticisi
├── question-review.tsx             # Soru inceleme
├── question-selector.tsx           # Soru seçici
├── question-table.tsx              # Soru tablosu
│
├── AIQuestionCreation.tsx          # AI soru oluşturma
├── AICandidateAnalysis.tsx         # AI aday analizi
├── AIPrePublishCheck.tsx           # AI yayın öncesi kontrol
└── ai-question-generator.tsx       # AI soru üretici
```

### Mülakat Oluşturma Flow

```tsx
// create-interview-dialog.tsx - Multi-step form
<CreateInterviewDialog open={isOpen} onOpenChange={setIsOpen}>
  <Tabs value={activeTab}>
    <TabsList>
      <TabsTrigger value="general">Genel Bilgi</TabsTrigger>
      <TabsTrigger value="questions">Sorular</TabsTrigger>
      <TabsTrigger value="evaluation">Değerlendirme</TabsTrigger>
      <TabsTrigger value="publish">Yayınlama</TabsTrigger>
    </TabsList>
    
    <TabsContent value="general">
      <InterviewGeneralInfo form={form} />
    </TabsContent>
    <TabsContent value="questions">
      <AIQuestionCreation form={form} />
    </TabsContent>
    {/* ... */}
  </Tabs>
</CreateInterviewDialog>
```

### AI Özellikleri

```tsx
// AIQuestionCreation.tsx - AI destekli soru oluşturma
<AIQuestionCreation 
  position={selectedPosition}
  competencies={competencyWeights}
  onQuestionsGenerated={handleQuestions}
/>

// AICandidateAnalysis.tsx - Aday AI analizi
<AICandidateAnalysis 
  candidateId={candidate._id}
  interviewResponses={responses}
/>
```

---

## 🔔 Notifications Components (`/notifications`)

Bildirim sistemi bileşenleri.

```
notifications/
└── NotificationList.tsx    # Bildirim listesi
```

```tsx
// NotificationList.tsx
<NotificationList 
  notifications={notifications}
  onMarkRead={handleMarkRead}
  onDelete={handleDelete}
/>
```

---

## 📈 Reporting Components (`/reporting`)

Raporlama ve analitik bileşenleri.

### Dosya Yapısı

```
reporting/
├── reporting-filters.tsx           # Rapor filtreleri
├── kpi-summary-strip.tsx          # KPI özet strip
├── general-statistics.tsx          # Genel istatistikler
│
├── position-overview-chart.tsx     # Pozisyon analizi
├── candidate-distribution-charts.tsx # Aday dağılımı
├── question-effectiveness-chart.tsx  # Soru etkinliği
├── ai-hr-alignment-chart.tsx       # AI-HR uyumu
├── time-trends-chart.tsx           # Zaman trendleri
│
├── interview-quality-analysis.tsx  # Mülakat kalitesi
├── candidate-analysis.tsx          # Aday analizi
├── ai-recommendations.tsx          # AI önerileri
└── visualizations-and-graphs.tsx   # Görselleştirmeler
```

### Rapor Yapısı

```tsx
// ReportsPage örneği
<div className="space-y-12">
  <KPISummaryStrip />
  <PositionOverviewChart />
  <CandidateDistributionCharts />
  <QuestionEffectivenessChart />
  <AIHRAlignmentChart />
  <TimeTrendsChart />
</div>
```

---

## ⚙️ Settings Components (`/settings`)

Kullanıcı ayarları bileşenleri.

### Dosya Yapısı

```
settings/
├── ProfileSetting.tsx          # Profil ayarları
├── AccountSettings.tsx         # Hesap ayarları
├── NotificationSettings.tsx    # Bildirim ayarları
├── PrivacySettings.tsx         # Gizlilik ayarları
├── SubscriptionSettings.tsx    # Abonelik ayarları
├── CustomizationSettings.tsx   # Özelleştirme
└── AISettings.tsx              # AI ayarları
```

---

## 🔝 Root Level Components

### Header.tsx

Ana navigation header - tüm korumalı sayfalarda görünür.

```tsx
<Header>
  - Logo & Branding
  - Navigation Links (Dashboard, Mülakatlar, Başvurular, Aday Yönetimi, Raporlama)
  - Notification Bell (badge ile sayı)
  - Theme Toggle (dark/light)
  - User Menu (profil, ayarlar, çıkış)
</Header>
```

### AuthModal.tsx

Giriş modal bileşeni.

```tsx
<AuthModal 
  open={isOpen}
  onOpenChange={setIsOpen}
  onSwitchToRegister={handleSwitchToRegister}
/>
```

### RegisterModal.tsx

Kayıt modal bileşeni.

```tsx
<RegisterModal 
  open={isOpen}
  onOpenChange={setIsOpen}
  onSwitchToLogin={handleSwitchToLogin}
/>
```

### theme-provider.tsx

Next-themes entegrasyonu.

```tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="system" 
  enableSystem
>
  {children}
</ThemeProvider>
```

### ClientQueryProvider.tsx

React Query provider wrapper.

```tsx
<ClientQueryProvider>
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
</ClientQueryProvider>
```

---

## 🎯 Component Patterns

### 1. Compound Components

```tsx
// Card pattern
<Card>
  <CardHeader>
    <CardTitle>Başlık</CardTitle>
    <CardDescription>Açıklama</CardDescription>
  </CardHeader>
  <CardContent>
    İçerik
  </CardContent>
  <CardFooter>
    <Button>Aksiyon</Button>
  </CardFooter>
</Card>
```

### 2. Controlled Components

```tsx
// Form control pattern
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Başlık</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 3. Render Props

```tsx
// Dialog pattern
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogTrigger asChild>
    <Button>Aç</Button>
  </DialogTrigger>
  <DialogContent>
    {/* İçerik */}
  </DialogContent>
</Dialog>
```

---

## 📦 Dependencies

- **@radix-ui/react-*** - Headless UI primitives
- **class-variance-authority** - Variant styling
- **clsx** - Class name utility
- **tailwind-merge** - Tailwind class merging
- **framer-motion** - Animasyonlar
- **recharts** - Grafikler
- **react-hook-form** - Form yönetimi
- **zod** - Schema validation
- **lucide-react** - İkonlar

---

## 🎨 Styling Guidelines

1. **Tailwind CSS** kullanılır
2. **CSS Variables** ile tema desteği
3. **Responsive Design** - mobile-first yaklaşım
4. **Dark Mode** - tüm bileşenler destekler
5. **Accessibility** - ARIA labels, keyboard navigation

```tsx
// Örnek styling
className={cn(
  "flex items-center gap-2",
  "rounded-lg border p-4",
  "bg-card text-card-foreground",
  "hover:bg-accent transition-colors",
  isActive && "border-primary"
)}
```
