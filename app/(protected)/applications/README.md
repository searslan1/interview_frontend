Applications Modülü
🔍 Sayfa 1: app/(protected)/applications/page.tsx
🎯 Amaç:
Başvuru listesini sıralama, filtreleme ve önizleme fonksiyonlarıyla birlikte gösterir.

Kullanıcı, başvurular arasında arama yapabilir, sıralama ölçütüne göre dizilim değiştirebilir, bir başvuruyu detaylı olarak inceleyebilir.

📌 Bileşenler:

Bileşen Açıklama
AdvancedFilters Başvuru listesi üzerinde detaylı filtreleme yapılmasını sağlar.
Select Başvuruların sıralama kriterini değiştirir. (örneğin: AI skoruna göre)
ApplicationList Başvuru kartlarını liste halinde gösterir. Sonsuz kaydırma (infinite scroll) desteklenir.
ApplicationPreviewDialog Tıklanan bir başvurunun detaylı önizlemesini dialog içerisinde gösterir.
LoadingSpinner Sayfa yüklenirken gösterilir.
🔁 Veri ve State Yapısı

Katman Görev
useApplicationStore Global state yöneticisi. applications, fetchApplications, loading
filters (state) UI üzerinde kullanılan filtre değerleri (şu an backend'e yansıtılmıyor!)
sortBy, sortOrder Sıralama kontrolü sağlar. UI'da seçilir ama veri kaynağında karşılığı eksik.
intObserver IntersectionObserver ile sonsuz scroll izlenir ancak veriye göre sayfalama yapılmıyor.
⚠️ Geliştiriciye Kritik Notlar

Eksik / Hatalı / Geliştirilebilir Açıklama
❌ Filtreler backend’e gönderilmiyor. fetchApplications(filters) şeklinde çalışmıyor. Tüm veriyi çekip front-end'de filtreleme yapılmakta. Performans sorunu doğurur.
❌ Sonsuz scroll optimizasyonu eksik. Observer tetiklenince her seferinde fetchApplications() çağrılıyor ama cursor/offset parametresi yok. Her seferinde aynı veri tekrar çekilebilir.
🧪 Filtrelenmiş/sıralanmış veri önizlemesi test edilmemiş. Örneğin: "En yüksek AI skoru" seçildiğinde gerçekten bu skora göre sıralanıyor mu? Backend destekli mi?
🔁 Aynı başvurular yeniden render ediliyor olabilir. Memoization (useMemo) veya key tanımlamaları kontrol edilmeli.
🧱 ApplicationList çok fazla sorumluluğa sahip olabilir. Genişlemeye açık yapılarda (AI analizi, başvuru evresi vs.) alt bileşenlere bölünmeli.
❌ Boş/eksik state durumları için UX mesajı eksik. "Başvuru bulunamadı" veya "sonuç yok" gibi kullanıcıya yardımcı UI elemanları gösterilmiyor.
🧠 AI score alanı sadece sıralama için var. Görsel sunumu zayıf. overallScore değeri progress bar, renk skalası, yıldız puan vs. ile gösterilebilir.
🧾 Sayfa 2: app/(protected)/applications/[id]/page.tsx (Aday Detayı)
🎯 Amaç:
Seçilen başvuruya ait adayın detaylı bilgilerinin gösterildiği sayfadır.

Kullanıcı adayı favorilere ekleyebilir.

📌 Bileşenler:

Bileşen Açıklama
CandidateDetailReview Adayın AI analizi, geçmişi, kişilik tipi, video kaydı gibi detayları içerir.
Header Genel uygulama menüsü
Button + Star Adayı favori listesine eklemek için toggle butonu
⚠️ Geliştiriciye Kritik Notlar

Eksik / Hatalı / Geliştirilebilir Açıklama
❌ Gerçek veri çekilmiyor. Şu an tamamen mock data kullanılıyor. fetchCandidateById(id) gibi bir service yok.
🔒 Kişisel veri güvenliği riski Detay sayfasında tüm veriler açık. Erişim kontrolü, rol bazlı görünürlük veya loglama mekanizması düşünülmeli.
❌ Favori ekleme geçici ve UI odaklı. Kalıcı bir backend ile senkronizasyon yok. Refresh sonrası favori aday kaybolabilir.
🔄 Veri yedekleme yok. CandidateDetailReview bileşeni sadece candidate prop’una bağlı. Kötü veriyle render riski var. Null kontrol eksik olabilir.
📈 Video URL statik. Adayların video içerikleri backend’den gelmeli, CDN bağlantıları ile gösterilmeli.
📤 Yönlendirme / paylaşım yok. Aday profili, panel üzerinden farklı kullanıcıya yönlendirilemiyor. Paylaşılabilir bir bağlantı mantığı düşünülmeli.
✅ Geliştirici İçin Önerilen Gelişim Planı

Adım Açıklama

1. fetchApplications(filters, sort, page) gibi backend destekli API’yi tanımla.
2. ApplicationList içinde useMemo, pagination, empty state ve error state senaryolarını tanımla.
3. ApplicationPreviewDialog bileşeninde AI detaylarını yeniden kullanılabilir hale getir.
4. /applications/[id] sayfası için fetchCandidateById() servisi yaz, mock’tan çık.
5. Favori adaylar store’unu backend ile senkronize et. Kalıcı favori listesi olsun.
6. UI optimizasyonu: AI skoruna göre badge, renkli gösterim, sıralama ikonu gibi UI geri bildirimleri ekle.
   Bu modül, hem sistemin en çok veriyle uğraşan kısmı hem de kullanıcıya yapay zekâ destekli içgörü sağlayan katman olduğu için teknik borçlar birikmeye en müsait alanlardan biri. Bu yüzden yapısal refactor süreci özellikle bu modülde iyi planlanmalı.
