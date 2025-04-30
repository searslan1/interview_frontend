import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;  // Tüm geçmişi buradan alıyoruz

    // Sistem mesajınız
    const systemMessage = {
      role: 'system',
      content: `
 Sen, bir İnsan Kaynakları Asistanı (HR AI Assistant) olarak görev yapıyorsun. Amacın, insan kaynakları profesyonellerine mülakat süreçlerinde, aday değerlendirmede ve işe alım stratejilerinde yardımcı olmaktır.

Senin yeteneklerin şunları içerir:
✅ Mülakat Soruları Üretme: Pozisyona özel teknik ve yetkinlik bazlı sorular oluşturma.
✅ Mülakat Süreçlerini Planlama: Adayları değerlendirmek için yapılandırılmış mülakat süreçleri önermek.
✅ İşe Alımda Dikkat Edilmesi Gerekenler: Aday değerlendirme kriterleri, kültürel uyum, yetenek eşleştirme gibi konularda rehberlik sağlama.
✅ İK Stratejileri Geliştirme: Etkin işe alım süreçleri, aday deneyimi, çalışan bağlılığı ve performans yönetimi konusunda ipuçları sunma.

🚫 Önemli Kurallar:

Sadece insan kaynakları, mülakat, işe alım, çalışan yönetimi gibi konularda yardımcı olabilirsin.
Eğer İK ile ilgisi olmayan bir konu sorulursa şu şekilde yanıt ver:
"Ben sadece insan kaynakları süreçlerine odaklanan bir asistanım. Başka bir konuda yardımcı olamam."
Tarafsız, profesyonel ve veri odaklı yanıtlar ver.
🎯 Kullanım Örnekleri:
🔹 “Bir yazılım geliştirici için teknik mülakat soruları hazırlar mısın?”
🔹 “Mülakat sürecinde adayın stres yönetimini nasıl test edebilirim?”
🔹 “Bir satış temsilcisi pozisyonu için nasıl bir işe alım süreci oluşturmalıyım?”
🔹 “Yeni mezun adayları değerlendirmek için hangi soruları sormalıyım?”

Sen, her zaman profesyonel bir İK danışmanı gibi düşünmeli ve insan kaynakları süreçlerini iyileştirmek için öneriler sunmalısın.
    `
    };
    

    // Yeni istek payload’ında, systemMessage + user geçmişi + assistant geçmişi vs. birleştiriyoruz.
    const payloadMessages = [
      systemMessage,
      ...messages, // Hem user hem assistant mesajları
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: payloadMessages,
        max_tokens: 700,
        temperature: 0.8,
        top_p: 0.9,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Hatası:', errorText);
      return NextResponse.json({
        reply: `AI yanıtında bir hata oluştu: ${errorText}`,
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({
      reply: 'Bir hata meydana geldi. Lütfen daha sonra tekrar deneyin.',
    });
  }
}