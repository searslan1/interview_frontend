utils/api.ts – Axios Yapılandırması & Token Yönetimi
📌 Yapının Amaçları
🔐 withCredentials: true → Cookie tabanlı oturum yönetimi sağlar (refresh token için şarttır).

♻️ 401 hatasında otomatik /auth/refresh çağrısı ile token yenileme yapılır.

🔁 Yenileme sırasında eş zamanlı gelen istekler queue içine alınır ve token yenilendikten sonra işlenir.

🚪 Token yenileme başarısızsa kullanıcı çıkış yaptırılır ve / sayfasına yönlendirilir.

✅ Güçlü Noktalar

Özellik Açıklama
Retry yönetimi originalRequest.\_retry sayesinde sonsuz döngü önlenmiş. Akıllıca ✅
İstek kuyruğu failedQueue mekanizması ile eş zamanlı 401 hatalarında token yenilenmeden yeniden istek yapılması engellenmiş ✅
Central logout useAuthStore.getState().logout() ile uygulama genelinde tek noktadan çıkış sağlanmış ✅
Otomatik redirect Oturum geçersizse kullanıcı güvenli şekilde ana sayfaya gönderiliyor ✅
⚠️ Geliştiriciye Kritik Uyarılar & Kontrol Noktaları

Sorun / Geliştirme Alanı Açıklama
❗ useAuthStore UI dışında çalışıyor useAuthStore.getState() doğrudan dosya içinde çağrılıyor. Bu Next.js Server Component’leri ile çalışmazsa SSR hataları doğurabilir.
❗ window.location.href = "/" yaklaşımı serttir SPA mimarilerde router.push("/") tercih edilir. SSR veya test ortamlarında problem çıkarabilir.
🔁 api.post('/auth/refresh') çağrısı sonucu yeni token döner mi? Şu anda sadece endpoint’e çağrı yapılıyor. Ama token dönerse localStorage'a mı yazılıyor? Cookie’ye mi set ediliyor? Açıklığa kavuşturulmalı.
🔐 process.env.NEXT_PUBLIC_APP_URL kontrolsüz undefined olabilir. Boş baseURL ile yapılan istekler hata döndürebilir.
❌ Interceptor'dan çıkarılması gereken UI işlemleri window.location.href, alert, toast, router.push gibi UI tarafı işlemler burada olmamalı. Servis katmanında sade hata yönetimi olmalı.
🔂 api(originalRequest) sonrası recursive hata riski Retry edilen istek yine 401 dönerse? retryCount gibi bir sınırlama düşünülmeli.
🔍 İleriye Dönük Yapılandırma Önerileri

Yapı / Dosya Amaç
src/utils/axiosRetryQueue.ts failedQueue ve isRefreshing gibi yönetimi ayrı hale getir
getAuthHeaders() fonksiyonu Header tabanlı bearer token kullanımı olacaksa header’lara manuel token ekle
SSR-safe logout Universal logout mekanizması (authUtils.logout() gibi) ile window bağımlılığını kaldır
refreshTokenService() Token yenileme işini ayrı bir dosyaya taşı ve test edilebilir yap
🧪 Test Edilmesi Gerekenler

Senaryo Beklenen Davranış
✅ 401 hatası alınır → refresh başarılı Token yenilenmeli, orijinal istek tekrarlanmalı
❌ Refresh başarısız Kullanıcı çıkış yaptırılmalı, yönlendirme yapılmalı
⚠️ Eş zamanlı 401 hataları Kuyruk mekanizması devreye girmeli, sadece 1 refresh olmalı
🔄 401 + response error içinde config.\_retry === true Döngüye girilmemeli
⚠️ SSR ortamı (Next.js 13+) useAuthStore.getState() erişimi runtime'da SSR uyumlu olmalı
✅ Sonuç
Bu dosya projenin ağ iletişimi altyapısını, oturum güvenliğini ve token yaşam döngüsünü doğrudan etkileyen kritik bir yapı taşını oluşturur.

Kodda görünürde "hata" yoktur. Ancak:

Bu katmanın güçlü olması, sistemin kararlılığı ve güvenliği için yeterli değildir.
Kontrolsüz çalışması büyük problemler doğurabilir. Bu nedenle servis mantığı kadar interceptor yapısı da mimari kararlarla kontrol altında tutulmalıdır.
