import type { Interview } from "@/types/interview"

export const mockInterviews: Interview[] = [
  {
    id: "int-001",
    title: "Senior Frontend Developer Mülakatı",
    description: "React, TypeScript ve modern frontend teknolojileri üzerine teknik mülakat.",
    type: "questions_only", // ✅ Eksik olan "type" alanı eklendi
    totalDuration: 90,
    expirationDate: new Date("2024-07-15"),
    createdAt: new Date("2024-02-01"),
    status: "active",
    createdBy: "admin-001",
    link: "https://interview.example.com/int-001",
    linkExpiration: new Date("2024-07-10"),
    published: true, // ✅ Eksik olan "published" alanı eklendi
    evaluatedApplicants: 15, // ✅ Eksik olan "evaluatedApplicants" alanı eklendi
    stages: {
      personalityTest: true,
      questionnaire: true,
    },
    maxParticipants: 50,
    currentParticipants: 23,
    standardQuestionsIncluded: true,
    questions: [
      {
        id: "q-001",
        text: "React'in Virtual DOM yapısını açıklayabilir misiniz?",
        expectedAnswer: "Virtual DOM, React'in DOM manipülasyonlarını daha verimli yapabilmesini sağlar.",
        keywords: ["React", "Virtual DOM", "Performance"],
        duration: 180,
        order: 1,
        type: "text",
      },
      {
        id: "q-002",
        text: "TypeScript'in JavaScript'e göre avantajları nelerdir?",
        expectedAnswer: "TypeScript, statik tip kontrolü sağlayarak hataları erken tespit etmeye yardımcı olur.",
        keywords: ["TypeScript", "Static Typing", "JavaScript"],
        duration: 180,
        order: 2,
        type: "text",
      },
    ],
    applicantsCount: 1,
    applicants: [
      {
        id: "cand-001",
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "+90 555 123 4567",
        status: "pending",
        appliedAt: new Date("2024-03-05"),
      },
    ],
    results: [
      {
        candidateId: "cand-001",
        score: 85,
        comments: "Mükemmel performans gösterdi.",
        reviewedBy: "admin-002",
        reviewedAt: new Date("2024-07-20"),
      },
    ],
    averageScore: 78,
    hiringManager: "Ayşe Yılmaz",
    date: "15 Haziran 2023",
    updatedAt: "2024-07-12",
    updatedBy: "admin-002",
    interviewType: "Teknik + Davranışsal",
    aiRecommendation:
      "Aday John Doe, React ve TypeScript konularında güçlü bir profil sergiliyor. Değerlendirme için öncelikli olarak düşünülebilir.",
    location: "Remote",
    notes: "Candidate has strong skills in React and TypeScript.",
  },
  {
    id: "int-002",
    title: "Product Manager Davranışsal Mülakat",
    description: "Ürün yönetimi süreçleri ve ekip çalışması üzerine değerlendirme mülakatı.",
    type: "personality_and_questions", // ✅ Eksik olan "type" alanı eklendi
    totalDuration: 60,
    expirationDate: new Date("2024-08-15"),
    createdAt: new Date("2024-02-15"),
    status: "active",
    createdBy: "admin-002",
    link: "https://interview.example.com/int-002",
    linkExpiration: new Date("2024-08-10"),
    published: false, // ✅ Eksik olan "published" alanı eklendi
    evaluatedApplicants: 5, // ✅ Eksik olan "evaluatedApplicants" alanı eklendi
    stages: {
      personalityTest: true,
      questionnaire: true,
    },
    maxParticipants: 30,
    currentParticipants: 12,
    standardQuestionsIncluded: false,
    questions: [
      {
        id: "q-003",
        text: "Zorlu bir müşteriyle nasıl iletişim kurarsınız?",
        expectedAnswer: "Empati kurarak müşteri ihtiyaçlarını anlamaya çalışırım ve çözüm odaklı yaklaşırım.",
        keywords: ["Empati", "İletişim", "Müşteri İlişkileri"],
        duration: 240,
        order: 1,
        type: "text",
      },
      {
        id: "q-004",
        text: "Bir ürün geliştirme sürecinde karşılaştığınız en büyük zorluk neydi ve nasıl üstesinden geldiniz?",
        keywords: ["Problem Çözme", "Ürün Geliştirme", "Zorluklar"],
        duration: 300,
        order: 2,
        type: "text",
      },
    ],
    applicantsCount: 0,
    applicants: [],
    results: [],
    averageScore: 0,
    hiringManager: "Mehmet Can",
    date: "20 Temmuz 2023",
    updatedAt: "2024-08-10",
    updatedBy: "admin-003",
    interviewType: "Davranışsal",
    aiRecommendation:
      "Bu mülakatta adayların liderlik ve iletişim yetenekleri değerlendirilecektir.",
    location: "İstanbul",
    notes: "Bu mülakatta ekip içi uyum ön planda değerlendirilecek.",
  },
];
