Auth Sonrası Akış Modülü: Verify Email & Reset Password
📁 Layout: app/(public)/layout.tsx
🎯 Amaç:
Tüm public sayfalar için ortak bir düzen sağlar. Bu sayfalarda genellikle kullanıcı henüz oturum açmamıştır.

💡 Notlar:
AuthLayout sade ve kullanıcı odaklıdır. Responsive + minimalist yapı tercih edilmiş.

Kullanıcıyı ortalanmış bir form içine alarak net bir odak sağlar.

✅ Güçlü Noktalar:
max-w-md genişliği ile form alanı dengeli.

shadow-md + rounded-lg ile güven veren bir görünüm sağlanmış.

Yeterince izole bir yapı → Başka modüllerden etkilenmez.

⚠️ İyileştirme Alanları:

Sorun Açıklama
🔄 Layout geçişleri test edilmemiş olabilir AuthLayout tüm (public) için mi geçerli? Giriş/kayıt sayfası da bu layout içinde mi değil mi kontrol edilmeli
🌗 Tema uyumu kontrol edilmeli Varsayılan bg-gray-100 → koyu tema (dark mode) desteklemiyor olabilir
📧 Sayfa: verify-email/page.tsx
🎯 Amaç:
Kullanıcının e-posta doğrulama tokeni ile sisteme kayıt adımını tamamlamasını sağlar.

🔁 Akış:
Sayfa token parametresini URL’den alır.

authService.verifyEmail(token) ile doğrulama yapılır.

Sonuç mesajı gösterilir (başarı veya hata).

Kullanıcı manuel olarak "Giriş Yap" butonuna tıklayarak yönlendirilir.

⚠️ Geliştirici Notları:

Konu Açıklama
🔍 Token eksikliği iyi kontrol ediliyor token yoksa hemen hata mesajı gösteriliyor. ✅
⏳ Bekleme süreci kullanıcıya gösteriliyor Loader2 bileşeniyle animasyonlu geri bildirim var. ✅
🧭 Yönlendirme manuel Başarılı doğrulama sonrası otomatik yönlendirme yapılmıyor → UX zayıf olabilir
⚠️ Response yapısı güvenli mi? error.response?.data?.message erişimi null olabilir → güvenli parse edilmeli
🔐 Doğrulama için kullanıcı oturumuna gerek yok Bu iyi ama ileride kullanıcıyı otomatik girişe sokmak istenirse token'la JWT alma işlemi gerekebilir
💬 UI eksikliği Başarı/hata mesajları toast yerine düz <p> içinde. Daha profesyonel bir UX için toast notification tercih edilmeli
🔑 Sayfa: reset-password/page.tsx
🎯 Amaç:
Kullanıcı e-posta ile gönderilen bağlantı üzerinden şifresini yeniden belirler.

🔁 Akış:
Sayfa token parametresini URL’den alır.

Eğer token yoksa otomatik olarak giriş sayfasına yönlendirilir.

Yeni şifre girildikten sonra authService.resetPassword(token, newPassword) çağrılır.

Başarılıysa kullanıcıya mesaj gösterilir ve 3 saniye sonra / sayfasına yönlendirilir.

✅ Güçlü Noktalar:
Token validasyonu net.

Şifre uzunluğu kontrolü yapılmakta.

Başarılı işlem sonrası otomatik yönlendirme yapılmakta.

Kullanıcıdan alınan değer required + minlength ile validasyona tabi.

⚠️ Geliştirici Notları:

Sorun Açıklama
❌ Şifre karmaşıklığı kontrolü yok Sadece uzunluk kontrolü var. Büyük harf, sayı, özel karakter vb. kontrolü önerilir.
❌ Gizlilik / güvenlik eksikleri Yeni şifre input’u görünür alanda → "Göz simgesiyle göster/gizle" UI eklenmeli
❌ Form bileşeni izole değil Kod tek sayfaya gömülü. Yeniden kullanılabilir <ResetPasswordForm /> bileşeni olarak ayrıştırılmalı
⚠️ Feedback eksikliği Hatalı şifre güncellemelerinde backend response’ları daha açıklayıcı hale getirilmeli
💬 Toast eksikliği Şu an tüm mesajlar <p> etiketleriyle veriliyor. UI kalitesini yükseltmek için use-toast önerilir
📌 Genel İyileştirme Önerileri (Bu Modül İçin)

İyileştirme Açıklama
📦 authService fonksiyonları daha iyi try/catch ayrımıyla yazılmalı Hatalı response → undefined olabilir
🔐 CSRF koruma ihtiyacı değerlendirmeli Şifre sıfırlama token’ları XSS/CSRF açısından tehlikeli olabilir
📱 Mobil görünüm test edilmeli Form genişliği, butonlar, spacing değerleri responsive mi?
🧪 Test altyapısı kurulmalı Token geçersiz → doğru hata mı? Başarılı doğrulama → doğru mesaj mı? gibi test senaryoları yazılmalı
🔁 Layout'lar organize edilmeli Giriş, şifre sıfırlama, kayıt gibi tüm public sayfalar AuthLayout altında olmalı. Dağınık yapılar önlenmeli.
✅ Devir Sonrası Geliştirici İçin Adımlar

Adım Açıklama
1 authService içindeki verifyEmail, resetPassword fonksiyonlarının backend response tiplerini dökümante et
2 Başarı/hata durumları için toast UI yapısını entegre et
3 ResetPasswordPage formunu ayrı bileşene çıkar (ResetPasswordForm)
4 Şifre karmaşıklık kontrolü + toggle show/hide ekle
5 Verify success sonrası 3sn bekleyip otomatik yönlendirme yap
