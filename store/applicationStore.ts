import { create } from 'zustand';
import { Application } from '@/types/application';
import { getApplicationById, getApplications } from '@/services/applicationService';

interface ApplicationStore {
  applications: Application[];
  application: Application | null;
  loading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  clearApplication: () => void;
}

const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],
  application: null,
  loading: false,
  error: null,

  // Tüm başvuruları getir
  fetchApplications: async () => {
    set({ loading: true, error: null });
    try {
      const applications = await getApplications();
      set({ applications });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvurular getirilirken hata oluştu.',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Tek başvuruyu ID ile getir
  fetchApplication: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const application = await getApplicationById(id);
      set({ application });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvuru getirilirken hata oluştu.',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Başvuru state temizle
  clearApplication: () => {
    set({ application: null, error: null });
  },
}));

export default useApplicationStore;
