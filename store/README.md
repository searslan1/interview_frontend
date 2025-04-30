store/ Katmanı – Zustand ile Global Durum Yönetimi Raporu
🎯 Genel Amaç
store/ klasörü, React bileşenleri arasında paylaşılan global veri yönetimi sağlamak için zustand kütüphanesini kullanır. Her modülün (auth, interview, application, candidate) kendine özel modüler store yapısı vardır.

Bu yapı:

🔄 Sunucu ve istemci arasında senkronize veri sağlar,

🧩 Sayfalar arası veri taşımayı kolaylaştırır,

⛳ UI’nin global durumlara tepki vermesini sağlar (isLoading, user, error, vb.).

📌 Store Bazlı İnceleme
1️⃣ Auth Store (authStore.ts)

Özellik Açıklama
✅ Kullanıcı oturumu user, userPreferences, isEmailVerified alanlarıyla oturum durumu yönetilir
✅ Yetki kontrolü Kullanıcının rol, izin ve doğrulama bilgileri burada saklanır
✅ Token yenileme refreshToken() fonksiyonu ile cookie tabanlı token döngüsü yönetilir
✅ UI erişim kolaylığı setUser() gibi bağımsız setter’lar ile context bağımsız kullanım kolaylaştırılmış
🔍 Dikkat Edilmesi Gerekenler:

user nesnesinin eksik ya da null olabileceği durumlarda frontend null kontrolü yapılmalı.

useAuthStore.getState() SSR ortamlarında dikkatli kullanılmalı (middleware, interceptors gibi yerlerde).

Kullanıcının yetki (permission) kontrolü UI katmanında yapılacaksa, bu yapıdan destek alınmalı.

2️⃣ Application Store (applicationStore.ts)

Özellik Açıklama
📥 Veri çekimi fetchApplications() tüm başvuruları alır
🔍 Detay erişimi fetchApplication(id) tekil başvuru getirir
🧹 Temizleme fonksiyonu clearApplication() ile detaydan çıkarken state sıfırlanır
🔍 Dikkat Edilmesi Gerekenler:

API çağrılarının catch bloklarında detaylı error.response kontrolü eksik olabilir.

Sayfalama veya filtreleme desteklenmiyor → ileride Infinite Scroll için loadMoreApplications() eklenebilir.

3️⃣ Candidate Store (candidateStore.ts)

Özellik Açıklama
📤 API fetch /api/candidates endpoint’i ile fetch yapılıyor (dikkat: service abstraction kullanılmıyor!)
🔄 Optimistic update Aday durumu değiştiğinde önce local güncelleniyor, sonra API’ye gönderiliyor
🔍 ID bazlı erişim getCandidateById(id) fonksiyonu ile UI tarafı doğrudan erişim sağlayabiliyor
🔍 Dikkat Edilmesi Gerekenler:

API çağrısı doğrudan fetch ile yapılmış → diğer store’lara kıyasla services layer kullanılmıyor (tutarsız).

Backend hatalarında retry / rollback mekanizması yok → optimistic update başarısız olursa veri uyumsuzluğu olabilir.

Candidate tipi güncellenirse burada da mutlaka yansıtılmalı (status, score, feedback gibi alanlar).

4️⃣ Interview Store (interviewStore.ts)

Özellik Açıklama
📚 Liste yönetimi fetchInterviews() kullanıcının tüm mülakatlarını getirir
🔍 Detay çekme getInterviewById() belirli bir mülakatın detayını alır
➕ Oluşturma createInterview() yeni mülakat oluşturur ve listeye ekler
🔄 Güncelleme updateInterview(), updateStatus(), updateQuestions() gibi fonksiyonlar veri günceller
❌ Silme deleteInterview() ile veri kalıcı olarak silinir
🔗 Kişilik testi bağlama updatePersonalityTest() fonksiyonu özel olarak tanımlanmış
🔍 Dikkat Edilmesi Gerekenler:

Store içindeki loading ve error state’leri global UI'ye iletilmeli. Örn: toast, notification veya loading spinner bileşenleri.

Fonksiyon sayısı çok → ileride mantıksal bölme (interviewListStore, interviewEditorStore gibi) düşünülebilir.

interviews içinde güncellenen item’ı doğrudan güncellemek yerine fetchInterviews() tekrar çağrılıyor → gereksiz yük.

⚙️ Genel Geliştirici Uyarıları

Konu Açıklama
🧪 Test yazımı Store fonksiyonları doğrudan test edilebilir olacak şekilde sade tutulmalı
⚠️ Servis kullanım tutarlılığı candidateStore doğrudan fetch, diğerleri services/ üzerinden çağrı yapıyor → refactor önerilir
🔐 Rol/izin kontrolü store içinde mi? Eğer yetkilendirme store’dan yapılacaksa merkezi permissionStore gerekebilir
📊 Cache yönetimi eksik Tüm fetch’ler doğrudan tekrar veri çekiyor → ileride SWR, react-query, persist gibi cache stratejileri entegre edilebilir
🧹 State sıfırlama eksik Örn: sayfa değişiminde interviewStore.selectedInterview gibi alanlar temizlenmezse eski veri UI’ye sızabilir
✅ Sonuç
Bu store/ katmanı sayesinde projenin temel işleyişi çok daha modüler, okunaklı ve yönetilebilir hale gelmiş durumda. Ancak:

⚠️ Bu yapı zamanla büyüdükçe, karışıklıkları önlemek için rollerin ayrımı, erişim stratejisi ve kullanım örüntüsü netleştirilmelidir.
