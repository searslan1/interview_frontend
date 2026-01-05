# 🛠️ Lib Module - Yardımcı Kütüphaneler

## 📋 Genel Bakış

Bu modül, HR-AI İnsan Kaynakları Yönetim Paneli'nde kullanılan genel yardımcı fonksiyonları ve mock verileri içerir.

## 🏗️ Mimari Yapı

```
lib/
├── utils.ts               # 🛠️ Genel yardımcı fonksiyonlar (cn, vb.)
├── mockData.ts            # 📊 Mock veri tanımları
└── mock-applications.ts   # 📋 Mock başvuru verileri
```

---

## 🛠️ Utils (`utils.ts`)

Tailwind CSS ve genel yardımcı fonksiyonlar.

### cn() - Class Name Merger

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS class'larını birleştirir ve çakışmaları çözer
 * @param inputs - Class değerleri
 * @returns Birleştirilmiş class string'i
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Kullanım Örnekleri

```tsx
// Temel kullanım
<div className={cn("px-4 py-2", "bg-blue-500")} />
// Output: "px-4 py-2 bg-blue-500"

// Conditional classes
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  isDisabled && "disabled-styles"
)} />

// Variant pattern
<button className={cn(
  "px-4 py-2 rounded",
  variant === "primary" && "bg-primary text-white",
  variant === "secondary" && "bg-gray-200 text-gray-800",
  variant === "ghost" && "bg-transparent hover:bg-gray-100"
)} />

// Class çakışma çözümü
<div className={cn("p-4", "p-8")} />
// Output: "p-8" (twMerge çakışmayı çözer)

// Prop olarak gelen class ile birleştirme
interface ButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
}

function Button({ className, variant = "primary" }: ButtonProps) {
  return (
    <button className={cn(
      "px-4 py-2 rounded font-medium",
      variant === "primary" && "bg-primary text-white",
      variant === "secondary" && "bg-gray-200",
      className // En son, override yapabilmesi için
    )}>
      Click
    </button>
  );
}
```

### Neden cn() Kullanmalıyız?

1. **Conditional Classes**: `&&` ile koşullu class ekleme
2. **Conflict Resolution**: `twMerge` ile Tailwind çakışmalarını çözme
3. **Clean Syntax**: Temiz ve okunabilir kod
4. **Type Safety**: TypeScript desteği
5. **Component Props**: Dışarıdan class alabilme

---

## 📊 Mock Data (`mockData.ts`)

Development ve test için mock veri tanımları.

### Amaç

- Backend bağımsız UI geliştirme
- Component testing
- Demo ve prezentasyon
- Rapid prototyping

### Mock Kullanıcılar

```typescript
export const mockUsers = [
  {
    _id: "user_001",
    name: "Ahmet Yılmaz",
    email: "ahmet@company.com",
    role: "admin",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    _id: "user_002",
    name: "Elif Demir",
    email: "elif@company.com",
    role: "company",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
];
```

### Mock Mülakatlar

```typescript
export const mockInterviews = [
  {
    _id: "interview_001",
    title: "Senior Frontend Developer",
    description: "React/Next.js deneyimli frontend geliştirici arıyoruz.",
    status: "published",
    type: "async-video",
    expirationDate: "2024-06-30T23:59:59Z",
    position: {
      title: "Senior Frontend Developer",
      department: "Engineering",
      competencyWeights: {
        technical: 50,
        communication: 30,
        problem_solving: 20,
      },
    },
    questions: [
      {
        _id: "q_001",
        questionText: "React hooks hakkında bilginizi paylaşır mısınız?",
        expectedAnswer: "useState, useEffect, useCallback, useMemo...",
        keywords: ["hooks", "useState", "useEffect"],
        duration: 120,
        order: 1,
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];
```

### Mock Adaylar

```typescript
export const mockCandidates = [
  {
    _id: "candidate_001",
    name: "Ali",
    surname: "Kaya",
    email: "ali.kaya@email.com",
    phone: "+90 532 123 4567",
    status: "active",
    education: [
      {
        school: "İstanbul Teknik Üniversitesi",
        degree: "Lisans",
        field: "Bilgisayar Mühendisliği",
        graduationYear: 2020,
      },
    ],
    experience: [
      {
        company: "Tech Company A",
        position: "Frontend Developer",
        duration: "2 yıl",
        startDate: "2020-06",
        endDate: "2022-06",
      },
    ],
    skills: {
      technical: ["JavaScript", "React", "TypeScript", "Node.js"],
      personal: ["Takım çalışması", "İletişim"],
      languages: ["Türkçe", "İngilizce"],
    },
    aggregateScore: {
      overall: 85,
      technical: 90,
      communication: 80,
      problemSolving: 85,
    },
    interviewCount: 3,
    lastInterviewDate: "2024-03-15T14:00:00Z",
  },
];
```

### Mock Dashboard Verileri

```typescript
export const mockDashboardData = {
  applicationTrends: [
    { date: "2024-01-01", count: 45 },
    { date: "2024-01-08", count: 52 },
    { date: "2024-01-15", count: 38 },
    { date: "2024-01-22", count: 67 },
  ],
  departmentApplications: [
    { department: "Engineering", count: 120 },
    { department: "Product", count: 45 },
    { department: "Design", count: 30 },
    { department: "Marketing", count: 25 },
  ],
  candidateProfiles: [
    { experience: "0-2 yıl", count: 80 },
    { experience: "2-5 yıl", count: 150 },
    { experience: "5-10 yıl", count: 90 },
    { experience: "10+ yıl", count: 40 },
  ],
};
```

---

## 📋 Mock Applications (`mock-applications.ts`)

Başvuru mock verileri.

```typescript
export const mockApplications = [
  {
    _id: "app_001",
    interviewId: "interview_001",
    candidate: {
      _id: "candidate_001",
      name: "Ali",
      surname: "Kaya",
      email: "ali.kaya@email.com",
      avatar: "/placeholder-user.jpg",
    },
    status: "completed",
    responses: [
      {
        questionId: "q_001",
        videoUrl: "https://example.com/video1.mp4",
        duration: 115,
      },
    ],
    generalAIAnalysis: {
      overallScore: 85,
      technicalSkillsScore: 90,
      communicationScore: 80,
      problemSolvingScore: 85,
      strengths: [
        "Güçlü teknik bilgi",
        "İyi iletişim becerileri",
      ],
      areasForImprovement: [
        {
          area: "Problem çözme",
          recommendedAction: "Case study pratikleri yapılabilir",
        },
      ],
      recommendation: "Pozisyon için güçlü bir aday.",
    },
    createdAt: "2024-03-01T10:30:00Z",
    updatedAt: "2024-03-01T14:45:00Z",
  },
  {
    _id: "app_002",
    interviewId: "interview_001",
    candidate: {
      _id: "candidate_002",
      name: "Ayşe",
      surname: "Demir",
      email: "ayse.demir@email.com",
    },
    status: "pending",
    responses: [],
    createdAt: "2024-03-02T09:00:00Z",
    updatedAt: "2024-03-02T09:00:00Z",
  },
  {
    _id: "app_003",
    interviewId: "interview_001",
    candidate: {
      _id: "candidate_003",
      name: "Mehmet",
      surname: "Öz",
      email: "mehmet.oz@email.com",
    },
    status: "in_progress",
    responses: [
      {
        questionId: "q_001",
        videoUrl: "https://example.com/video3.mp4",
        duration: 90,
      },
    ],
    createdAt: "2024-03-03T11:00:00Z",
    updatedAt: "2024-03-03T15:30:00Z",
  },
];
```

---

## 🎯 Mock Data Patterns

### 1. Factory Functions

```typescript
// Mock veri oluşturma factory
export const createMockCandidate = (overrides?: Partial<Candidate>): Candidate => ({
  _id: `candidate_${Math.random().toString(36).substr(2, 9)}`,
  name: "Test",
  surname: "User",
  email: "test@example.com",
  status: "active",
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Kullanım
const candidate1 = createMockCandidate();
const candidate2 = createMockCandidate({ name: "Custom", status: "archived" });
```

### 2. Faker Integration

```typescript
import { faker } from "@faker-js/faker/locale/tr";

export const generateMockCandidates = (count: number): Candidate[] => {
  return Array.from({ length: count }, () => ({
    _id: faker.string.uuid(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    status: faker.helpers.arrayElement(["active", "reviewed", "shortlisted"]),
    // ...
  }));
};
```

### 3. Conditional Mock Usage

```typescript
// Environment'a göre mock veya gerçek veri
export const getCandidates = async () => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return mockCandidates;
  }
  return await candidateService.getCandidates();
};
```

---

## 📦 Dependencies

- **clsx** - Class name construction
- **tailwind-merge** - Tailwind class merging
- **@faker-js/faker** (opsiyonel) - Fake data generation

---

## 🚀 Best Practices

1. **Type Consistency**: Mock veriler gerçek tiplere uygun olmalı
2. **Realistic Data**: Gerçekçi değerler kullan
3. **Edge Cases**: Edge case'leri de mock'la
4. **Lazy Loading**: Büyük mock verileri için lazy loading
5. **Environment Separation**: Production'da mock kullanma
6. **Documentation**: Mock verinin neyi temsil ettiğini belgele
