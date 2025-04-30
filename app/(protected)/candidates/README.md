Candidates Modülü
📁 Sayfa: app/(protected)/candidates/page.tsx
🎯 Amaç:
Adayların listelendiği ve filtrelenebildiği bir paneldir. İK yetkilisi buradan adaylara göz atabilir, filtre uygulayabilir ve detay sayfasına geçebilir (detay sayfası yoksa bu da eklenmeli).

🧩 Bileşenler:

Bileşen Açıklama
Header Uygulamanın genel üst menüsüdür
CandidateFilters Arama ve deneyim düzeyi gibi filtreleri barındırır
CandidateList Adayları liste olarak render eder
LoadingSpinner Yükleme sırasında gösterilir
🔁 Veri & State
Global state: useCandidateStore ile aday listesi çekilir (fetchCandidates()).

Lokal state: filters sadece front-end tarafında uygulanır.

Filtreleme: applyFilters fonksiyonu ile front-end üzerinde koşullar sağlandığında listeleme yapılır.

⚠️ Geliştirici Notları (Yarım Kalan ve Geliştirilmeye Açık Noktalar)

Sorun / Eksik Açıklama / Not
❌ Backend filtreleme yok experienceLevel, searchTerm sadece front-end’de filtreleniyor. API seviyesinde desteklenmiyor. Gerekli: GET /candidates?experience=mid&search=John gibi
📉 Performans sorunu riski Aday sayısı arttıkça tüm listeyi getirip client’ta filtrelemek verimsiz. Sayfalama (pagination) veya limit/offset desteklenmeli.
⚠️ Filtreleme fonksiyonu karmaşık applyFilters() fonksiyonu okunabilirliği düşük. useMemo + filter utils olarak ayrıştırılmalı.
🔁 Refetch yapılmıyor Filtre değiştiğinde veri yeniden fetch edilmiyor, sadece client içinde filtre uygulanıyor. Bu ileride yanılgı yaratabilir.
📄 Detay sayfası eksik olabilir Şu an CandidateList yalnızca liste gösteriyor gibi. Eğer bir "Aday Detayı" sayfası varsa, yönlendirme bağlantısı (Link) kontrol edilmeli. Yoksa: eksik.
❌ Feedback / Toast sistemi yok Hatalar sadece metin olarak veriliyor, kullanıcı deneyimi açısından toast mesajları tercih edilmeli.
📚 Tür tanımı eksik veya eksik import edilmiş import { Candidate, } satırında eksik bırakılmış bir tanım var gibi duruyor. Dökümantasyon eksikliği belirtisi.
✅ Geliştiriciye Yönlendirme

Yapılacak İşlem Nerede Başlanmalı
Backend filtreleme desteği ekleme candidateService.ts dosyasında fetchCandidates(filters) şeklinde endpoint güncellenmeli
Front-end filtre yapısını sadeleştirme applyFilters() fonksiyonu utils/filterCandidates.ts gibi ayrı bir dosyaya alınabilir
Sayfalama desteği eklemek Store içinde offset/limit state’i, UI tarafında "daha fazla yükle" veya sayfa geçişi
UI geri bildirimlerini iyileştirme Toast mesajları için use-toast.ts kullanılabilir
Detay sayfası yönlendirmesi CandidateCard içinde Link veya onClick ile /candidates/[id] yönlendirmesi kontrol edilmeli
🧠 Ekstra Notlar
Eğer adaylar yapay zeka ile analiz ediliyorsa (ai-analysis, personalityScore, vs.), bu alanlar Candidate tipine entegre mi? Henüz görünmüyor.

Görsel olarak CandidateCard bileşeninin yoğunluğu artabilir. Aşırı bilgi yüklemesi varsa sadeleştirilmeli veya "detayları göster" gibi butonlarla bölünebilir.
