export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  appliedPosition: string
  applicationDate: string
  status: "pending" | "interviewing" | "offered" | "rejected"
  resumeUrl: string
  interviewScores: {
    technicalSkills: number
    communicationSkills: number
    problemSolving: number
    culturalFit: number
  }
  personalityType: string
  aiScore: number
}

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    appliedPosition: "Frontend Developer",
    applicationDate: "2023-06-01",
    status: "interviewing",
    resumeUrl: "/resumes/ahmet-yilmaz-cv.pdf",
    interviewScores: {
      technicalSkills: 85,
      communicationSkills: 90,
      problemSolving: 88,
      culturalFit: 92,
    },
    personalityType: "INTJ",
    aiScore: 89,
  },
  {
    id: "2",
    name: "Ayşe Kaya",
    email: "ayse.kaya@example.com",
    phone: "+90 555 987 6543",
    appliedPosition: "UX Designer",
    applicationDate: "2023-06-03",
    status: "pending",
    resumeUrl: "/resumes/ayse-kaya-cv.pdf",
    interviewScores: {
      technicalSkills: 92,
      communicationSkills: 88,
      problemSolving: 85,
      culturalFit: 90,
    },
    personalityType: "ENFP",
    aiScore: 87,
  },
  {
    id: "3",
    name: "Mehmet Demir",
    email: "mehmet.demir@example.com",
    phone: "+90 555 246 8135",
    appliedPosition: "Backend Developer",
    applicationDate: "2023-06-02",
    status: "offered",
    resumeUrl: "/resumes/mehmet-demir-cv.pdf",
    interviewScores: {
      technicalSkills: 95,
      communicationSkills: 82,
      problemSolving: 93,
      culturalFit: 88,
    },
    personalityType: "ISTJ",
    aiScore: 92,
  },
  {
    id: "4",
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    phone: "+90 555 369 2580",
    appliedPosition: "Product Manager",
    applicationDate: "2023-06-04",
    status: "rejected",
    resumeUrl: "/resumes/zeynep-sahin-cv.pdf",
    interviewScores: {
      technicalSkills: 80,
      communicationSkills: 93,
      problemSolving: 85,
      culturalFit: 87,
    },
    personalityType: "ENTJ",
    aiScore: 84,
  },
]

