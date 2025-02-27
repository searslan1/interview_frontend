export interface CandidateEducation {
  school: string;
  degree: string;
  graduationYear: number;
}

export interface CandidateExperience {
  company: string;
  position: string;
  duration: string;
  responsibilities?: string;
}

export interface CandidateSkills {
  technical: string[];
  personal: string[];
  languages: string[];
}

export interface CandidateDocuments {
  resume?: string;
  certificates?: string[];
  socialMediaLinks?: string[];
}

export interface Candidate {
  name: string;
  surname: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  kvkkConsent?: boolean;
  education?: CandidateEducation[];
  experience?: CandidateExperience[];
  skills?: CandidateSkills;
  documents?: CandidateDocuments;
}
