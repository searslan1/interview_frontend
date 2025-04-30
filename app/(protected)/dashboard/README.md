Dashboard Modülü
📁 Dosya:
app/(protected)/dashboard/page.tsx

🎯 Amaç:
Kullanıcının işe alım performansını, istatistikleri, aday/mülakat durumlarını özet halinde görebileceği bir kontrol panelidir.

🧩 Kullanılan Bileşenler:

Bileşen Açıklama
OverviewStats Başvuru, mülakat, başarı oranı gibi özet KPI’lar
InterviewCard Öne çıkarılmış bir mülakat (en güncel/önemli)
InterviewCalendar Yaklaşan mülakatların takvim görünümü
InterviewSlider Seçili mülakatları yatay gösterir
ApplicationSlider Başvuruların kısa görünümü
DashboardCharts Grafiksel özet: sektör, zaman, başarı oranı
FavoriteCandidates Sık izlenen adaylar listesi
NotificationPanel En son sistem bildirimleri
ChatAssistant GPT destekli panel içi asistan
🔁 State & Veri Kaynağı
useInterviewStore şu an tüm mülakatları getiriyor:
🔥 Bu dashboard için fazla veri ve gereksiz yük oluşturur.

fetchInterviews() fonksiyonu yerine, dashboard’a özel optimize edilmiş bir API çağrısı kullanılmalı.

❌ Tespit Edilen Eksikler ve Geliştirme Notları

Eksik veya Sorun Açıklama / Çözüm
🔄 Tüm mülakatları fetch etmesi Dashboard için özel bir API endpoint: GET /api/dashboard/interviews?limit=3 gibi sınırlandırılmış veri
🧠 Dashboard'a özel servis katmanı eksik dashboardService.ts gibi bir servis dosyası oluşturulmalı (getDashboardStats, getRecentInterviews, getNotificationFeed vs.)
🧩 Kod yapısında bileşen-API bağımsızlığı yok Her bileşen kendi datasını çekmeli ya da props ile veri almalı. Örn: InterviewCard içinde veri fetch etmemeli
🛠️ Error state ve empty state eksik InterviewCard, InterviewSlider gibi bileşenlerde hata oluşması ya da veri olmaması durumuna dair kullanıcı mesajı eklenmeli
🗂 Veri önceliklendirmesi yok En güncel ya da en acil mülakatları seçmek için backend sorting kriterleri belirlenmeli (örn: status=upcoming&sort=date)
✅ Yeni Geliştiriciye Yönlendirme

Hedef Nereden başlamalı
Yeni API endpoint’leri bağlamak services/dashboardService.ts → burada getOverviewStats(), getLatestInterviews() fonksiyonları tanımlanır
Takvimde farklı veri göstermek InterviewCalendar.tsx bileşeni düzenlenir
Yeni bileşen eklemek page.tsx içinde yeni grid row / column açılarak bileşen eklenebilir
Mevcut bileşene yeni props InterviewCard → interview.highlight gibi props genişletilebilir
🔧 Yapılacaklar Listesi (Dashboard’a Özgü)
services/dashboardService.ts dosyasını oluştur

fetchDashboardInterviews() fonksiyonu yaz ve limit=3, status=upcoming gibi filtre uygula

useDashboardStore gibi özel bir Zustand store yazılabilir (opsiyonel)

Her bileşeni props ile besle → doğrudan store’dan veri çekmemeli

InterviewCard ve Slider bileşenlerinde boş veri ve hata durumu için UI göster
