import { create } from "zustand";
import { interviewService } from "@/services/interviewService";
import {
  Interview,
  CreateInterviewDTO,
  UpdateInterviewDTO,
  InterviewStoreState,
  InterviewStoreActions,
  InterviewQuestion,
  InterviewStatus,
} from "@/types/interview";

interface InterviewStore extends InterviewStoreState, InterviewStoreActions {}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  // **State Tanımları**
  interviews: [],
  selectedInterview: null,
  loading: false,
  error: null,

  /**
   * Kullanıcının mülakat listesini API'dan çekme
   */
  fetchInterviews: async () => {
    set({ loading: true, error: null });
    try {
      const data = await interviewService.getUserInterviews();
      set({ interviews: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Belirli bir mülakatı ID ile API'dan getirme
   */
  getInterviewById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await interviewService.getInterviewById(id);
      set({ selectedInterview: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Yeni bir mülakat oluşturma
   */
  createInterview: async (data: CreateInterviewDTO) => {
    set({ loading: true, error: null });
    try {
      await interviewService.createInterview(data);
      await get().fetchInterviews(); // Yeni mülakat eklendiğinde listeyi güncelle
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Mevcut bir mülakatı güncelleme
   */
  updateInterview: async (id: string, updateData: UpdateInterviewDTO) => {
    set({ loading: true, error: null });
    try {
      await interviewService.updateInterview(id, updateData);
      await get().fetchInterviews();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Mülakatı silme
   */
  deleteInterview: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await interviewService.deleteInterview(id);
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Mülakatın durumunu güncelleme
   */
  updateInterviewStatus: async (id: string, newStatus: InterviewStatus) => {
    set({ loading: true, error: null });
    try {
      await interviewService.updateInterviewStatus(id, newStatus);
      await get().fetchInterviews();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Mülakatın sorularını güncelleme
   */
  updateInterviewQuestions: async (id: string, questions: InterviewQuestion[]) => {
    set({ loading: true, error: null });
    try {
      await interviewService.updateInterviewQuestions(id, questions);
      await get().fetchInterviews();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Mülakata kişilik testi ID'si ekleme
   */
  updatePersonalityTest: async (id: string, personalityTestId: string) => {
    set({ loading: true, error: null });
    try {
      await interviewService.updatePersonalityTest(id, personalityTestId);
      await get().fetchInterviews();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
