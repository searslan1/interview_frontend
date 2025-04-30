Interviews Modülü
📁 Sayfa 1: app/(protected)/interviews/page.tsx
🎯 Amaç:
Tüm mülakatları listeler.

Filtreleme ve sıralama yapılabilir.

"Yeni Mülakat Oluştur" butonu ile CreateInterviewDialog açılır.

📌 Yapının Özeti:
Veriler useInterviewStore ile global state’ten alınır.

Filtreleme FilterSection bileşeni ile yapılır ama şu an sadece front-end filtre uygulanıyor gibi.

⚠️ Geliştirici Notları:
Backend'de filtreleme ve sıralama desteklenmiyor.
→ fetchInterviews(filters) gibi bir API entegrasyonu yapılmalı.

Search + filtre birleşimi uygulanmıyor (kombinasyon etkisiz).
→ Store veya API çağrısı içinde query builder yapısı gerekebilir.

InterviewList tüm veriyi render ediyor
→ Sayfalama yok → performans problemi oluşabilir.

InterviewList içinde component seviyesinde ekstra render optimizasyon yapılmamış.

📁 Sayfa 2: app/(protected)/interviews/add/page.tsx
🎯 Amaç:
Yeni bir mülakat oluşturmak için form ekranı sağlar.

Kişilik testi, açıklama, soru seçimi gibi alanlar içeren detaylı bir yapıdadır.

📌 Yapının Özeti:
react-hook-form + zod validasyonuyla çalışır.

QuestionSelector bileşeni kullanılarak sorular seçilir.

Soruların içinde AI metadata (complexityLevel, requiredSkills) gibi özel alanlar var.

⚠️ Geliştirici Notları:
Form verileri createInterview üzerinden store'a kaydediliyor.
→ Bu yapı test edilmeli çünkü bazı alanlar (AI metadata vs.) backend ile tam uyuşmayabilir.

Sorular doğrudan state’te tutuluyor, sorular çok büyükse → performans düşebilir.

alert("başarı") gibi geçici çözümler var, gerçek feedback mekanizması (toast/notification) entegre edilmeli.

Form tamamlandığında router.push() ile yönlendirme yapılmıyor → kullanıcı bir sonraki adıma geçemiyor.

📁 Sayfa 3: app/(protected)/interviews/[id]/page.tsx
🎯 Amaç:
Seçilen mülakatın detayını gösterir.

Aynı sayfada o mülakata ait başvurular da listelenir.

📌 Yapının Özeti:
Parametre üzerinden mülakat ID alınır (useParams)

getInterviewById() ve getApplicationsByInterviewId() birlikte çağrılır.

Veriler birleştirilerek InterviewDetails ve ApplicationList bileşenlerine aktarılır.

⚠️ Geliştirici Notları:
İki farklı store’dan veri çağrılıyor (interview + application)
→ Bu çağrılar paralel yapılabilir (şu an sıralı).

Mülakat bulunamazsa veya başvuru listesi boşsa kullanıcıya gösterilecek mesajlar eksik.

console.log("Mülakat Detayı") gibi geçici debug satırları kaldırılmalı.

Her seferinde API çağrılıyor, cache veya context ile yeniden kullanılabilir hale getirilebilir.

Tarih formatlama locale uyumlu değil (TR değil).

✅ Genel Yorumlar ve Devir Notları

Konu Açıklama
API Uyum Eksikliği Filtreleme ve sıralama frontend’de var gibi gözüküyor ama backend desteklemiyor. Yeni endpointler tasarlanmalı.
Kodun Anlaşılabilirliği Komponent isimleri net, yapılar anlaşılır. Ancak data akışı her zaman yukarıdan props ile yapılmıyor. Bazı componentler direkt store kullanıyor.
Yarım Kalanlar Search & Filter kombosu, toast bildirimler, form sonrası yönlendirme, error state UI eksik.
Modülleşme Eksikliği InterviewDetails, ApplicationList vs. bileşenleri yeniden kullanılabilir ama bağımlı hale gelmiş olabilir.
Verinin Bütünlüğü AI metadata ve kişilik testi gibi alanlar backend modeline tam uyuyor mu, test edilmedi.
Uyum Problemleri Date formatı, locale, toast feedback ve route yönlendirmeleri gibi UI/UX sorun çıkarabilir.
