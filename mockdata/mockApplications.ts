import type { Application } from "@/types/application"

export const mockApplications: Application[] = [
  {
    id: "app-001",
    candidateId: "cand-001",
    interviewId: "int-001",
    interviewDetails: {
      title: "Senior Software Engineer Position",
      description: "A technical interview for a senior software engineer role.",
      type: "personality_and_questions",
      totalDuration: 60,
      stages: {
        personalityTest: true,
        questionnaire: true,
      },
      status: "active",
      createdBy: "Admin",
      createdAt: "2024-02-01T09:30:00.000Z",
      expirationDate: "2024-02-10T23:59:59.000Z",
    },
    status: "reviewing",
    submissionDate: "2024-02-02T15:30:00.000Z",
    completionStatus: "completed",
    submittedDocuments: [
      {
        type: "Resume",
        link: "https://example.com/resume/johndoe.pdf",
      },
      {
        type: "Portfolio",
        link: "https://johndoe.dev",
      },
    ],
    personalityTestResult: {
      completed: true,
      score: {
        openness: 85,
        conscientiousness: 90,
        extraversion: 70,
        agreeableness: 75,
        neuroticism: 60,
      },
      analysis: "Candidate is highly adaptable and open to new experiences. Well-suited for leadership roles.",
    },
    videoInterview: {
      submitted: true,
      videoLink: "https://example.com/interviews/johndoe.mp4",
      reviewStatus: "pending",
    },
    answers: [
      {
        questionId: "q-001",
        questionTitle: "React'in Virtual DOM yapısını açıklayabilir misiniz?",
        answerText:
          "Virtual DOM, React'in performans optimizasyonu için kullandığı bir tekniktir. Gerçek DOM'un hafif bir kopyası olarak çalışır. React, state değişikliklerinde önce Virtual DOM'u günceller, sonra gerçek DOM ile karşılaştırır ve sadece değişen kısımları günceller. Bu, gereksiz DOM manipülasyonlarını önleyerek uygulamanın daha hızlı çalışmasını sağlar.",
        videoUrl: "https://example.com/video/app-001-q001.mp4",
        duration: 170,
        aiAnalysis: {
          relevanceScore: 90,
          clarityScore: 85,
          technicalAccuracyScore: 88,
          overallScore: 88,
          feedback:
            "Aday, Virtual DOM kavramını doğru bir şekilde açıklamış ve performans avantajlarını vurgulamıştır. Ancak, reconciliation süreci hakkında daha fazla detay verilebilirdi.",
        },
      },
      {
        questionId: "q-002",
        questionTitle: "TypeScript'in JavaScript'e göre avantajları nelerdir?",
        answerText:
          "TypeScript, JavaScript'e statik tip kontrolü ekler. Bu, geliştirme aşamasında hataların erken tespit edilmesini sağlar. Ayrıca, kod tamamlama ve refactoring gibi IDE özelliklerini geliştirir, bu da geliştirici verimliliğini artırır. TypeScript, nesne yönelimli programlama özelliklerini de geliştirir ve büyük projelerde kod organizasyonunu kolaylaştırır.",
        videoUrl: "https://example.com/video/app-001-q002.mp4",
        duration: 165,
        aiAnalysis: {
          relevanceScore: 95,
          clarityScore: 90,
          technicalAccuracyScore: 92,
          overallScore: 92,
          feedback:
            "Aday, TypeScript'in avantajlarını kapsamlı bir şekilde açıklamış ve pratik örnekler vermiştir. Cevap, teknik derinlik ve netlik açısından oldukça tatmin edicidir.",
        },
      },
    ],
    aiEvaluation: {
      overallScore: 90,
      technicalSkillsScore: 92,
      communicationScore: 88,
      problemSolvingScore: 85,
      culturalFitScore: 89,
      strengths: ["Güçlü teknik bilgi", "Açık ve net iletişim", "Kavramları iyi açıklama yeteneği"],
      areasForImprovement: [
        "Bazı teknik konularda daha derine inebilir",
        "Pratik örnekler verme konusunda geliştirilebilir",
      ],
      recommendation:
        "Aday, Senior Frontend Developer pozisyonu için güçlü bir profil sergiliyor. Teknik bilgisi ve iletişim becerileri etkileyici. İkinci aşama mülakata geçmesi önerilir.",
    },
    hrNotes: [
      {
        hrUserId: "hr987",
        note: "Strong technical background, personality test score is excellent.",
        createdAt: "2024-02-03T14:00:00.000Z",
      },
    ],
    createdAt: "2024-02-02T10:15:00.000Z",
    updatedAt: "2024-02-04T12:30:00.000Z",
  },
  {
    id: "app-002",
    candidateId: "cand-002",
    interviewId: "int-002",
    interviewDetails: {
      title: "Lead Backend Engineer Hiring Process",
      description: "A comprehensive technical and personality assessment.",
      type: "personality_and_questions",
      totalDuration: 90,
      stages: {
        personalityTest: true,
        questionnaire: true,
      },
      status: "active",
      createdBy: "Admin",
      createdAt: "2024-02-01T09:30:00.000Z",
      expirationDate: "2024-02-15T23:59:59.000Z",
    },
    status: "reviewing",
    submissionDate: "2024-02-02T18:45:00.000Z",
    completionStatus: "completed",
    submittedDocuments: [
      {
        type: "Resume",
        link: "https://example.com/resume/janesmith.pdf",
      },
      {
        type: "Portfolio",
        link: "https://janesmith.dev",
      },
    ],
    personalityTestResult: {
      completed: true,
      score: {
        openness: 80,
        conscientiousness: 85,
        extraversion: 75,
        agreeableness: 70,
        neuroticism: 65,
      },
      analysis: "Candidate exhibits a strong problem-solving ability and innovation-oriented mindset.",
    },
    videoInterview: {
      submitted: true,
      videoLink: "https://example.com/interviews/janesmith.mp4",
      reviewStatus: "pending",
    },
    answers: [
      {
        questionId: "q-003",
        questionTitle: "Node.js'in Event Loop mekanizmasını açıklayabilir misiniz?",
        answerText:
          "Node.js'in event loop'u asenkron işlemleri yönetmek için kullanılan temel mekanizmadır. Non-blocking I/O modelini sağlar ve JavaScript'in tek iş parçacıklı olmasına rağmen yüksek verimli çalışmasını mümkün kılar.",
        videoUrl: "https://example.com/video/app-002-q003.mp4",
        duration: 140,
        aiAnalysis: {
          relevanceScore: 92,
          clarityScore: 88,
          technicalAccuracyScore: 91,
          overallScore: 90,
          feedback:
            "Aday, Node.js'in event loop mekanizmasını detaylı bir şekilde açıklamış. Ancak, event loop'un callback queue ile ilişkisi daha fazla detaylandırılabilirdi.",
        },
      },
    ],
    aiEvaluation: {
      overallScore: 91,
      technicalSkillsScore: 94,
      communicationScore: 89,
      problemSolvingScore: 87,
      culturalFitScore: 88,
      strengths: ["Derin teknik bilgi", "Etkili iletişim becerileri"],
      areasForImprovement: ["Daha fazla pratik örnek verilebilir"],
      recommendation:
        "Aday, Lead Backend Engineer pozisyonu için uygun bir profil sergiliyor. Teknik değerlendirme olumlu, son görüşmeye davet edilmesi önerilir.",
    },
    hrNotes: [
      {
        hrUserId: "hr123",
        note: "Güçlü teknik bilgi, iletişim becerileri çok iyi. Kişilik testi sonucu pozisyona uygun.",
        createdAt: "2024-02-03T14:30:00.000Z",
      },
    ],
    createdAt: "2024-02-02T10:15:00.000Z",
    updatedAt: "2024-02-04T12:30:00.000Z",
  },
]

