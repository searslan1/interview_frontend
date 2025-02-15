export interface Education {
    degree: string
    institution: string
    yearOfCompletion: number
  }
  
  export interface WorkExperience {
    company: string
    position: string
    startDate: string
    endDate?: string | null
    responsibilities: string[]
  }
  
  export interface Certification {
    title: string
    organization: string
    year: number
  }
  
  export interface SubmittedDocument {
    type: string
    link: string
  }
  
  export interface HRNote {
    hrUserId: string
    note: string
    createdAt: string
  }
  
  