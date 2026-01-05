HR-AI Landing Page
UI Akış ve Tasarım Talimat Dokümanı
Doküman Amacı

Bu doküman, HR-AI ürününün landing page arayüzünün mevcut tasarım dili ve bileşenleri korunarak, ürünün temel felsefesine uygun şekilde yeniden akmasını sağlamak için hazırlanmıştır.

Ürün felsefesi net sınırlarla korunmalıdır:

Sistem puanlama yapmaz

Sistem otomatik karar vermez

Sistem adayları beklentilere yakınlık üzerinden görünür kılar

Bu mesajlar UI boyunca örtük değil, açık biçimde aktarılmalıdır.

1. Genel Sayfa Yapısı (Değişmemesi Gerekenler)

Landing page tek sayfa (scroll-based) yapıdadır

Mevcut:

renk paleti

tipografi

grid sistemi

button stilleri
korunacaktır

Yeni tasarım mevcut component library’yi kullanarak oluşturulmalıdır
(yeni UI dili icat edilmeyecek)

2. Section 1 — HERO / Value Proposition
Amaç

Kullanıcının ilk 5–10 saniyede şunu anlaması:

“Bu sistem adayları puanlamıyor, benim beklentime yakınlığı gösteriyor.”

Yerleşim

Sol: metin alanı

Sağ: ürün ekranından alınmış (dummy / blur olabilir) analiz görüntüsü

İçerik (metinler birebir korunmalı)

Ana başlık:

Adayları puanlamıyoruz.
Beklentilerinize ne kadar yaklaştıklarını gösteriyoruz.

Alt açıklama:

HR-AI, yapılandırılmış video mülakatlardan kanıt tabanlı analizler üretir.
Kararı sizin yerinize vermez — kararınızı güçlendirir.

CTA Butonları

Primary: Hemen dene (3 soruluk demo)

Secondary (ghost): Nasıl çalışıyor?

Not: CTA’lar yukarıda, fold içinde kalmalıdır.

3. Section 2 — Ayrıştırıcı Blok: “HR-AI Ne Yapmaz?”
Amaç

Yanlış beklentileri daha baştan kırmak
(Hukuki + etik + satış açısından kritik)

Yerleşim

3 sütunlu sade blok

İkon + kısa metin

İçerik (birebir)

❌ Uygun / uygun değil demez

❌ Adayları puanlamaz

❌ Otomatik karar vermez

Alt metin:

Çünkü işe alım bir matematik problemi değil, kanıtlı bir değerlendirme sürecidir.

4. Section 3 — “Nasıl Çalışır?” (3 Adımlı Akış)
Amaç

Sistemin “AI büyüsü” değil, yapılandırılmış bir mühendislik süreci olduğunu göstermek

Step 1 — Video Mülakat

20–30 dk yapılandırılmış video

Net soru akışı

Süre ve teknik yönlendirmeler

Alt metin:

Aday konuşur, sistem dinler.

Step 2 — Analiz & Gözlem

Konuşma yapısı

Örnekleme düzeyi

Tutarlılık ve içerik sinyalleri

Alt metin:

Sistem çıkarım yapmaz, gözlem üretir.

Step 3 — Beklenti Eşleme

Kullanıcı tarafından tanımlanan kriterler

Zaman damgalı kanıtlar

Takip sorusu önerileri

Alt metin:

Karar yine sizindir.

5. Section 4 — Örnek Analiz Ekranı
Amaç

“Bu AI neye dayanarak bunu söylüyor?” sorusuna cevap vermek

Yerleşim

Üstte video player (pause edilmiş)

Sağda kısa özet alanı

Altta analiz tablosu

Tablo Örneği (UI olarak gösterilecek, interaktif olmak zorunda değil)
Beklenti Alanı	Gözlem	Kanıt
Ownership	Yakın	02:14
İletişim	Güçlü	04:33
Belirsizlik	Orta	06:01

Alt açıklama:

Tüm gözlemler video içeriğine dayalıdır ve zaman damgalıdır.

⚠️ Bu bölümde skor, yüzde, grafik, progress bar kullanılmayacaktır.

6. Section 5 — Kullanım Senaryoları
Amaç

Ürünün farklı paydaşlara hitap ettiğini göstermek

Kartlar

HR Ekipleri

İlk elemede kanıtlı değerlendirme

Zaman tasarrufu

Standart raporlar

Hiring Manager’lar

Kendi beklentisine göre analiz

Takip soruları

Daha derin mülakatlar

Enterprise / Legal

Puanlama yok

Otomatik karar yok

Denetlenebilir analiz

7. Section 6 — Final CTA + Güven
Başlık

Beklentilerinize yakın adayları görün.

CTA

3 soruluk demo mülakata katıl

Alt not: Kredi kartı gerekmez.

Güven Alanı (ikonlu, sade)

KVKK / GDPR uyumu

Veri güvenliği

Şeffaf analiz yaklaşımı

8. Footer (Stratejik İçerik)

Footer’da mutlaka yer alacak link / ifadeler:

Ethical AI Principles

Decision Support, not Decision Making

Methodology / Approach (ileride akademik referans için)

9. Tasarımda Kaçınılacaklar (Kesin Talimat)

❌ Skorlar

❌ Yüzdeler

❌ Aday karşılaştırma grafikleri

❌ “En iyi aday” dili

❌ Otomatik karar çağrışımı