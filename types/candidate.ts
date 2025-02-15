import type { Education, WorkExperience, Certification } from "./common"
import type { InterviewResult } from "./interview"

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: string
  nationality: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  currentPosition: string
  appliedPosition: string
  experience: number
  education: Education[]
  workExperience: WorkExperience[]
  skills: string[]
  languages: string[]
  certifications: Certification[]
  personalityType?: string
  linkedInProfile?: string
  github?: string
  portfolio?: string
  interviews: InterviewResult[];
  resumeUrl: string
  createdAt: string
  updatedAt: string
}

