# 📝 Types Module - TypeScript Tip Tanımları

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nin tüm TypeScript tip tanımlamalarını içerir. Tip güvenliği (type safety) sağlayarak development deneyimini iyileştirir ve runtime hatalarını minimize eder.

## 🏗️ Mimari Yapı

```
types/
├── README.md                  # Bu dokümantasyon
├── user.ts                    # 👤 Kullanıcı tipleri
├── candidate.ts               # 👥 Aday tipleri
├── interview.ts               # 🎤 Mülakat tipleri
├── application.ts             # 📋 Başvuru tipleri
├── question.ts                # ❓ Soru tipleri
├── notification.ts            # 🔔 Bildirim tipleri
├── report.ts                  # 📈 Rapor tipleri
├── appointment.ts             # 📅 Randevu tipleri
├── dashboardData.ts           # 🏠 Dashboard veri tipleri
├── personalityInventory.ts    # 🧠 Kişilik envanteri tipleri
│
├── createInterviewDTO.ts      # DTO: Mülakat oluşturma
├── updateInterviewDTO.ts      # DTO: Mülakat güncelleme
└── extendDurationDTO.ts       # DTO: Süre uzatma
```

---

## 👤 User Types (`user.ts`)

Kullanıcı ve yetkilendirme tipleri.

### User Role

```typescript
export type UserRole = "admin" | "company" | "user" | "super_admin";
```

### User Interface

```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;

  // Güvenlik & Hesap Durumu
  emailVerified: boolean;
  phoneVerified: boolean;
  phone?: string;
  failedLoginAttempts: number;
  accountLockedUntil?: string;
  twoFactorEnabled: boolean;
  lastActiveAt?: string;
  preferences?: UserPreference;

  // Profil Bilgileri
  profilePicture?: string;
  bio?: string;

  // Erişim İzinleri
  permissions: {
    module: string;
    accessLevel: "read" | "write" | "delete";
  }[];

  // Zaman damgaları
  createdAt: string;
  updatedAt: string;
}
```

### User Preference

```typescript
export interface UserPreference {
  userId: string;
  language: "en" | "es" | "fr" | "tr";
  theme: {
    mode: "light" | "dark";
    customColors?: Record<string, string>;
  };
  notificationsEnabled: boolean;
  timezone: string;
}
```

---

## 👥 Candidate Types (`candidate.ts`)

Aday yönetimi (Talent Pool) tipleri.

### Candidate Status

```typescript
export type CandidateStatus = 
  | "active"      // Aktif aday
  | "reviewed"    // İncelenmiş
  | "shortlisted" // Kısa listeye alınmış
  | "archived";   // Arşivlenmiş (Rejected)
```

### Candidate Interface

```typescript
export interface Candidate {
  // Temel bilgiler
  _id: string;
  id?: string;                    // Legacy uyumluluk
  name: string;
  surname: string;
  fullName?: string;
  email?: string;
  primaryEmail?: string;
  phone?: string;
  phoneVerified?: boolean;
  
  // Profil bilgileri
  avatar?: string;
  kvkkConsent?: boolean;
  education?: CandidateEducation[];
  experience?: CandidateExperience[];
  skills?: CandidateSkills;
  documents?: CandidateDocuments;
  
  // Talent Pool durumu
  status: CandidateStatus;
  isFavorite?: boolean;
  
  // Mülakat istatistikleri
  interviewCount?: number;
  lastInterviewDate?: string;
  lastInterviewTitle?: string;
  lastAppliedPosition?: string;
  appliedPositions?: string[];
  
  // Skorlama
  aggregateScore?: CandidateAggregateScore;
  scoreSummary?: CandidateScoreSummary;
  
  // Mülakat geçmişi
  interviews?: CandidateInterviewSummary[];
  
  // HR notları
  notes?: CandidateNote[];
  
  // E-posta alias'ları
  emailAliases?: string[];
  
  // Olası eşleşmeler
  possibleMatches?: CandidatePossibleMatch[];
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  archivedReason?: string;
}
```

### Alt Tipler

```typescript
// Eğitim bilgisi
export interface CandidateEducation {
  school: string;
  degree: string;
  graduationYear: number;
  field?: string;
}

// Deneyim bilgisi
export interface CandidateExperience {
  company: string;
  position: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  responsibilities?: string;
}

// Yetkinlikler
export interface CandidateSkills {
  technical: string[];
  personal: string[];
  languages: string[];
}

// Belgeler
export interface CandidateDocuments {
  resume?: string;
  certificates?: string[];
  socialMediaLinks?: string[];
  portfolio?: string;
}

// Aggregate Skor
export interface CandidateAggregateScore {
  overall?: number;
  technical?: number;
  communication?: number;
  problemSolving?: number;
  leadership?: number;
  culture?: number;
  lastUpdated?: string;
}

// HR Notu
export interface CandidateNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Filter Types

```typescript
export interface CandidateFilters {
  searchTerm?: string;
  searchQuery?: string;
  status?: CandidateStatus | "all";
  position?: string;
  minInterviewCount?: number;
  maxInterviewCount?: number;
  dateFrom?: string;
  dateTo?: string;
  dateRange?: { from?: Date; to?: Date };
  minScore?: number;
  maxScore?: number;
  minAiScore?: number;
  maxAiScore?: number;
  isFavorite?: boolean;
  showArchived?: boolean;
  experienceLevel?: "all" | "entry" | "mid" | "senior";
}

export type CandidateSortBy = 
  | "lastInterviewDate"
  | "name"
  | "score"
  | "interviewCount"
  | "createdAt";

export type CandidateSortOrder = "asc" | "desc";
```

---

## 🎤 Interview Types (`interview.ts`)

Mülakat yönetimi tipleri.

### Interview Status

```typescript
export enum InterviewStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DRAFT = "draft",
  INACTIVE = "inactive"
}
```

### Interview Type

```typescript
export type InterviewType = 
  | "async-video"    // Asenkron video mülakat
  | "live-video"     // Canlı video mülakat
  | "audio-only"     // Sadece ses
  | "text-based";    // Metin tabanlı
```

### Interview Interface

```typescript
export interface Interview {
  _id: string;
  title: string;
  description?: string;
  expirationDate: string;
  type?: InterviewType;
  position?: InterviewPosition;
  createdBy: {
    userId: string;
  };
  status: InterviewStatus;
  personalityTestId?: string;
  stages: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  interviewLink?: {
    link: string;
    expirationDate?: string;
  };
  questions: InterviewQuestion[];
  createdAt: string;
  updatedAt: string;
}
```

### Interview Position

```typescript
export interface InterviewPosition {
  title: string;
  department?: string;
  competencyWeights?: CompetencyWeights;
  description?: string;
}

export interface CompetencyWeights {
  technical?: number;
  communication?: number;
  problem_solving?: number;
}
```

### Interview Question

```typescript
export interface InterviewQuestion {
  _id?: string;
  questionText: string;
  expectedAnswer: string;
  explanation?: string;
  keywords: string[];
  order: number;
  duration: number;
  aiMetadata: {
    complexityLevel: "low" | "medium" | "high" | "intermediate" | "advanced";
    requiredSkills: string[];
    keywordMatchScore?: number;
  };
}
```

### Store Types

```typescript
export interface InterviewStoreState {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: boolean;
  error: string | null;
}

export interface InterviewStoreActions {
  fetchInterviews: () => Promise<void>;
  getInterviewById: (id: string) => Promise<void>;
  createInterview: (data: CreateInterviewDTO) => Promise<Interview>;
  updateInterview: (id: string, data: Partial<UpdateInterviewDTO>) => Promise<void>;
  publishInterview: (id: string) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
  updateInterviewLink: (id: string, data: { expirationDate: string }) => Promise<string>;
}
```

---

## 📋 Application Types (`application.ts`)

Başvuru yönetimi tipleri.

### Application Status

```typescript
export type ApplicationStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'accepted'
  | 'awaiting_video_responses'
  | 'awaiting_ai_analysis';
```

### Application Interface

```typescript
export interface Application {
  id: string;
  _id: string;
  interviewId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  responses: ApplicationResponse[];
  experience: CandidateExperience[];
  personalityTestResults?: PersonalityTestResults;
  aiAnalysisResults: string[];
  latestAIAnalysisId?: string;
  generalAIAnalysis?: GeneralAIAnalysis;
  allowRetry: boolean;
  maxRetryAttempts?: number;
  retryCount?: number;
  supportRequests: SupportRequest[];
  createdAt: string;
  updatedAt: string;
}
```

### Alt Tipler

```typescript
export interface ApplicationResponse {
  questionId: string;
  videoUrl?: string;
  textAnswer?: string;
  duration?: number;
}

export interface PersonalityTestResults {
  testId: string;
  completed: boolean;
  scores?: PersonalityTestScores;
  personalityFit?: number;
}

export interface PersonalityTestScores {
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
}

export interface GeneralAIAnalysis {
  overallScore?: number;
  technicalSkillsScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  personalityMatchScore?: number;
  strengths?: string[];
  areasForImprovement?: {
    area: string;
    recommendedAction: string;
  }[];
  recommendation?: string;
}
```

### Filter Types

```typescript
export interface ApplicationFilters {
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

## ❓ Question Types (`question.ts`)

Mülakat soruları tipleri.

```typescript
export interface Question {
  _id?: string;
  questionText: string;
  expectedAnswer?: string;
  explanation?: string;
  keywords: string[];
  order: number;
  duration: number;
  category?: string;
  aiMetadata?: {
    complexityLevel: "low" | "medium" | "high";
    requiredSkills: string[];
  };
}
```

---

## 🔔 Notification Types (`notification.ts`)

Bildirim tipleri.

```typescript
export type NotificationType = 
  | "info"
  | "success"
  | "warning"
  | "error"
  | "interview"
  | "application"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
```

---

## 📈 Report Types (`report.ts`)

Raporlama tipleri.

```typescript
export interface ReportFilters {
  positions: string[];
  dateRange: { from: string; to: string };
  datePreset: "30d" | "60d" | "90d" | "custom";
  tags: string[];
  favoritesOnly: boolean;
}

export interface KPISummaryData {
  totalApplications: number;
  totalApplicationsChange: number;
  evaluatedInterviews: number;
  evaluatedInterviewsChange: number;
  favoritesRate: number;
  favoritesRateChange: number;
  averageRoleFit: number;
  averageRoleFitChange: number;
  averageInterviewDuration: number;
  averageInterviewDurationChange: number;
}

export interface PositionAnalysisData {
  position: string;
  positionId: string;
  highFit: number;
  mediumFit: number;
  lowFit: number;
  total: number;
  highFitPercent: number;
  mediumFitPercent: number;
  lowFitPercent: number;
}

export interface CandidateDistributionData {
  roleFitDistribution: RoleFitBucket[];
  communicationVsTechnical: ScatterPoint[];
}
```

---

## 📅 Appointment Types (`appointment.ts`)

Randevu tipleri.

```typescript
export interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  location?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
```

---

## 🏠 Dashboard Data Types (`dashboardData.ts`)

Dashboard veri tipleri.

```typescript
export interface ApplicationTrend {
  date: string;
  count: number;
}

export interface DepartmentApplication {
  department: string;
  count: number;
}

export interface CandidateProfile {
  experience: string;
  count: number;
}

export interface FavoriteCandidate {
  id: string;
  name: string;
  position: string;
  score: number;
  addedAt?: string;
}
```

---

## 🧠 Personality Inventory Types (`personalityInventory.ts`)

Kişilik envanteri tipleri.

```typescript
export interface PersonalityInventory {
  testId: string;
  name: string;
  questions: PersonalityQuestion[];
  scoringRules: ScoringRule[];
}

export interface PersonalityQuestion {
  id: string;
  text: string;
  category: PersonalityCategory;
  options: QuestionOption[];
}

export type PersonalityCategory = 
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";
```

---

## 📤 DTO Types (Data Transfer Objects)

### CreateInterviewDTO (`createInterviewDTO.ts`)

```typescript
export interface CreateInterviewDTO {
  title: string;
  description?: string;
  expirationDate: string | Date;
  type?: InterviewType;
  position?: InterviewPosition;
  personalityTestId?: string;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
}

// Zod validation schema
export const createInterviewSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().optional(),
  expirationDate: z.string(),
  type: z.enum(["async-video", "live-video", "audio-only", "text-based"]).optional(),
  position: z.object({
    title: z.string(),
    department: z.string().optional(),
    description: z.string().optional(),
    competencyWeights: z.object({
      technical: z.number(),
      communication: z.number(),
      problem_solving: z.number(),
    }).optional(),
  }).optional(),
  // ...
});
```

### UpdateInterviewDTO (`updateInterviewDTO.ts`)

```typescript
export interface UpdateInterviewDTO {
  title?: string;
  description?: string;
  expirationDate?: string | Date;
  type?: InterviewType;
  position?: InterviewPosition;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
  personalityTestId?: string;
}
```

### ExtendDurationDTO (`extendDurationDTO.ts`)

```typescript
export interface ExtendDurationDTO {
  interviewId: string;
  newExpirationDate: string;
}
```

---

## 🎯 Type Patterns

### 1. Union Types

```typescript
type Status = "active" | "inactive" | "pending";
type Role = "admin" | "user" | "guest";
```

### 2. Enum vs String Literal Union

```typescript
// Enum kullanımı (runtime'da da var)
enum InterviewStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

// String literal union (sadece type-level)
type CandidateStatus = "active" | "reviewed" | "archived";
```

### 3. Optional Properties

```typescript
interface User {
  id: string;        // Zorunlu
  name: string;      // Zorunlu
  avatar?: string;   // Opsiyonel
  bio?: string;      // Opsiyonel
}
```

### 4. Partial Type

```typescript
// Tüm property'leri opsiyonel yapar
type UpdateUserDTO = Partial<User>;
```

### 5. Pick & Omit

```typescript
// Sadece belirli property'leri seç
type UserBasic = Pick<User, "id" | "name">;

// Belirli property'leri çıkar
type UserWithoutId = Omit<User, "id">;
```

### 6. Generic Types

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Kullanım
type PaginatedCandidates = PaginatedResponse<Candidate>;
```

---

## 📦 Dependencies

- **TypeScript** - Type system
- **Zod** - Runtime validation schemas

---

## 🚀 Best Practices

1. **Explicit Types**: `any` kullanımından kaçın
2. **Interface vs Type**: Object shapes için interface, unions için type
3. **Readonly**: Immutable data için readonly kullan
4. **Strict Mode**: tsconfig'de strict mode aktif
5. **Documentation**: Complex type'lar için JSDoc yorumları
6. **Naming Convention**: Interface'ler için PascalCase
7. **Barrel Exports**: index.ts ile toplu export
8. **DTO Pattern**: API iletişimi için DTO'lar kullan
