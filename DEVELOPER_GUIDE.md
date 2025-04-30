## 🛠️ Geliştirici Başlangıç ve Yol Haritası

Bu doküman, Interview App frontend kod tabanını devralacak geliştiricilere yol gösterir. Proje modüler ve komponent bazlı bir mimariye sahip olduğundan, aşağıdaki başlıklar altında kod yapısını kavramanız ve sağlıklı ilerlemeniz hedeflenmiştir.

---

### 1. Projeye Giriş

- Projeyi lokalinizde çalıştırmak için `.env` dosyasını doldurun (örn. `NEXT_PUBLIC_APP_URL`).
- `npm install` ve `npm run dev` komutlarıyla çalıştırabilirsiniz.
- Klasik Next.js App Router yapısı kullanılmıştır. Route yapısı `app/` dizinindedir.

---

### 2. Sayfa Yapısı (Pages) ve Modüller

Her modülün kendi sayfası, state yönetimi (store) ve servis katmanı (services) vardır.

| Sayfa              | Açıklama                                              |
| ------------------ | ----------------------------------------------------- |
| `app/(public)/`    | Giriş, kayıt, doğrulama gibi anonim sayfalar.         |
| `app/(protected)/` | Giriş yapılmış kullanıcıların erişebileceği modüller. |
| `dashboard/`       | Giriş sonrası ana gösterge paneli.                    |
| `interviews/`      | Mülakat oluşturma ve yönetim ekranları.               |
| `applications/`    | Başvuruların listelendiği ve incelendiği sayfalar.    |
| `candidates/`      | Aday filtreleme, listeme ve detay sayfaları.          |

---

### 3. Zustand Store Mantığı

Her modülün store yapısı ayrı tutulmuştur. Store'lar `/store/` dizinindedir ve `fetch`, `update`, `create` gibi fonksiyonlar içerir. Örnek:

```ts
useInterviewStore.getState().fetchInterviews();
```

State'ler birden fazla yerde kullanılacağı için store'lar sade ve test edilebilir tutulmuştur.

---

### 4. Servis Katmanı

Tüm API çağrıları `services/` klasöründe merkezi bir yapıda tutulur.
Her servis fonksiyonu, API endpoint mantığına karşılık gelir.

Örnek:

```ts
await interviewService.getUserInterviews();
await applicationService.getApplications();
```

> Geliştirme sırasında backend endpoint yapısına göre eksik veya hatalı fonksiyonlar olabilir. Bu nedenle backend ile sürekli iletişim halinde olunmalıdır.

---

### 5. Tip Tanımları (Types)

Tüm TS interface ve enum tanımları `types/` klasöründedir. Eğer backend tarafında yeni veri alanları tanımlanırsa, burası güncellenmelidir.

- `types/user.ts` → Kullanıcı modeli
- `types/interview.ts` → Mülakat modeli
- `types/application.ts` → Başvuru modeli

> **Not:** Kod çalışıyor gibi gözükse bile eksik veya uyumsuz tipler projeyi uzun vadede kırılgan hale getirir.

---

### 6. UI ve Bileşen Mimarisi

- UI bileşenleri `components/ui/` altında ShadCN + Tailwind mimarisiyle inşa edilmiştir.
- Feature bazlı bileşenler `components/interview/`, `components/dashboard/`, `components/applications/` klasörlerinde bulunur.
- Bileşen isimleri `PascalCase` olarak yazılmıştır.

---

### 7. Orta Vadeli Yapılacaklar

- `api/chat/route.ts`: AI Assistant mantığı oturtulmuş, ancak backend analiz mimarisine entegre edilmesi gerekecek.
- `interviewStore` / `applicationStore` / `candidateStore`: Genişletilmeye açıktır.
- Test altyapısı henüz kurulmamıştır. Planlama yapılması önerilir.

---

### 8. Bilinen Riskler ve Yarım Bırakılmış Alanlar

- `dashboard/` sayfası, tüm mülakatları getiriyor. Bu backend tarafında optimize edilmelidir (örn. sadece 5 tanesi gelsin).
- `candidateStore` veriyi `/api/candidates` üzerinden fetch ediyor; geçici dummy API olabilir.
- `useParams` ile gelen ID'lerde doğrulama yapılmıyor.
- Bazı modüllerde `useEffect` çağrıları gereksiz `fetch` tetikliyor olabilir.

---

### 9. Geliştirici Notları

- Her store/servis ilişkisini kontrol edin.
- Bileşenlerde mutlaka prop tipi tanımlanmalı.

---

### 10. İletişim ve Devralım

Yeni bir geliştirici olarak yapmanız gerekenler:

1. `README.md` + bu dokümanı detaylıca okuyun.
2. `authStore`, `interviewStore`, `applicationStore` yapısını inceleyin.
3. Öncelikli olarak `interview`, `application`, `dashboard` yapısını çözümleyin.
4. Eksik veya hatalı API fonksiyonlarını backend geliştiricisiyle netleştirin.
5. Yeni modül ekleyecekseniz `components/feature-name/`, `store/`, `services/`, `types/` katmanlarını unutmayın.

---

> Kod tabanı ölçeklenebilir ve açık bir mimariyle kurgulanmıştır.
> Bu yapıyı koruyarak ilerlemek, projenin sürdürülebilirliğini artıracaktır. Başarılar 🙌
