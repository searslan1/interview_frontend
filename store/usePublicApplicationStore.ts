// store/usePublicApplicationStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import publicApplicationService, {
  PublicInterviewData,
  StartApplicationDTO,
  UpdateProfileDTO,
} from "@/services/publicApplicationService";

// ============================================================================
// LOCAL TYPES (Backend Application model subset for public flow)
// ============================================================================

interface CandidateEducation {
  school: string;
  degree: string;
  graduationYear: number;
}

interface CandidateExperience {
  company: string;
  position: string;
  duration: string;
  responsibilities: string;
}

interface CandidateDocuments {
  resume?: string;
  certificates?: string[];
  socialMediaLinks?: string[];
}

interface PublicApplication {
  _id: string;
  status: string;
  education?: CandidateEducation[];
  experience?: CandidateExperience[];
  documents?: CandidateDocuments;
  responses?: Array<{
    questionId: string;
    videoUrl?: string;
    duration?: number;
  }>;
}

// ============================================================================
// TYPES
// ============================================================================

export type AppStep =
  | "landing"
  | "auth"
  | "otp"
  | "wizard-profile"
  | "wizard-docs"
  | "system-check"
  | "exam-intro"
  | "exam-active"
  | "completed";

interface SessionData {
  token: string;
  applicationId: string;
  interviewId: string;
  expiresAt: number;
}

interface PendingAuth {
  applicationId: string;
  phone: string;
  email: string;
  expiresAt: number;
}

interface PublicApplicationState {
  // Interview (Public)
  interview: PublicInterviewData | null;

  // Session (Authenticated)
  session: SessionData | null;
  application: PublicApplication | null;

  // Auth Flow
  pendingAuth: PendingAuth | null;

  // UI State
  currentStep: AppStep;
  isLoading: boolean;
  error: string | null;

  // Exam State
  currentQuestionIndex: number;
  uploadQueue: string[];
}

interface PublicApplicationActions {
  // Initialization
  initInterview: (interviewId: string) => Promise<void>;

  // Auth Flow
  startAuth: (data: StartApplicationDTO) => Promise<void>;
  verifyOtp: (otpCode: string) => Promise<void>;
  resendOtp: () => Promise<void>;

  // Session
  validateSession: (interviewId: string) => Promise<boolean>;
  clearSession: () => void;

  // Profile
  updateProfile: (section: keyof UpdateProfileDTO, data: any) => Promise<void>;
  completeWizard: () => void;

  // Exam
  startExam: () => void;
  nextQuestion: () => void;
  addToUploadQueue: (questionId: string) => void;
  removeFromUploadQueue: (questionId: string) => void;

  // UI
  setStep: (step: AppStep) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Internal
  routeByApplicationStatus: (app: PublicApplication) => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: PublicApplicationState = {
  interview: null,
  session: null,
  application: null,
  pendingAuth: null,
  currentStep: "landing",
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  uploadQueue: [],
};

// ============================================================================
// STORE
// ============================================================================

export const usePublicApplicationStore = create<
  PublicApplicationState & PublicApplicationActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // INITIALIZATION
      // ========================================================================

      initInterview: async (interviewId: string) => {
        set({ isLoading: true, error: null });

        try {
          // 1. Interview bilgilerini çek
          const interview = await publicApplicationService.getInterviewInfo(
            interviewId
          );
          set({ interview, isLoading: false });

          // 2. Mevcut session var mı ve bu interview için mi kontrol et
          const isValid = await get().validateSession(interviewId);

          if (isValid) {
            // Session geçerli, duruma göre yönlendir
            const app = get().application;
            if (app) {
              get().routeByApplicationStatus(app);
            }
          }
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Mülakat bilgileri yüklenemedi.";
          set({ error: message, isLoading: false });
        }
      },

      // ========================================================================
      // AUTH FLOW
      // ========================================================================

      startAuth: async (data: StartApplicationDTO) => {
        set({ isLoading: true, error: null });

        try {
          const response = await publicApplicationService.startApplication(
            data
          );

          // OTP gönderildi, pending auth state'i kaydet
          set({
            pendingAuth: {
              applicationId: response.applicationId || response._id,
              phone: data.phone,
              email: data.email,
              expiresAt: Date.now() + 10 * 60 * 1000, // 10 dakika
            },
            currentStep: "otp",
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Başvuru başlatılamadı.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      verifyOtp: async (otpCode: string) => {
        const { pendingAuth, interview } = get();

        if (!pendingAuth) {
          set({
            error: "Oturum süresi doldu. Lütfen tekrar başlayın.",
            currentStep: "auth",
          });
          return;
        }

        // Süre kontrolü
        if (Date.now() > pendingAuth.expiresAt) {
          set({
            error: "Doğrulama süresi doldu. Lütfen kodu tekrar gönderin.",
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await publicApplicationService.verifyOtp({
            applicationId: pendingAuth.applicationId,
            otpCode,
          });

          // Session oluştur
          const session: SessionData = {
            token: response.token,
            applicationId: pendingAuth.applicationId,
            interviewId: interview?.interviewId || "",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 saat
          };

          set({
            session,
            application: response.application,
            pendingAuth: null,
            isLoading: false,
          });

          // Duruma göre yönlendir
          get().routeByApplicationStatus(response.application);
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Doğrulama kodu hatalı.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      resendOtp: async () => {
        const { pendingAuth } = get();

        if (!pendingAuth) {
          set({ error: "Oturum bilgisi bulunamadı.", currentStep: "auth" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          await publicApplicationService.resendOtp(pendingAuth.applicationId);

          // Süreyi yenile
          set({
            pendingAuth: {
              ...pendingAuth,
              expiresAt: Date.now() + 10 * 60 * 1000,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || "Kod gönderilemedi.";
          set({ error: message, isLoading: false });
        }
      },

      // ========================================================================
      // SESSION MANAGEMENT
      // ========================================================================

      validateSession: async (interviewId: string): Promise<boolean> => {
        const { session } = get();

        // Session yoksa geçersiz
        if (!session) return false;

        // Farklı interview için session varsa temizle
        if (session.interviewId !== interviewId) {
          get().clearSession();
          return false;
        }

        // Süre dolmuşsa temizle
        if (Date.now() > session.expiresAt) {
          get().clearSession();
          return false;
        }

        // Backend'den güncel application bilgisini al
        try {
          const data = await publicApplicationService.getMyApplication();
          // Backend { application, interview } dönüyor
          set({
            application: data.application,
            interview: data.interview,
          });
          return true;
        } catch {
          // Token geçersiz
          get().clearSession();
          return false;
        }
      },

      clearSession: () => {
        set({
          session: null,
          application: null,
          pendingAuth: null,
          currentStep: "landing",
          currentQuestionIndex: 0,
          uploadQueue: [],
        });
      },

      // ========================================================================
      // PROFILE & WIZARD
      // ========================================================================

      updateProfile: async (section, data) => {
        try {
          const updated = await publicApplicationService.updateProfile({
            [section]: data,
          });
          set((state) => ({
            application: state.application
              ? { ...state.application, ...updated }
              : null,
          }));
        } catch (error: any) {
          console.error("Profile update failed:", error);
          throw error;
        }
      },

      completeWizard: () => {
        set({ currentStep: "system-check" });
      },

      // ========================================================================
      // EXAM
      // ========================================================================

      startExam: () => {
        set({ currentStep: "exam-active", currentQuestionIndex: 0 });
      },

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
        set((state) => ({
          uploadQueue: [...state.uploadQueue, questionId],
        }));
      },

      removeFromUploadQueue: (questionId) => {
        set((state) => ({
          uploadQueue: state.uploadQueue.filter((id) => id !== questionId),
        }));
      },

      // ========================================================================
      // UI HELPERS
      // ========================================================================

      setStep: (step) => set({ currentStep: step }),
      setError: (error) => set({ error }),

      reset: () => {
        set(initialState);
        if (typeof window !== "undefined") {
          localStorage.removeItem("public-app-session");
        }
      },

      // ========================================================================
      // INTERNAL: Route by Application Status
      // ========================================================================

      routeByApplicationStatus: (app: PublicApplication) => {
        const status = app.status;

        // Tamamlanmış
        if (status === "completed" || status === "awaiting_ai_analysis") {
          set({ currentStep: "completed" });
          return;
        }

        // Video bekleniyor - exam'a devam
        if (status === "awaiting_video_responses") {
          const answeredCount = app.responses?.length || 0;
          set({
            currentStep: "exam-active",
            currentQuestionIndex: answeredCount,
          });
          return;
        }

        // Profil doldurulmuş mu kontrol et
        const hasProfile =
          (app.education && app.education.length > 0) ||
          (app.experience && app.experience.length > 0) ||
          app.documents?.resume;

        if (hasProfile) {
          set({ currentStep: "system-check" });
        } else {
          set({ currentStep: "wizard-profile" });
        }
      },
    }),
    {
      name: "public-app-session",
      storage: createJSONStorage(() => localStorage),
      // ✅ Sadece gerekli verileri persist et
      partialize: (state) => ({
        session: state.session,
        pendingAuth: state.pendingAuth,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);

// ============================================================================
// SELECTOR HOOKS (Performance optimization)
// ============================================================================

export const useIsAuthenticated = () =>
  usePublicApplicationStore((state) => !!state.session?.token);

export const useCurrentInterview = () =>
  usePublicApplicationStore((state) => state.interview);

export const useCurrentApplication = () =>
  usePublicApplicationStore((state) => state.application);

// ============================================================================
// TOKEN GETTER (For API interceptor)
// ============================================================================

export const getSessionToken = () =>
  usePublicApplicationStore.getState().session?.token || null;
