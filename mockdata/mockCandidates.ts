import type { Candidate } from "@/types/candidate"

export const mockCandidates: Candidate[] = [
  {
    id: "cand-001",
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    dateOfBirth: "1995-06-15",
    gender: "male",
    nationality: "American",
    address: {
      street: "123 Main St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    currentPosition: "Software Engineer",
    appliedPosition: "Senior Software Engineer",
    experience: 5,
    education: [
      {
        degree: "Bachelor's in Computer Science",
        institution: "University of California, Berkeley",
        yearOfCompletion: 2017,
      },
      {
        degree: "Master's in Artificial Intelligence",
        institution: "Stanford University",
        yearOfCompletion: 2020,
      },
    ],
    workExperience: [
      {
        company: "Google",
        position: "Software Engineer",
        startDate: "2020-08-01",
        endDate: "2023-05-30",
        responsibilities: ["Developed scalable web applications", "Implemented AI-driven analytics tools"],
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "AI/ML", "Python", "MongoDB"],
    languages: ["English", "Spanish"],
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        organization: "Amazon Web Services",
        year: 2022,
      },
    ],
    linkedInProfile: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
    resumeUrl: "https://example.com/resume/johndoe.pdf",
    createdAt: "2024-02-04T12:00:00.000Z",
    updatedAt: "2024-02-04T12:30:00.000Z",
  },
  {
    id: "cand-002",
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+1987654321",
    dateOfBirth: "1992-09-25",
    gender: "female",
    nationality: "Canadian",
    address: {
      street: "456 Queen St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2B1",
      country: "Canada",
    },
    currentPosition: "Senior Backend Engineer",
    appliedPosition: "Lead Backend Engineer",
    experience: 8,
    education: [
      {
        degree: "Bachelor's in Computer Engineering",
        institution: "University of Toronto",
        yearOfCompletion: 2014,
      },
      {
        degree: "Master's in Software Architecture",
        institution: "MIT",
        yearOfCompletion: 2017,
      },
    ],
    workExperience: [
      {
        company: "Amazon",
        position: "Backend Engineer",
        startDate: "2018-06-01",
        endDate: "2022-12-31",
        responsibilities: [
          "Designed scalable microservices architecture",
          "Optimized backend performance for large-scale applications",
        ],
      },
      {
        company: "Shopify",
        position: "Senior Backend Engineer",
        startDate: "2023-01-01",
        endDate: null,
        responsibilities: ["Led the migration to a distributed system", "Implemented AI-driven fraud detection"],
      },
    ],
    skills: ["Node.js", "TypeScript", "GraphQL", "AWS", "Docker", "Kubernetes"],
    languages: ["English", "French"],
    certifications: [
      {
        title: "Google Cloud Professional Architect",
        organization: "Google",
        year: 2021,
      },
    ],
    personalityType: "ENTP",
    linkedInProfile: "https://linkedin.com/in/janesmith",
    github: "https://github.com/janesmith",
    portfolio: "https://janesmith.dev",
    resumeUrl: "https://example.com/resume/janesmith.pdf",
    createdAt: "2024-02-04T12:00:00.000Z",
    updatedAt: "2024-02-04T12:30:00.000Z",
  },
]

