api/chat/route.ts – AI Chatbot Endpoint’i
🎯 Amaç
Şu an:

Kullanıcıdan gelen mesaj geçmişini (user + assistant) alarak

OpenAI API'sine yönlendirir

İnsan kaynakları odaklı profesyonel cevaplar üretir.

İleride:

Bu uç nokta, adayların metin/konuşma/video analizine dayalı gerçek zamanlı AI raporlama altyapısına entegre edilecek.

⚙️ Teknik Akış
Request alınır: JSON içinden messages array’i çıkarılır.

System Prompt tanımlanır: HR Assistant rolü tanımlı mesaj ile GPT’ye bağlam sağlanır.

Payload hazırlanır: System + önceki kullanıcı/assistant mesajları birleşir.

OpenAI API çağrısı yapılır: gpt-3.5-turbo modeli çağrılır.

Yanıt döner: choices[0].message.content içeriği alınır ve reply olarak frontend’e döndürülür.

📎 İçerdiği Özellikler

Özellik Açıklama
✅ Sistem mesajı (system prompt) GPT modeline İnsan Kaynakları Danışmanı gibi davranmasını öğreten açıklama var.
✅ Role enforcement “Sadece İK konularına odaklan” kuralı net olarak yazılmış.
✅ Örnek kullanımlar Kullanıcıyı yönlendirecek örnek sorular verilmiş.
✅ Token ayarı Maksimum 700 token ve esnek ayarlarda temperature, top_p, penalty değerleri tanımlanmış.
✅ Hata yakalama Hem response.ok kontrolü hem de try-catch bloğu mevcut.
⚠️ Geliştiriciye Notlar – Gelecek Dönüşüme Hazırlık

Konu Açıklama
🔀 Statik görev tanımı Şu an yalnızca sabit bir “İK danışmanı” görevine hizmet ediyor. Bu ileride roleType gibi değişkenlerle özelleştirilebilir hale getirilmeli.
🔌 Backend analitik entegrasyonu eksik Gerçek aday analizi (ses/video üzerinden AI rapor üretimi) için burada conversationId, userId, interviewId gibi metadata alınmalı.
🗃️ Veri kaydı yok Şu an yanıtlar loglanmıyor. Üretilen cevapların kayıt altına alınıp kullanıcı geçmişiyle ilişkilendirilmesi gerekiyor.
❌ API cache & rate limit yok OpenAI istekleri limitsiz çalışıyor. Abuse riskini azaltmak için: IP rate limit veya user-session limiti konulmalı.
📡 Model geçişine hazırlık yok Şu an sadece gpt-3.5-turbo kullanılıyor. Gelecekte model dinamik hale getirilmeli (gpt-4, custom finetuned gibi).
🔐 API key kontrolü zayıf Environment’tan alınıyor ama token expired mı, var mı kontrolü yapılmıyor.
📦 System prompt JSON’a çıkarılmalı Şu an inline olarak yazılmış. Daha sürdürülebilir olması için: prompts/hr-assistant.ts gibi dış dosyaya taşınmalı.
✅ Geliştiriciye Aktarılacak Net Yapı

Gereken Açıklama
HRSystemPrompt.ts export const HR_SYSTEM_PROMPT = { role: "system", content: "..."}; gibi harici bir prompt yöneticisi oluştur.
POST fonksiyonu logging ile genişletilmeli Gelen userId, sessionId, interviewId gibi parametreleri logla.
Dynamic context injection İleride bu endpoint'e candidateProfile, interviewContext, videoSummary gibi ekstra veri eklenecek. Şimdiden payload bu esnekliğe uygun hale getirilmeli.
User feedback & analytics için kayıt tutma Üretilen her yanıt, kullanıcıya sunulmadan önce backend'e kaydedilmeli.
Rate limiting Abuse riskine karşı kullanıcı/IP bazlı sınır konmalı.
Testler API istek başarısı, hata yönetimi, invalid input gibi senaryolar için Jest/Playwright testi planlanmalı.
🧪 Test Senaryosu Önerileri

Durum Beklenen
Geçerli mesaj ile istek GPT'den düzgün HR yanıtı döner
Token eksikse Hata mesajı döner
GPT API bağlantısı başarısız reply: AI yanıtında hata oluştu: ... şeklinde açıklama döner
AI dışı soru (örneğin "Hava nasıl?") "Sadece insan kaynakları süreçlerine odaklanan bir asistanım..." yanıtı döner
📌 Özet
Bu endpoint şu an sadece HR odaklı bir chatbot olarak çalışıyor. Ancak ileride:

Gerçek analiz altyapısına bağlanacak

Dinamik bağlamlarla çalışacak

Sonuçları sistem geneline kaydedecek

Kullanıcı geçmişine göre kişiselleştirme yapacak

Dolayısıyla şimdiden:

Veri mimarisi

esneklik

güvenlik

geliştirilebilirlik odaklı olarak yapılandırılmalı.
