# 🔌 Services Module - API Entegrasyon Katmanı

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nin backend API'leri ile iletişim kuran servis katmanını içerir. Her bir servis dosyası, belirli bir domain için API çağrılarını merkezi olarak yönetir.

## 🏗️ Mimari Yapı

```
services/
├── README.md                   # Bu dokümantasyon
├── authService.ts              # 🔐 Kimlik doğrulama servisleri
├── candidateService.ts         # 👤 Aday yönetimi servisleri
├── interviewService.ts         # 🎤 Mülakat yönetimi servisleri
├── applicationService.ts       # 📋 Başvuru yönetimi servisleri
├── appointmentService.ts       # 📅 Randevu yönetimi servisleri
├── notificationService.ts      # 🔔 Bildirim servisleri
└── profileService.ts           # 👨‍💼 Profil yönetimi servisleri
```

## 🔧 Temel Konfigürasyon

Tüm servisler `@/utils/api` modülündeki Axios instance'ını kullanır:

```typescript
import api from "@/utils/api";

// api.ts konfigürasyonu
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  withCredentials: true, // Cookie tabanlı auth
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
```

---

## 🔐 Auth Service (`authService.ts`)

Kullanıcı kimlik doğrulama işlemlerini yönetir.

### API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/login` | Kullanıcı girişi |
| POST | `/auth/register` | Yeni kullanıcı kaydı |
| POST | `/auth/logout` | Oturum kapatma |
| POST | `/auth/refresh` | Token yenileme |
| GET | `/auth/verify-email` | E-posta doğrulama |
| POST | `/auth/forgot-password` | Şifre sıfırlama talebi |
| POST | `/auth/reset-password` | Şifre sıfırlama |
| GET | `/profile/me` | Mevcut kullanıcı bilgisi |

### Fonksiyonlar

```typescript
export const authService = {
  // Kullanıcı girişi
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Mevcut kullanıcı bilgilerini al
  async getCurrentUser() {
    const response = await api.get("/profile/me");
    return response.data.data;
  },

  // Yeni kullanıcı kaydı
  async register(userData: { 
    name: string; 
    email: string; 
    password: string; 
    phone?: string 
  }) {
    const response = await api.post("/auth/register", userData);
    return response.data.success;
  },

  // E-posta doğrulama
  async verifyEmail(token: string) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  // Token yenileme
  async refreshToken() {
    await api.post("/auth/refresh");
    return await this.getCurrentUser();
  },

  // Oturum kapatma
  async logout() {
    await api.post("/auth/logout");
    useAuthStore.getState().logout();
  },

  // Şifre sıfırlama talebi
  async requestPasswordReset(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Şifre sıfırlama
  async resetPassword(token: string, newPassword: string) {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },
};
```

### Kullanım Örneği

```typescript
import { authService } from "@/services/authService";

// Login
const handleLogin = async (email, password) => {
  try {
    await authService.login(email, password);
    const user = await authService.getCurrentUser();
    // user bilgilerini store'a kaydet
  } catch (error) {
    // Hata yönetimi
  }
};
```

---

## 👤 Candidate Service (`candidateService.ts`)

Aday (Talent Pool) yönetimi işlemlerini yönetir.

### API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/candidates` | Aday listesi (filtreli/sayfalı) |
| GET | `/candidates/:id` | Tek aday detayı |
| GET | `/candidates/:id/interviews` | Aday mülakat geçmişi |
| PATCH | `/candidates/:id/status` | Durum güncelleme |
| POST | `/candidates/:id/notes` | Not ekleme |
| PATCH | `/candidates/:id/notes/:noteId` | Not güncelleme |
| DELETE | `/candidates/:id/notes/:noteId` | Not silme |
| PATCH | `/candidates/:id/favorite` | Favori toggle |
| POST | `/candidates/merge` | Aday birleştirme |
| GET | `/candidates/positions` | Pozisyon listesi |

### Tip Tanımları

```typescript
// Backend Response Format
interface BackendPaginatedCandidatesResponse {
  success: boolean;
  data: Candidate[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Frontend Format (Adapter Pattern)
interface PaginatedCandidatesResponse {
  success: boolean;
  data: Candidate[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
```

### Fonksiyonlar

```typescript
// Filtrelenmiş aday listesi
export const getCandidates = async (
  filters: Partial<CandidateFilters> = {},
  page: number = 1,
  limit: number = 20,
  sortBy: CandidateSortBy = "lastInterviewDate",
  sortOrder: CandidateSortOrder = "desc"
): Promise<PaginatedCandidatesResponse>

// Tek aday detayı
export const getCandidateById = async (id: string): Promise<Candidate>

// Aday mülakat geçmişi
export const getCandidateInterviews = async (candidateId: string)

// Durum güncelleme
export const updateCandidateStatus = async (
  id: string, 
  status: CandidateStatus,
  archivedReason?: string
): Promise<Candidate>

// Not ekleme
export const addCandidateNote = async (
  candidateId: string,
  note: AddCandidateNoteDTO
): Promise<CandidateNote>

// Favori toggle
export const toggleFavorite = async (candidateId: string): Promise<Candidate>

// Aday birleştirme
export const mergeCandidates = async (
  request: CandidateMergeRequest
): Promise<Candidate>

// Pozisyon listesi
export const getAvailablePositions = async (): Promise<PositionOption[]>
```

### Filtre Parametreleri

```typescript
interface CandidateFilters {
  searchTerm?: string;           // İsim, e-posta araması
  status?: CandidateStatus;      // active, reviewed, shortlisted, archived
  position?: string;             // Pozisyon filtresi
  minScore?: number;             // Min AI skoru
  maxScore?: number;             // Max AI skoru
  minInterviewCount?: number;    // Min mülakat sayısı
  dateRange?: { from: Date; to: Date }; // Tarih aralığı
  isFavorite?: boolean;          // Sadece favoriler
  showArchived?: boolean;        // Arşivleri göster
  experienceLevel?: string;      // Deneyim seviyesi
}
```

---

## 🎤 Interview Service (`interviewService.ts`)

Mülakat yönetimi işlemlerini yönetir.

### API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/interviews/my` | Kullanıcının mülakatları |
| GET | `/interviews/:id` | Tek mülakat detayı |
| POST | `/interviews` | Yeni mülakat oluşturma |
| PUT | `/interviews/:id` | Mülakat güncelleme |
| PATCH | `/interviews/:id/publish` | Mülakat yayınlama |
| DELETE | `/interviews/:id` | Mülakat silme (soft) |
| PATCH | `/interviews/:id/link` | Link/süre güncelleme |

### Fonksiyonlar

```typescript
export const interviewService = {
  // Yeni mülakat oluşturma
  async createInterview(data: CreateInterviewDTO): Promise<Interview> {
    const formattedData = {
      title: data.title,
      description: data.description || "",
      expirationDate: new Date(data.expirationDate).toISOString(),
      type: data.type || "async-video",
      position: data.position,
      personalityTestId: data.personalityTestId,
      stages: data.stages,
      status: data.status,
      questions: data.questions?.map((q, index) => ({
        questionText: q.questionText,
        expectedAnswer: q.expectedAnswer || "",
        keywords: q.keywords || [],
        order: q.order ?? index + 1,
        duration: q.duration || 60,
        aiMetadata: {
          complexityLevel: q.aiMetadata?.complexityLevel || "medium",
          requiredSkills: q.aiMetadata?.requiredSkills || [],
        },
      })),
    };
    const response = await api.post("/interviews", formattedData);
    return response.data.data;
  },

  // Kullanıcının mülakatları
  async getUserInterviews(): Promise<Interview[]>,

  // Tek mülakat detayı
  async getInterviewById(id: string): Promise<Interview>,

  // Mülakat güncelleme
  async updateInterview(id: string, updateData: Partial<UpdateInterviewDTO>): Promise<Interview>,

  // Mülakat yayınlama
  async publishInterview(id: string): Promise<Interview>,

  // Mülakat silme
  async deleteInterview(id: string): Promise<void>,

  // Link/süre güncelleme
  async generateInterviewLink(
    id: string, 
    expirationDate?: string | number
  ): Promise<{ link: string; expirationDate: string }>,
};
```

### Mülakat Tipleri

```typescript
type InterviewType = "async-video" | "live-video" | "audio-only" | "text-based";

enum InterviewStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DRAFT = "draft",
  INACTIVE = "inactive"
}
```

---

## 📋 Application Service (`applicationService.ts`)

Başvuru yönetimi işlemlerini yönetir.

### API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/applications` | Başvuru listesi (filtreli) |
| GET | `/applications/:id` | Tek başvuru detayı |
| PATCH | `/applications/:id/status` | Durum güncelleme |

### Fonksiyonlar

```typescript
// Filtrelenmiş başvuru listesi
export const getFilteredApplications = async (
  filters: Partial<ApplicationFilters>,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse>

// Tüm başvurular (basit çağrı)
export const getApplications = async (): Promise<Application[]>

// Mülakat bazlı başvurular
export const getApplicationsByInterviewId = async (
  interviewId: string
): Promise<Application[]>

// Tek başvuru detayı
export const getApplicationById = async (id: string): Promise<Application>

// Durum güncelleme
export const updateApplicationStatus = async (
  id: string,
  newStatus: 'pending' | 'rejected' | 'accepted'
): Promise<Application>
```

### Filtre Parametreleri

```typescript
interface ApplicationFilters {
  interviewId: string;
  dateRange?: { from?: Date; to?: Date };
  completionStatus: 'all' | 'completed' | 'inProgress' | 'incomplete';
  applicationStatus: 'all' | 'reviewing' | 'pending' | 'positive' | 'negative';
  experienceLevel: 'all' | 'entry' | 'mid' | 'senior';
  aiScoreMin: number;
  personalityType: string;
  searchTerm: string;
}
```

---

## 📅 Appointment Service (`appointmentService.ts`)

Randevu yönetimi işlemlerini yönetir.

### Tipik Fonksiyonlar

```typescript
export const appointmentService = {
  // Randevu listesi
  async getAppointments(): Promise<Appointment[]>,
  
  // Yeni randevu oluşturma
  async createAppointment(data: CreateAppointmentDTO): Promise<Appointment>,
  
  // Randevu güncelleme
  async updateAppointment(id: string, data: UpdateAppointmentDTO): Promise<Appointment>,
  
  // Randevu silme
  async deleteAppointment(id: string): Promise<void>,
};
```

---

## 🔔 Notification Service (`notificationService.ts`)

Bildirim işlemlerini yönetir.

### Tipik Fonksiyonlar

```typescript
export const notificationService = {
  // Bildirim listesi
  async getNotifications(): Promise<Notification[]>,
  
  // Okundu işaretle
  async markAsRead(id: string): Promise<void>,
  
  // Tümünü okundu işaretle
  async markAllAsRead(): Promise<void>,
  
  // Bildirim sil
  async deleteNotification(id: string): Promise<void>,
};
```

---

## 👨‍💼 Profile Service (`profileService.ts`)

Kullanıcı profil işlemlerini yönetir.

### Tipik Fonksiyonlar

```typescript
export const profileService = {
  // Profil bilgisi al
  async getProfile(): Promise<User>,
  
  // Profil güncelle
  async updateProfile(data: UpdateProfileDTO): Promise<User>,
  
  // Şifre değiştir
  async changePassword(oldPassword: string, newPassword: string): Promise<void>,
  
  // Profil resmi yükle
  async uploadAvatar(file: File): Promise<string>,
};
```

---

## 🎯 Service Pattern

### Temel Yapı

```typescript
// Her servis bu pattern'i takip eder
export const exampleService = {
  // GET - Liste
  async getItems(filters?: Filters): Promise<Item[]> {
    try {
      const response = await api.get("/items", { params: filters });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  // GET - Tekil
  async getItemById(id: string): Promise<Item> {
    const response = await api.get(`/items/${id}`);
    return response.data.data;
  },

  // POST - Oluşturma
  async createItem(data: CreateItemDTO): Promise<Item> {
    const response = await api.post("/items", data);
    return response.data.data;
  },

  // PUT/PATCH - Güncelleme
  async updateItem(id: string, data: UpdateItemDTO): Promise<Item> {
    const response = await api.put(`/items/${id}`, data);
    return response.data.data;
  },

  // DELETE - Silme
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};
```

### Error Handling

```typescript
// Servis seviyesinde hata yönetimi
try {
  const response = await api.get("/endpoint");
  return response.data.data;
} catch (error: any) {
  // Hata logla
  console.error("API Error:", error);
  
  // Özel hata mesajı fırlat
  throw new Error(
    error.response?.data?.message || "İşlem başarısız"
  );
}
```

---

## 📦 Dependencies

- **axios** - HTTP client
- **@/utils/api** - Configured Axios instance
- **@/types/**** - TypeScript type definitions
- **@/store/**** - Zustand stores (authStore logout vb.)

---

## 🔄 Response Format

Tüm API'ler standart response formatı kullanır:

```typescript
// Başarılı response
{
  success: true,
  data: { ... } | [ ... ],
  message?: string
}

// Hata response
{
  success: false,
  message: "Hata mesajı",
  errors?: { field: string; message: string }[]
}

// Paginated response
{
  success: true,
  data: [ ... ],
  pagination: {
    page: 1,
    pageSize: 20,
    totalCount: 100,
    totalPages: 5,
    hasMore: true
  }
}
```

---

## 🚀 Best Practices

1. **Merkezi API yönetimi**: Tüm çağrılar services üzerinden yapılır
2. **Type Safety**: Tüm request/response tipleri tanımlıdır
3. **Error Handling**: Her servis hata yönetimi içerir
4. **Adapter Pattern**: Backend response'u frontend formatına dönüştürülür
5. **Logging**: Kritik hatalar loglanır
6. **Separation of Concerns**: Her domain kendi servisinde
