**ADAY YÖNETİMİ MODÜLÜ

RESMİ UI / UX AKIŞ DOKÜMANI**

1. Amaç ve Kapsam

Aday Yönetimi Modülü, insan kaynakları uzmanlarının:

Tüm başvurmuş adayları tek bir aday havuzu (talent pool) içinde görmesini,

Adayları performans, pozisyon ve durum bazında filtrelemesini,

Adayları favorileyerek aktif çalışma setleri oluşturmasını,

Adayların tüm mülakat geçmişini, skorlarını ve analizlerini aday merkezli olarak incelemesini

sağlayan ana kontrol ekranıdır.

Bu modül mülakat değil, aday merkezlidir.
Mülakatlar adayın alt kayıtlarıdır.

2. Temel Tasarım İlkeleri

Aday = Kalıcı varlık

Mülakat = Bağımsız event

Her mülakat kendi skorunu üretir, geçmiş mülakatlar yeni skorları etkilemez

Aday genel skoru yalnızca rehber / özet amaçlıdır

HR odaklı: hız, taranabilirlik ve bağlam önceliklidir

Rejected adaylar silinmez, arşivlenir

Aynı aday farklı e-posta ile başvurabilir → manuel kontrollü eşleştirme

3. Sayfa Yapısı – Genel Akış
Aday Yönetimi (Candidate Pool)
│
├── Aday Listesi (Filtrelenebilir)
│     └── Aday Satırı
│
└── Aday Detay Sayfası
      ├── Genel Profil Özeti
      ├── Skor & Değerlendirme Özeti
      ├── Katıldığı Mülakatlar
      ├── HR Notları
      └── Olası Eşleşme (Merge) Uyarıları

4. Aday Yönetimi – Liste Sayfası
4.1 Sayfanın Rolü

Bu sayfa HR için:

“Elimde kimler var?”

“Hızlıca iyi adayları nasıl ayıklarım?”
sorularına cevap verir.

Amaç detaya girmeden hızlı karar ön elemesi yapabilmektir.

4.2 Aday Listesi (Ana Görünüm)

Liste, satır bazlı çalışır.
Her satır bir adayı temsil eder.

Bir aday satırında tek bakışta şu bilgiler yer alır:

Aday adı + avatar

Son başvurduğu pozisyon

Katıldığı toplam mülakat sayısı

Son mülakat tarihi

Genel (aggregate) AI skoru

Favori durumu (⭐)

Aday durumu:

Active

Reviewed

Shortlisted

Archived (Rejected)

Tüm satır tıklanabilir yapıdadır.

4.3 Filtreleme Sistemi

Filtreler sayfanın temel gücüdür ve kombine çalışır.

Kimlik & Geçmiş Filtreleri

Pozisyon

Son başvuru tarihi

Katıldığı mülakat sayısı

Performans Filtreleri

Genel AI skoru (min–max)

Teknik skor

İletişim skoru

Operasyonel Filtreler

Favori adaylar

Henüz incelenmemiş adaylar

Arşivlenmiş (Rejected) adaylar

Varsayılan görünümde arşivlenmiş adaylar gizlidir.

4.4 Favori Adaylar

Favori, aday seviyesinde tutulur

HR kullanıcısına özeldir

Favoriye alınan adaylar:

Liste içinde ⭐ ile işaretlenir

Filtre veya ayrı görünümle izlenebilir

Favoriler, HR’ın aktif çalışma seti olarak düşünülür.

5. Aday Detay Sayfası

Liste üzerinden bir adaya tıklandığında açılır.

Bu sayfa bir profil hub gibi davranır.

5.1 Genel Profil Özeti

Sayfanın üst bölümünde yer alır:

Aday adı

İletişim bilgileri (mevcut olanlar)

Kullanılmış e-posta adresleri (varsa)

Genel AI değerlendirme özeti (kısa metin)

Genel skor göstergeleri (bilgilendirici)

Bu alanın amacı:

“Bu aday kim ve genel olarak ne durumda?”

5.2 Skor ve Değerlendirme Mantığı

Her mülakat kendi skoruna sahiptir

Skorlar birbirinden bağımsızdır

Genel aday skoru:

Weighted hesaplanır

Yalnızca özet / rehber amaçlıdır

Karar verdirici değildir

UI’da bu durum açık şekilde hissettirilmelidir.

5.3 Katıldığı Mülakatlar Bölümü

Adayın tüm mülakatları burada listelenir:

Pozisyona göre gruplanmış

Her mülakat için:

Pozisyon

Tarih

O mülakata ait genel skor

“Detaylı İncele” aksiyonu

“Detaylı İncele” aksiyonu, daha önce tanımlanan mülakat modalını açar
(video, soru bazlı analizler, genel AI özeti).

5.4 Skor Geçmişi / Trend (Opsiyonel ama Önerilen)

Adayın farklı mülakatlardaki skorları zaman ekseninde gösterilebilir.

Amaç:

Adayın gelişim veya dalgalanma eğilimini görmek

Tek bir mülakata takılı kalmamak

5.5 HR Notları

HR tarafından girilen serbest metin notları

Tarihli

Karar sürecini destekler

Bu alan AI’dan bağımsızdır.

6. Rejected (Arşiv) Aday Mantığı

Rejected adaylar sistemden silinmez

Varsayılan görünümde gizlidir

Filtre ile bilinçli şekilde görüntülenir

Aday profili ve geçmiş mülakatları korunur

Bu yapı:

Gelecekte tekrar başvuru

Denetim / geçmiş inceleme

Veri bütünlüğü

için gereklidir.

7. Aynı Aday – Farklı E-posta Senaryosu
7.1 Sistem Davranışı

Farklı e-posta → farklı aday olarak kaydedilir

Sistem otomatik birleştirme yapmaz

7.2 Olası Eşleşme Uyarısı

Aday detay sayfasında:

“Bu aday daha önce başvurmuş olabilir”

şeklinde bir uyarı gösterilebilir.

7.3 HR Aksiyonları

HR şu seçeneklere sahiptir:

Adayları ilişkilendir (merge)

Ayrı tut

Sonra karar ver

Merge işlemi:

Aday profillerini birleştirir

Mülakatlar ayrı event olarak kalır

E-postalar alias olarak tutulur

8. HR Kullanıcı Akışı (Özet)
HR → Aday Yönetimi
   → Filtre uygular
   → Adayları tarar
   → Favoriler
   → Aday profiline girer
   → Mülakat geçmişini inceler
   → Detaylı mülakata girer
   → Not alır
   → Karar verir


Bu akışta:

Bağlam kaybı olmaz

Geri dönüşler kesintisizdir

Aday ↔ mülakat geçişleri nettir

9. Sonuç

Bu doküman:

Aday Yönetimi modülünün resmi UX sözleşmesidir

UI geliştirici için “ne yapılacak?” sorusuna net cevap verir

Var olan component / tip / stil yapısına doğrudan giydirilebilir

HR kullanım alışkanlıklarına uygundur

Ölçeklenebilir ve uzun vadede bozulmaz bir mimari sunar