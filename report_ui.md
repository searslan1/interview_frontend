RAPOR SAYFASI — STRATEJİK ANALİZ UI AKIŞ DOKÜMANI

(HR-friendly · sürdürülebilir · grafik odaklı · developer-ready)

Bu sayfa tekil aday inceleme yeri değildir.
Bu sayfa, HR’nin “süreç nasıl gidiyor?” dediği yerdir.

0) RAPOR SAYFASININ VARLIK NEDENİ (tek paragraf, pusula)

Rapor sayfası; mülakat, aday ve AI analizlerinden üretilen verilerin toplu, zamansal ve pozisyon bazlı olarak görselleştirildiği; HR uzmanının süreci değerlendirdiği, iyileştirdiği ve üst yönetime aktarabildiği stratejik analiz alanıdır.

Bu sayfa:

Karar verdirmez

Kararı temellendirir

1) ÜST BİLGİ MİMARİSİ

Ana navigasyonda:

Başvurular | Adaylar | Raporlar | Ayarlar


Raporlar → tek bir ana dashboard, alt sekmelerle derinleşir.

2) RAPOR SAYFASI GENEL YAPISI (LAYOUT)
<RaporlarPage>

[ A. Global Filtre Barı ]

[ B. Özet KPI Şeridi ]

[ C. Pozisyon Bazlı Genel Görünüm ]

[ D. Aday Dağılımları & Kalite ]

[ E. Soru & Mülakat Etkinliği ]

[ F. AI – HR Uyum Analizi ]

[ G. Zaman Bazlı Trendler ]

</RaporlarPage>


Sayfa scroll-based, PDF gibi bölünmez.
Her blok bağımsız component.

3) A. GLOBAL FİLTRE BAR (kritik)

Sayfanın en üstünde, sticky.

Filtreler:

Pozisyon (multi-select)

Tarih aralığı

Mülakat türü

Reviewer (HR)

Etiket (Strong / Medium / Weak)

Sadece favoriler (toggle)

Davranış:

Filtre değişince tüm grafikler yeniden hesaplanır

Grafikler kendi endpoint’lerinden aggregate data çeker

⚠️ Filtreler rapor sayfasının bel kemiği.
“Filtre yoksa rapor yok.”

4) B. ÖZET KPI ŞERİDİ (tek bakışta durum)

Bu alan HR’nin ilk 10 saniyesi.

Kartlar:

Toplam başvuru

Değerlendirilen mülakat sayısı

Favoriye alınan oran

Ortalama rol yakınlığı

Ortalama mülakat süresi

Bu kartlar:

Karar verdirmez

“Bir şey değişiyor mu?” sorusuna cevap verir

5) C. POZİSYON BAZLI GENEL GÖRÜNÜM

Grafik türü:

Stacked bar / grouped bar

Gösterilenler:

Pozisyonlara göre:

Yüksek yakınlık

Orta yakınlık

Düşük yakınlık

HR burada şunu görür:

“Problem adayda mı, pozisyon tanımında mı?”

Bu grafik:

İş ilanı revizyonu

Kanal değişimi
kararlarını tetikler.

6) D. ADAY DAĞILIMLARI & KALİTE GÖRÜNÜMÜ

Grafikler:

Rol yakınlığı dağılımı (histogram / bucket)

İletişim vs Teknik yaklaşım dağılımı (scatter)

Önemli kural:

Aday isimleri YOK

Tamamen anonim, toplu veri

Bu sayfa “etik olarak rahat” olmalı.

7) E. SORU & MÜLAKAT ETKİNLİĞİ ANALİZİ

Bu bölüm başvurular UI’ında asla çıkmayan içgörüleri verir.

Grafikler:

Soru bazlı ayırt edicilik

Hangi sorular adayları gerçekten ayırıyor?

Soru bazlı ortalama yanıt süresi

Soru bazlı analiz tamamlanma oranı

HR çıktısı:

“Bu soru gereksiz / bu soru çok güçlü”

Bu bölüm, mülakat tasarımını iyileştirir.

8) F. AI – HR UYUM ANALİZİ (ince ama güçlü)

Grafikler:

HR favorileri vs AI yüksek yakınlık

Çakışan alanlar / ayrışan alanlar

Dil çok önemli:

“AI doğru / HR yanlış” YOK

“İkinci göz ile birinci göz ne kadar örtüşüyor” VAR

Bu grafik:

Enterprise satış

Güven inşası
için çok kıymetli.

9) G. ZAMAN BAZLI TRENDLER

Grafikler:

Son 30 / 60 / 90 gün:

Başvuru kalitesi trendi

Ortalama yakınlık değişimi

Favoriye alma oranı

HR burada şunu görür:

“Son 2 ayda kalite düşmüş, neden?”

Bu grafik:

Employer brand

İlan metni

Mülakat soruları
ile doğrudan ilişkilidir.