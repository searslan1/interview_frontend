İK DASHBOARD — GÜNCELLENMİŞ UI AKIŞ DOKÜMANI

(Mevcut yapı korunur · UX güçlendirilir · HR odaklı)

0) TASARIM PRENSİBİ (ajana net talimat)

Mevcut layout, grid ve sayfa hiyerarşisi korunacak

Dashboard:

❌ detay analiz alanı olmayacak

❌ ağır grafikler içermeyecek

✅ aksiyon yönlendiren, özet bir kontrol paneli olacak

Grafikler basit kalacak, rapor sayfasına köprü görevi görecek

1) SAYFA GENEL YAPISI (DEĞİŞMEZ)
İK Dashboard
├─ KPI Kartları
├─ Günlük Aksiyon / Özet Alanı
├─ Mülakat & Takvim
├─ Aktif Mülakatlar
├─ Son Başvurular
├─ Basit Grafikler (rapora köprü)
├─ Favori Adaylar (son 3)
├─ İK Asistanı (chatbot)

2) KPI KARTLARI (üst şerit)
Mevcut kartlar korunur:

Toplam Başvuru

Onaylanan Adaylar

Reddedilen Adaylar

Başvuru Trendi (%)

UX güncellemeleri:

Her kart başlığında tooltip (ℹ️):

“Bu metrik neyi ifade eder?”

Sayısal değer altına kısa bağlam:

“Son 30 gün”

“Bu hafta”

Bu kartlar tıklanabilir değildir (bilgi verir, yönlendirme yapmaz).

3) BOŞ VERİ DURUMU (kritik UX kuralı)

Dashboard’daki tüm kartlar için ortak davranış:

❌ Kullanılmayacak metin:

“Veri bulunmamaktadır”

✅ Kullanılacak davranış:

Eğer ilgili kaynaktan veri gelmiyorsa:

Henüz başvuru bulunmuyor.
İlk mülakatı oluşturmak için tıklayın.
[ + Mülakat Oluştur ]


CTA ilgili sayfaya yönlendirir

Bu davranış:

Grafikler

Favori adaylar

Trend alanları
için geçerlidir

4) BASİT GRAFİKLER (rapora köprü)
Dashboard’ta kalan grafikler:

Başvuru Trendleri (mini line / bar)

Departmanlara Göre Başvurular (basit bar)

Grafik davranışı:

Minimal görselleştirme

Detay YOK

Sağ üstte her zaman:

📊 Raporlara Git →


Tıklanınca:
→ /reports sayfası (filtreler korunabilir)

Dashboard grafik = özet + yönlendirme

5) FAVORİ ADAYLAR ALANI (göz önünde, sınırlı)
Davranış:

Sadece son favoriye eklenen 3 aday gösterilir

Her aday kartında:

İsim

Pozisyon

Favoriye eklenme tarihi (“2 gün önce”)

Alanın altında:
Tüm Favorileri Gör →


Yönlendirme:
→ /candidates?filter=favorite

⚠️ Bu alan boş bırakılmaz
Favori yoksa boş-state CTA çalışır (bkz. Madde 3)

6) AKTİF MÜLAKATLAR & SON BAŞVURULAR
Mevcut yapı korunur

UX iyileştirmeleri:

Kart sayısı sınırı (örn. max 5)

Altında:

Tümünü Gör →


Son başvurularda:

“AI Skoru” yerine:

“Analiz Hazır”

“Analiz Devam Ediyor”
badge’i tercih edilir

Bu dil HR için daha aksiyoneldir.

7) TAKVİM & RANDEVU ALANI

Mevcut yapı korunur.

Ek davranış:

Gün seçildiğinde:

O güne ait mülakat varsa listelenir

Yoksa:

Bu tarih için planlanmış mülakat yok.


Bu alan sadece bilgilendirici.

8) İK ASİSTANI — CHATBOT LAYOUT
Önceki küçük widget kaldırılır.
Yeni yapı:

Dashboard’un sağ alt köşesinde chatbot paneli

Başlangıç durumu:

Minimized chat bubble

Tıklanınca:

Slide-up / modal chat alanı

İlk mesaj (context-aware):
Merhaba 👋  
Bugün 2 mülakat değerlendirilmeyi bekliyor.  
Nasıl yardımcı olabilirim?


Chatbot:

Dashboard verisini okuyabilir

Ama aksiyon almaz, sadece yönlendirir

9) TOOLTIP KURALI (GLOBAL)

Aşağıdaki tüm başlıklarda tooltip olacak:

KPI kart başlıkları

Grafik başlıkları

Favori adaylar alanı

Trend alanları

Tooltip içeriği:

Teknik değil

HR diliyle

1–2 cümle