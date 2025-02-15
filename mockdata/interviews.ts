export const mockInterviews = [
  {
    id: "int-001",
    title: "Senior Frontend Developer Interview",
    description: "React, JavaScript ve modern frontend teknolojileri üzerine teknik mülakat.",
    type: "Technical",
    status: "Active", // Active | Draft | Closed
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    duration: 45, // dakika
    aiEnabled: true, // AI destekli analiz kullanılıyor mu?
    personalityTest: true, // Kişilik envanteri var mı?
    questions: [
      {
        id: "q-001",
        text: "React'in Virtual DOM yapısını açıklayabilir misiniz?",
        type: "text",
        expectedAnswer: "Virtual DOM, React'in DOM manipülasyonlarını daha verimli yapabilmesini sağlar.",
        keywords: ["React", "Virtual DOM", "Performance"],
        timeLimit: 90, // Saniye
      },
      {
        id: "q-002",
        text: "JavaScript event loop nedir?",
        type: "text",
        expectedAnswer: "Event loop, JavaScript'in asenkron işlemleri yönetmesini sağlayan mekanizmadır.",
        keywords: ["JavaScript", "Event Loop", "Asynchronous"],
        timeLimit: 120,
      },
    ],
    permissions: {
      createdBy: "admin-001",
      assignedUsers: ["ik-123", "ik-456"], // Yetkili İK kullanıcıları
    },
  },
  {
    id: "int-002",
    title: "Product Manager Behavioral Interview",
    description: "Ürün yönetimi süreçleri ve ekip çalışması üzerine değerlendirme mülakatı.",
    type: "Behavioral",
    status: "Draft",
    startDate: "2024-03-01",
    endDate: "2024-03-10",
    duration: 60,
    aiEnabled: false,
    personalityTest: false,
    questions: [
      {
        id: "q-003",
        text: "Zor bir müşteriyle nasıl iletişim kurarsınız?",
        type: "text",
        expectedAnswer: "Empati yaparak, müşteri ihtiyaçlarını anlamaya çalışırım.",
        keywords: ["Empathy", "Communication", "Customer Service"],
        timeLimit: 60,
      },
    ],
    permissions: {
      createdBy: "admin-002",
      assignedUsers: ["ik-789"],
    },
  },
]

