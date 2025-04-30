app/page.tsx (Landing Page)
🔍 Görev:
Ziyaretçi kullanıcılar için bir giriş sayfası (landing page) sunar.

Giriş/Üyelik modal’larını kontrol eder (AuthModal, RegisterModal)

Kullanıcı giriş yapmışsa doğrudan /dashboard yönlendirmesi yapar

Hero slider ile tanıtım sağlar (framer-motion ve Image ile animasyonlu görsel geçişler)

⚙️ Teknik Özellikler:
useAuth() hook'u ile kullanıcı oturumunu kontrol ediyor

framer-motion kullanılarak geçişli slayt efektleri oluşturulmuş

Modals state’leri lokal state ile kontrol ediliyor (useState)

🧩 Tespit Edilen Güçlü Noktalar

Alan Değerlendirme
UI & UX Modern, animasyonlu ve etkileyici bir tanıtım yapısı
Kod Okunabilirliği Net fonksiyon adları ve mantıksal ayrım başarılı
Yönlendirme Giriş yapmış kullanıcıyı dashboard'a aktarması 👍
Modülerlik AuthModal, RegisterModal, LandingPageHeader ayrı bileşenler
🚧 İyileştirme Fırsatları

Alan Öneri
🔁 Modal Yönetimi useModal() gibi özel hook ile state yönetimi soyutlanabilir (kod tekrarını azaltır)
📱 Responsive Tasarım Mobil görünüm test edilmeli (görsel geçişler, buton boyutları)
🌐 Dil Desteği Statik metinler i18n dosyasına alınabilir
🎯 Analytics "Hemen Başlayın" butonu tıklaması gibi aksiyonlara event tracking (örneğin: console.log yerine GTM) entegre edilebilir
🧱 layout.tsx (Root Layout)
🔍 Görev:
Tüm sayfalar için temel yapı taşlarını sağlar

Font ayarı, tema sağlayıcısı, Toaster gibi global UI elementleri burada tanımlı

ClientQueryProvider ile muhtemelen TanStack Query / React Query tarzı veri sağlayıcı sunuluyor

🧩 Güçlü Noktalar

Alan Değerlendirme
♻️ Reusable Katman ThemeProvider, Toaster, ClientQueryProvider gibi ortak davranışlar burada soyutlanmış
🧩 Uyumlu Font & Tema Inter fontu ve class tabanlı tema geçişi modern yaklaşımlara uygun
⚙️ Basitlik Karmaşadan uzak, tek sorumluluğa sahip
🚧 İyileştirme Fırsatları

Alan Öneri
🔐 Auth Layout Ayrımı layout.tsx içinde sadece public sayfalar var gibi görünüyor, korumalı sayfalar için (protected)/layout.tsx’de AuthGuard gibi kontroller olabilir
🔍 SEO Metadata metadata şu an statik — ileride dinamik metadata (generateMetadata) kullanılabilir
🧠 Bu Aşamadan Çıkarılan Net İhtiyaçlar

İhtiyaç Açıklama
useModal() gibi genel modal yönetimi hook'u Modal tekrarını azaltmak için
i18n yapısına geçiş Çok dilli desteğe hazır hale getirmek
Giriş sonrası redirect yapısı ayrıştırılabilir AuthGuard veya middleware tabanlı yönlendirme ileride sadeleştirme sağlar
Analytics + Event Tracking Özellikle CTA butonlarının kullanımını anlamak için
