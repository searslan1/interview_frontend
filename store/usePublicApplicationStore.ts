// src/store/publicApplicationStore.ts

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import publicApplicationService, { 
  PublicInterviewData, 
  StartApplicationDTO, 
  VerifyOtpDTO, 
  UpdateProfileDTO
} from "@/services/publicApplicationService";
import { Application } from "@/types/application"; 

export type AppStep = 
  | "landing"         
  | "auth"            
  | "wizard-profile"  
  | "wizard-docs"     
  | "system-check"    
  | "exam-intro"      
  | "exam-active"     
  | "completed";      

interface PublicApplicationState {
  interview: PublicInterviewData | null;
  application: Application | null;
  
  // Session
  token: string | null;
  isAuthenticated: boolean;
  tempApplicationId: string | null; // ✅ YENİ: Auth aşamasında ID'yi tutmak için
  
  // UI
  currentStep: AppStep;
  isLoading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  
  // Exam
  currentQuestionIndex: number;
  uploadQueue: string[];
  isUploading: boolean;
}

interface PublicApplicationActions {
  initInterview: (interviewId: string) => Promise<void>;
  startSession: (data: StartApplicationDTO) => Promise<void>;
  // verifySession parametresini esnek yaptık
  verifySession: (data: { otpCode: string, applicationId?: string }) => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => void;
  updateProfileDraft: (section: keyof UpdateProfileDTO, data: any) => Promise<void>;
  completeWizard: () => void;
  startExam: () => void;
  nextQuestion: () => void;
  addToUploadQueue: (questionId: string) => void;
  removeFromUploadQueue: (questionId: string) => void;
  setStep: (step: AppStep) => void;
  setError: (msg: string | null) => void;
}

export const usePublicApplicationStore = create<PublicApplicationState & PublicApplicationActions>()(
  persist(
    (set, get) => ({
      // Initial State
      interview: null,
      application: null,
      token: null,
      isAuthenticated: false,
      tempApplicationId: null, // ✅ YENİ
      currentStep: "landing",
      isLoading: false,
      error: null,
      isSidebarOpen: false,
      currentQuestionIndex: 0,
      uploadQueue: [],
      isUploading: false,

      // 1. INITIALIZATION
      initInterview: async (interviewId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await publicApplicationService.getInterviewInfo(interviewId);
          set({ interview: data, isLoading: false });
          const state = get();
          if (state.token) await state.resumeSession();
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Mülakat bilgileri yüklenemedi.", isLoading: false });
        }
      },

      // 2. SESSION HANDLERS
      startSession: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await publicApplicationService.startApplication(data);
          // ✅ Backend'den dönen ID'yi temp olarak sakla
          set({ 
            tempApplicationId: response.applicationId || response._id || (response as any).id,
            currentStep: "auth", 
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Başvuru başlatılamadı.", isLoading: false });
          throw error;
        }
      },

      verifySession: async ({ otpCode, applicationId }) => {
        set({ isLoading: true, error: null });
        try {
          // Parametre yoksa store'daki temp ID'yi kullan
          const appId = applicationId || get().tempApplicationId;
          
          if (!appId) {
             throw new Error("Application ID bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.");
          }

          const response = await publicApplicationService.verifyOtp({ applicationId: appId, otpCode });
          
          set({
            token: response.token,
            application: response.application,
            isAuthenticated: true,
            tempApplicationId: null, // Artık gerek yok, temizle
            isLoading: false,
          });

          // Routing Logic
          const appStatus = response.application.status;
          const stepsFilled = response.application.education?.length > 0;

          if (appStatus === 'completed' || appStatus === 'awaiting_ai_analysis') {
             set({ currentStep: "completed" });
          } else if (appStatus === 'awaiting_video_responses' || appStatus === 'in_progress') {
             if (stepsFilled) set({ currentStep: "system-check" });
             else set({ currentStep: "wizard-profile" });
          } else {
             set({ currentStep: "wizard-profile" });
          }

        } catch (error: any) {
          set({ error: error.message || "Doğrulama kodu hatalı.", isLoading: false });
          throw error;
        }
      },

      resumeSession: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const application = await publicApplicationService.getMyApplication();
          set({ application, isAuthenticated: true, isLoading: false });

          const status = application.status;
          if (status === 'completed') {
            set({ currentStep: "completed" });
          } else if (status === 'awaiting_video_responses') {
            const answeredCount = application.responses?.length || 0;
            set({ currentStep: "exam-active", currentQuestionIndex: answeredCount });
          } else {
            set({ currentStep: "wizard-profile" });
          }
        } catch (error) {
          console.error("Session resume failed:", error);
          get().resetSession();
        }
      },

      resetSession: () => {
        set({
          token: null, application: null, isAuthenticated: false, 
          tempApplicationId: null, currentStep: "landing", currentQuestionIndex: 0
        });
        localStorage.removeItem("candidate-storage");
      },

      // 3. WIZARD HANDLERS
      updateProfileDraft: async (section, data) => {
        try {
          const updatedApp = await publicApplicationService.updateProfile({ [section]: data });
          set((state) => ({
            application: { ...state.application!, ...updatedApp }
          }));
        } catch (error) { console.error("Draft save failed:", error); }
      },

      completeWizard: () => { set({ currentStep: "system-check" }); },

      // 4. EXAM HANDLERS
      startExam: () => { set({ currentStep: "exam-active", currentQuestionIndex: 0 }); },

      nextQuestion: () => {
        const { interview, currentQuestionIndex } = get();
        if (!interview) return;
        if (currentQuestionIndex + 1 < interview.questions.length) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
            set({ currentStep: "completed" });
        }
      },

      addToUploadQueue: (questionId) => {
        set((state) => ({ uploadQueue: [...state.uploadQueue, questionId], isUploading: true }));
      },

      removeFromUploadQueue: (questionId) => {
        set((state) => {
            const newQueue = state.uploadQueue.filter(id => id !== questionId);
            return { uploadQueue: newQueue, isUploading: newQueue.length > 0 };
        });
      },

      setStep: (step) => set({ currentStep: step }),
      setError: (msg) => set({ error: msg }),
    }),
    {
      name: "candidate-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);