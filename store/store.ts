"use client"


import { create } from "zustand"

interface Interview {
  id: number
  title: string
  date: string
  applicants: number
}

interface Application {
  id: number
  name: string
  position: string
  status: string
}

interface AppState {
  interviews: Interview[]
  applications: Application[]
  addInterview: (interview: Interview) => void
  addApplication: (application: Application) => void
  updateInterviewStatus: (id: number, status: string) => void
  updateApplicationStatus: (id: number, status: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  interviews: [],
  applications: [],
  addInterview: (interview) => set((state) => ({ interviews: [...state.interviews, interview] })),
  addApplication: (application) => set((state) => ({ applications: [...state.applications, application] })),
  updateInterviewStatus: (id, status) =>
    set((state) => ({
      interviews: state.interviews.map((interview) => (interview.id === id ? { ...interview, status } : interview)),
    })),
  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    })),
}))

