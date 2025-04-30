authMiddleware.ts – Erişim Koruma Katmanı
🎯 Amaç:
Kullanıcının access_token veya refresh_token olmadan yetki gerektiren sayfalara erişmesini engellemek ve gerekirse anasayfaya yönlendirmektir (/).

📌 Teknik Akış:
middleware fonksiyonu çalışır.

Kullanıcının istek yaptığı yol (pathname) alınır.

Erişim yapılmak istenen sayfa, protectedPaths içinde tanımlı mı kontrol edilir.

Eğer token yoksa → kullanıcı / sayfasına yönlendirilir.

Aksi durumda istek işlenmeye devam eder (NextResponse.next()).

✅ Güçlü Noktalar:

Özellik Açıklama
✅ Token kontrolü cookie üzerinden req.cookies.get("access_token") doğrudan sunucu tarafında yapılır. Güvenlidir.
✅ Yönlendirme net Korumasız erişim varsa doğrudan / sayfasına yönlendirme yapılır.
✅ Matcher ile route optimizasyonu Sadece belirli path’lerde middleware çalışır → performans korunur.
⚠️ Geliştiriciye Kritik Notlar:

Sorun / Geliştirme Açıklama
🔐 Sadece token varlığı kontrol ediliyor Token geçerli mi? süresi dolmuş mu? rol yetkisi var mı? gibi kontroller yapılmıyor. Sadece varlık kontrolü güvenlik için yeterli değildir.
🧭 Yönlendirme sabit (/) Token olmayan kullanıcıyı her zaman ana sayfaya yönlendirmek yeterli olmayabilir. Örneğin: /auth/login?redirect=xxx tarzı UX odaklı yönlendirme yapılabilir.
❗ Refresh token ile giriş yapılmasına izin veriliyor olabilir Eğer sadece refresh_token varsa kullanıcı yine erişim kazanıyor. Bu token istemciden ayrılamayacağı için güvenlik riski olabilir.
❌ Kullanıcı rolü kontrol edilmiyor Örneğin: admin yetkili sayfa için bu middleware ile yönlendirme yapılamaz. Rol bazlı route koruma ileride ihtiyaç olacaktır.
🚫 API route’ları korunmuyor Bu middleware sadece pages rotalarını koruyor. API endpoint’leri için ayrı koruma gereklidir (serverMiddleware.ts gibi).
🔄 Geliştirme Önerileri

Geliştirme Açıklama
🔑 Token decode + süresi kontrolü Middleware içinde JWT token decode edilerek expiration date kontrol edilebilir (jwt-decode, Jose, Edge-safe JWT)
⚙️ Rol kontrolü entegre edilebilir Örn: sadece /settings/admin yoluna admin rolü erişebilsin gibi path-level yetkilendirme
📦 redirect parametresiyle UX iyileştirme Kullanıcı yönlendirilirken /auth/login?redirect=/dashboard gibi hedef sayfa bilgisi taşınabilir
🔄 Global erişim yöneticisi tanımlanabilir utils/accessGuard.ts gibi bir dosyada yol bazlı erişim kuralları tanımlanıp middleware buna göre karar verir hale getirilebilir
📜 log mekanizması entegre edilebilir Yetkisiz erişim durumunda log tutulması, saldırı tespiti, denetim gibi amaçlarla ileride değerlidir.
🧪 Önerilen Test Senaryoları

Durum Beklenen
Token yok → korumalı rota Kullanıcı /'a yönlendirilir
access_token var ama expired Middleware bunu anlamaz → erişim sağlanır (❌)
refresh_token var ama access_token yok Kullanıcı yine erişim sağlar (❌)
access_token geçerli → korumalı rota Erişim normal devam eder
Token var → unprotected rota Middleware çalışmaz (doğru)
📌 Özet
Bu middleware, sistemdeki ilk güvenlik kontrol katmanıdır. Temel haliyle çalışıyor ve yeterlidir, ancak:

⚠️ Bu middleware erişim kontrolünün temeli olsa da, güvenliğin tamamı değildir.

İleride:

Token doğruluğu,

rol bazlı erişim,

API route koruması,

session-id loglama,

audit trail oluşturma gibi daha gelişmiş kontrol mekanizmalarına ihtiyaç duyulacaktır.
