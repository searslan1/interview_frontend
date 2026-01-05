🚀 MÜLAKAT PLATFORMU — NETFLIX TARZI UI AKIŞ DOKÜMANI

(Developer-Ready / Integration-Ready)

Bu doküman üç bölümden oluşur:

Üst bilgi mimarisi – sayfa düzeyi akış

Detaylı UI akışı – kullanıcı hareketlerine göre sayfalar, modallar, dinamik satırlar

AI Analizi asenkron akışı – verinin UI’ya nasıl yansıyacağı

1) 🧩 ÜST BİLGİ MİMARİSİ AKIŞI

Ana sayfa UI şu satırlardan dinamik oluşturulur (Netflix gibi row-based layout):

1. Son Gelen Başvurular

Kaynak: /applications?sort=created_at:desc

2. Favori Mülakatlar (HR tarafından işaretlenenler)

Kaynak: /interviews?favorite=true&userId=hrUserId

3. AI Skoru Yüksek Adaylar (dinamik)

Kaynak: /interviews?sort=ai_score:desc&limit=20

4. Pozisyon Bazlı Mülakat Koleksiyonları (dinamik)

Backend sağlıyor:
/positions → her position için:
/interviews?position_id=X

Bu satırların tamamı dinamik oluşturulur.
UI tarafı:

<Homepage>
   <Row title="Son Gelen Başvurular" items=[...interviews] />
   <Row title="Favoriler" items=[...interviews] />
   <Row title="AI Skoru Yüksek Adaylar" items=[...interviews] />
   positions.map(position => (
       <Row title={position.name} items=[...its interviews] />
   ))
</Homepage>

2) 🎬 DETAYLI UI AKIŞ ŞEMASI (ADIM ADIM)

Aşağıdaki akış diyagramı developer’ın UI’ı sıfır zahmetle inşa etmesi için hazırlanmıştır.

A) Ana Sayfa → Mülakat Kartına Tıklama

Kullanıcı aksiyonu:
Mülakat kartına tıklar
(Netflix’te bir diziye tıklamak gibi)

UI davranışı:
Fullscreen modal overlay açılır.

B) Mülakat Modalı Yapısı

Modal açılınca ilk render şu sırayla gelir:

-----------------------------------------------------
| Candidate summary panel (top area)                |
| - Aday ismi (tıklanabilir → Candidate Profile)    |
| - Pozisyon                                        |
| - Tarih                                           |
| - Genel AI Özet Yazısı (async load)               |
| - Genel AI Skorları (async load)                  |
-----------------------------------------------------
| Video Player                                      |
| - Continue from last position                     |
-----------------------------------------------------
| Bölüm Listesi / Soru Listesi (player altında)     |
| - Soru #1: title + süre + analyzed badge          |
| - Soru #2: ...                                    |
-----------------------------------------------------
| Soru Analizi Alanı                                |
| - AI yorumları                                    |
| - duygusal analiz / teknik analiz                 |
-----------------------------------------------------

Modal Davranış Kuralları (kritik)

Modal kapansa bile video kaldığı yerden devam eder.
lastWatchedTime localStorage veya backend kullanıcı state’inde tutulabilir.

Bölüm listesi modal içinde player’ın hemen altında yer alır.

Genel analiz modal açıldığında async yüklenir:
/ai/interview/:id/general-analysis

Soru analizleri bölüm tıklanınca async yüklenir:
/ai/interview/:iid/question/:qid

C) Bölüm (Soru) Seçildiğinde Akış

Kullanıcı soru listesinde bir soruya tıklayınca:

Player, ilgili soru videosuna geçer
(tek dosyaysa startTime, endTime segment → jump logic)

UI soru bilgisi panelini günceller:

Question #2
- Soru title
- Soru açıklaması
- Soruya ait AI analizleri (async)


AI analizleri yüklenene kadar skeleton gösterilir.

D) Aday Profiline Tıklandığında

Candidate summary panelindeki aday ismine tıklanır:

→ /candidate/:id

Bu sayfa şunları içerir:

Aday temel bilgiler (isim, eposta, pozisyonlar)

Tüm mülakat geçmişi (Netflix’te yapımcının diğer işleri gibi)

Tüm AI skorları (genel + soru bazlı)

CV / dosyalar

HR notları (editable)

Favoriye eklenen mülakatları gösteren özel bölüm

Bu sayfa ajana backend’den JSON aldıkça componentleri dolduracak şekilde tasarlanır.

E) Filtre Akışı (Ana Sayfa Üstü)

Kullanıcı ana sayfada sağ üstteki filtre butonuna basar:

Filtre opsiyonları:

Pozisyon

AI Skor aralığı (slider)

Tarih aralığı

Reviewer

Etiket (Strong, Medium, Weak)

UI davranışı:

Filtreler aktive edilince ana sayfadaki tüm satırlar yeniden hesaplanır.

Her row dinamik API isteği yapar.

F) Kıyaslama Modu (Aynı pozisyon için)

Kullanıcı modal içinde “Compare” butonuna tıklar:

→ Sidebar veya mini popover açılır:

Compare: Backend Developer Candidates
------------------------------------------------
Aday 1 (current)
Aday 2 (listeden seçilir)
Aday 3 (varsa)
------------------------------------------------
AI Score Comparison Chart
Skill Breakdown Comparison
Communication vs Problem-Solving vs Technical


Bu mod sadece aynı pozisyon ID’ye sahip mülakatlarda görünür.

G) Favori Mülakat Ekleme Akışı

HR kullanıcı modal ya da kart üzerinde favoriye tıklar:

→ /favorite POST
→ Ana sayfadaki “Favoriler” satırı kendi kendine güncellenir.

Netflix davranışı gibi: immediate UI refresh + optimistic update.

3) 🧠 AI Analizleri Asenkron Veri Akışı

Bu bölüm ajana UI ile backend arasındaki asenkron yapıyı doğru kurdurmak için.

1. Soru videoları backend’den AI server’a akıyor

Backend zaten her soru kaydedildiğinde AI server’a gönderiyor.
UI bu sürece karışmaz.

2. UI analizleri GET ile çeker
UI → Backend endpoint'leri:

Genel analiz:
GET /ai/interview/:interviewId/general-analysis

Soru analizi:
GET /ai/interview/:interviewId/questions/:questionId/analysis

UI tarafında:

İlk render: skeleton

Veri gelince: panel güncellenir

Timeout/retry yapılabilir

AI verisi gecikirse UI bozmaz

Partial data geldiğinde bile render edilir

3. Status polling opsiyonu

İstersen AI tarafı uzun süren işlerde polling yapılabilir:

GET /ai/interview/:iid/status

UI şu yöntemle yönetir:

Genel analiz yoksa → “Analiz hazırlanıyor…” badge

Soru analizleri yoksa → “Bu soru analiz ediliyor…”

4) 🧱 GENEL UYGULAMA MİMARİSİ ÖZETİ (UI perspektifi)

UI Akışı:

Homepage
   Rows (dynamic)
       InterviewCard → onClick → Modal
Modal
   Load general data
   Load video
   Load segments
   Load general AI async
   User selects question
       Load question video segment
       Load question AI async
CandidatePage
   Load candidate info
   Load all interviews
   Load AI history
   Load HR notes

5) 📌 Bu Dokümanın Amacı

Bu belgeyi takımındaki UI geliştiriciye verdiğinde:

Var olan UI component library’sine bu akışı entegre eder.

Backend API’lerini tüketmek için hangi UI davranışının beklendiğini bilir.

Netflix tarzı satır yapısının nasıl dinamik oluşturulacağını anlar.

Modal player, segment navigation, AI async yükleme gibi “zor” davranışları net bir şekilde uygular.

Tasarımcı için gerekli olan sayfa hiyerarşisi tamamlanmıştır.

React / Vue / Next / Remix fark etmeksizin uygulanabilir.