# 🗃️ Store Module - State Management (Zustand)

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nin global state yönetimini sağlayan Zustand store'larını içerir. Her store, belirli bir domain için state ve aksiyonları merkezi olarak yönetir.

## 🏗️ Mimari Yapı

```
store/
├── README.md                      # Bu dokümantasyon
├── authStore.ts                   # 🔐 Kimlik doğrulama state'i
├── candidateStore.ts              # 👤 Aday yönetimi state'i
├── interviewStore.ts              # 🎤 Mülakat yönetimi state'i
├── applicationStore.ts            # 📋 Başvuru yönetimi state'i
├── dashboardStore.ts              # 🏠 Dashboard state'i
├── reportingStore.ts              # 📈 Raporlama state'i
├── notification-store.ts          # 🔔 Bildirim state'i
├── question-store.ts              # ❓ Soru yönetimi state'i
├── appointmentStore.ts            # 📅 Randevu state'i
├── profileStore.ts                # 👨‍💼 Profil state'i
└── favorite-candidates-store.ts   # ⭐ Favori adaylar state'i
```

## ⚡ Zustand Temelleri

### Neden Zustand?

- **Minimal API**: Basit ve öğrenmesi kolay
- **No Boilerplate**: Redux'a göre çok daha az kod
- **TypeScript Friendly**: Tam TypeScript desteği
- **DevTools**: Redux DevTools entegrasyonu
- **Middleware Support**: Persist, immer vb.
- **React Concurrent Mode**: Tam uyumluluk

### Temel Kullanım Paterni

```typescript
import { create } from "zustand";

interface ExampleStore {
  // State
  items: Item[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useExampleStore = create<ExampleStore>((set, get) => ({
  // Initial state
  items: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await exampleService.getItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item]
    }));
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }));
  },
}));
```

---

## 🔐 Auth Store (`authStore.ts`)

Kullanıcı kimlik doğrulama durumunu yönetir.

### State

```typescript
interface AuthState {
  user: User | null;
  userPreferences: UserPreference | null;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
}
```

### Actions

```typescript
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterDTO) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void;
}
```

### Kullanım

```typescript
// Component içinde
const { user, isLoading, login, logout } = useAuthStore();

// Login işlemi
const handleLogin = async () => {
  await login(email, password);
};

// Logout işlemi
const handleLogout = async () => {
  await logout();
  router.replace("/");
};

// Auth kontrolü
if (!user && !isLoading) {
  router.replace("/");
}
```

### Özellikler

- **Cookie-based Auth**: Token'lar HTTP-only cookie'lerde saklanır
- **Auto Refresh**: Token yenileme mekanizması
- **State Persistence**: Sayfa yenilemesinde auth durumu korunur
- **Email Verification**: E-posta doğrulama flow'u

---

## 👤 Candidate Store (`candidateStore.ts`)

Aday (Talent Pool) yönetimi durumunu yönetir.

### State

```typescript
interface CandidateStoreState {
  // Ana veri
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  
  // Yükleme durumları
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  
  // Filtreleme ve sıralama
  filters: Partial<CandidateFilters>;
  sortBy: CandidateSortBy;
  sortOrder: CandidateSortOrder;
  
  // Pagination
  pagination: {
    total: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    page: number;
    limit: number;
  };
  
  // Pozisyon listesi
  availablePositions: PositionOption[];
  
  // Favoriler
  favoriteCandidateIds: string[];
}
```

### Actions

```typescript
interface CandidateStoreActions {
  // Veri çekme
  fetchCandidates: (page?: number) => Promise<void>;
  fetchCandidateById: (id: string) => Promise<void>;
  refreshCandidates: () => Promise<void>;
  
  // Filtreleme
  setFilters: (filters: Partial<CandidateFilters>) => void;
  resetFilters: () => void;
  
  // Sıralama
  setSorting: (sortBy: CandidateSortBy, sortOrder: CandidateSortOrder) => void;
  
  // Pagination
  setPage: (page: number) => void;
  
  // Durum güncelleme
  updateStatus: (id: string, status: CandidateStatus, reason?: string) => Promise<void>;
  
  // Notlar
  addNote: (candidateId: string, note: AddCandidateNoteDTO) => Promise<void>;
  updateNote: (candidateId: string, noteId: string, content: string) => Promise<void>;
  deleteNote: (candidateId: string, noteId: string) => Promise<void>;
  
  // Favoriler
  toggleFavorite: (candidateId: string) => Promise<void>;
  
  // Merge
  mergeCandidates: (primaryId: string, secondaryId: string, keepEmail: boolean) => Promise<void>;
  
  // Helpers
  getCandidateById: (id: string) => Candidate | undefined;
  clearSelectedCandidate: () => void;
  fetchAvailablePositions: () => Promise<void>;
}
```

### Kullanım

```typescript
const {
  candidates,
  pagination,
  isLoading,
  filters,
  fetchCandidates,
  setFilters,
  updateStatus,
} = useCandidateStore();

// İlk yükleme
useEffect(() => {
  fetchCandidates();
}, []);

// Filtre değişikliği
const handleFilterChange = (newFilters) => {
  setFilters(newFilters); // Otomatik olarak fetchCandidates çağırır
};

// Durum güncelleme
const handleStatusChange = async (id, status) => {
  await updateStatus(id, status);
};
```

---

## 🎤 Interview Store (`interviewStore.ts`)

Mülakat yönetimi durumunu yönetir.

### State

```typescript
interface InterviewStoreState {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: boolean;
  error: string | null;
}
```

### Actions

```typescript
interface InterviewStoreActions {
  fetchInterviews: () => Promise<void>;
  getInterviewById: (id: string) => Promise<void>;
  createInterview: (data: CreateInterviewDTO) => Promise<Interview>;
  updateInterview: (id: string, data: Partial<UpdateInterviewDTO>) => Promise<void>;
  publishInterview: (id: string) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
  updateInterviewLink: (id: string, data: { expirationDate: string }) => Promise<string>;
}
```

### Kullanım

```typescript
const { 
  interviews, 
  selectedInterview,
  loading, 
  fetchInterviews,
  createInterview,
  publishInterview 
} = useInterviewStore();

// Yeni mülakat oluştur
const handleCreate = async (data) => {
  const newInterview = await createInterview(data);
  router.push(`/interviews/${newInterview._id}`);
};

// Mülakat yayınla
const handlePublish = async (id) => {
  await publishInterview(id);
  toast({ title: "Mülakat yayınlandı" });
};
```

### Optimistic Updates

```typescript
// State güncelleme örneği
publishInterview: async (id) => {
  set({ loading: true });
  try {
    const updatedInterview = await interviewService.publishInterview(id);
    
    // Optimistic update
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i._id === id ? { ...i, status: updatedInterview.status } : i
      ),
      selectedInterview: state.selectedInterview?._id === id 
        ? updatedInterview 
        : state.selectedInterview,
      loading: false,
    }));
    
    return updatedInterview;
  } catch (error) {
    set({ error: error.message, loading: false });
    throw error;
  }
},
```

---

## 📋 Application Store (`applicationStore.ts`)

Başvuru yönetimi durumunu yönetir.

### State

```typescript
interface ApplicationStore {
  applications: Application[];
  application: Application | null;
  loading: boolean;
  error: string | null;
  filters: Partial<ApplicationFilters>;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
```

### Actions

```typescript
interface ApplicationActions {
  setFilters: (newFilters: Partial<ApplicationFilters>) => void;
  fetchApplications: (page?: number) => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: ApplicationStatus) => Promise<void>;
  getApplicationsByInterviewId: (interviewId: string) => Promise<void>;
  clearApplication: () => void;
}
```

### Kullanım

```typescript
const { 
  applications, 
  filters, 
  pagination,
  setFilters, 
  fetchApplications,
  updateStatus 
} = useApplicationStore();

// Filtre değişikliği (otomatik fetch)
const handleSearch = (term) => {
  setFilters({ searchTerm: term });
};

// Durum güncelleme
const handleStatusChange = async (id, status) => {
  await updateStatus(id, status);
  toast({ title: "Durum güncellendi" });
};
```

---

## 🏠 Dashboard Store (`dashboardStore.ts`)

Dashboard verileri durumunu yönetir.

### State

```typescript
interface DashboardStore {
  applicationTrends: ApplicationTrend[];
  departmentApplications: DepartmentApplication[];
  candidateProfiles: CandidateProfile[];
  favoriteCandidates: FavoriteCandidate[];
}
```

### Actions

```typescript
interface DashboardActions {
  fetchDashboardData: () => Promise<void>;
}
```

---

## 📈 Reporting Store (`reportingStore.ts`)

Raporlama verileri durumunu yönetir.

### State

```typescript
interface ReportingStoreState {
  // Filtreler
  filters: ReportFilters;
  
  // Veriler
  kpiSummary: KPISummaryData | null;
  positionAnalysis: PositionAnalysisData[];
  candidateDistribution: CandidateDistributionData | null;
  questionEffectiveness: QuestionEffectivenessData[];
  aiHrAlignment: AIHRAlignmentData | null;
  timeTrends: TimeTrendsData | null;
  
  // Filtre seçenekleri
  availablePositions: PositionOption[];
  availableReviewers: ReviewerOption[];
  availableInterviewTypes: InterviewOption[];
  
  // Yükleme durumları
  isLoading: boolean;
  isLoadingKPI: boolean;
  // ... diğer loading states
  
  // Hata
  error: string | null;
  lastUpdated: string | null;
}
```

### Actions

```typescript
interface ReportingStoreActions {
  // Filtre işlemleri
  setFilters: (filters: Partial<ReportFilters>) => void;
  resetFilters: () => void;
  setDatePreset: (preset: "30d" | "60d" | "90d" | "custom") => void;
  
  // Veri çekme
  fetchAllReportData: () => Promise<void>;
  fetchKPISummary: () => Promise<void>;
  fetchPositionAnalysis: () => Promise<void>;
  fetchCandidateDistribution: () => Promise<void>;
  fetchQuestionEffectiveness: () => Promise<void>;
  fetchAIHRAlignment: () => Promise<void>;
  fetchTimeTrends: () => Promise<void>;
  
  // Filtre seçeneklerini yükle
  fetchFilterOptions: () => Promise<void>;
  
  // Helpers
  clearError: () => void;
}
```

---

## 🔔 Notification Store (`notification-store.ts`)

Bildirim durumunu yönetir.

### State

```typescript
interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}
```

### Actions

```typescript
interface NotificationActions {
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: CreateNotificationDTO) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  getUnreadCount: () => number;
}
```

### Persist Middleware

```typescript
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: "notification-storage", // localStorage key
    }
  )
);
```

---

## ⭐ Favorite Candidates Store (`favorite-candidates-store.ts`)

Favori adaylar durumunu yönetir.

### State

```typescript
interface FavoriteCandidatesStore {
  favorites: FavoriteCandidate[];
}
```

### Actions

```typescript
interface FavoriteCandidatesActions {
  addFavorite: (candidate: FavoriteCandidate) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
```

### Kullanım

```typescript
const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteCandidatesStore();

// Toggle favorite
const handleFavoriteToggle = (candidate) => {
  if (isFavorite(candidate._id)) {
    removeFavorite(candidate._id);
  } else {
    addFavorite({
      id: candidate._id,
      name: candidate.name,
      position: candidate.position,
      score: candidate.score,
    });
  }
};
```

---

## ❓ Question Store (`question-store.ts`)

Soru yönetimi durumunu yönetir.

### State

```typescript
interface QuestionStore {
  questions: InterviewQuestion[];
  isLoading: boolean;
  error: string | null;
}
```

### Actions

```typescript
interface QuestionActions {
  fetchQuestions: () => Promise<void>;
}
```

---

## 📅 Appointment Store (`appointmentStore.ts`)

Randevu yönetimi durumunu yönetir.

---

## 👨‍💼 Profile Store (`profileStore.ts`)

Kullanıcı profili durumunu yönetir.

---

## 🎯 Store Patterns

### 1. Selector Pattern

```typescript
// Store içinde selector
const useCandidatesByStatus = (status: CandidateStatus) => {
  return useCandidateStore(
    (state) => state.candidates.filter((c) => c.status === status)
  );
};

// Kullanım
const activeCandidates = useCandidatesByStatus("active");
```

### 2. Computed Values

```typescript
// Store içinde computed value
const getUnreadCount = () => {
  const { notifications } = get();
  return notifications.filter((n) => !n.read).length;
};
```

### 3. Cross-Store Communication

```typescript
// Bir store'dan diğerine erişim
import { useAuthStore } from "@/store/authStore";

// Service içinde
logout: async () => {
  await authService.logout();
  useAuthStore.getState().logout(); // Diğer store'a erişim
},
```

### 4. Middleware Usage

```typescript
// Persist middleware
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // store implementation
    }),
    {
      name: "store-key",
      partialize: (state) => ({ 
        // Sadece belirli alanları persist et
        favorites: state.favorites 
      }),
    }
  )
);
```

---

## 📦 Dependencies

- **zustand** - State management library
- **zustand/middleware** - Persist, devtools middleware

---

## 🚀 Best Practices

1. **Domain Separation**: Her domain kendi store'unda
2. **Type Safety**: Tam TypeScript tiplemesi
3. **Loading States**: Her async işlem için loading state
4. **Error Handling**: Merkezi hata yönetimi
5. **Optimistic Updates**: UI hızı için optimistic updates
6. **Selectors**: Gereksiz re-render'ları önlemek için
7. **Middleware**: Persist, devtools kullanımı
8. **Service Integration**: Store'lar services'i çağırır, direkt API çağrısı yapmaz
