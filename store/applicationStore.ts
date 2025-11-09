// src/store/applicationStore.ts

import { create } from 'zustand';
import { Application, ApplicationFilters } from '@/types/application'; // ✅ ApplicationFilters import edildi
import { 
  getApplicationsByInterviewId,
  getFilteredApplications, // ✅ Yeni import
  updateApplicationStatus // ✅ Yeni import
} from '@/services/applicationService';

// ✅ YENİ TİP: Filtreler ve Sayfalama Bilgileri ile Genişletildi
 interface ApplicationStore {
  applications: Application[];
  application: Application | null;
  loading: boolean;
  error: string | null;

  // ✅ YENİ STATE: Filtreler
  filters: Partial<ApplicationFilters>; 
  // ✅ YENİ STATE: Sayfalama
  pagination: {
    total: number;
    page: number;
    limit: number;
  };

  // ✅ YENİ AKSİYONLAR
  setFilters: (newFilters: Partial<ApplicationFilters>) => void;
  fetchApplications: (page?: number) => Promise<void>; // Artık page alabilir
  fetchApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: 'pending' | 'rejected' | 'accepted') => Promise<void>;
  getApplicationsByInterviewId: (interviewId: string) => Promise<void>;
  clearApplication: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  application: null,
  loading: false,
  error: null,
  filters: { aiScoreMin: 0, completionStatus: 'all', applicationStatus: 'all', searchTerm: '' }, // ✅ Başlangıç Filtreleri
  pagination: { total: 0, page: 1, limit: 10 }, // ✅ Sayfalama Başlangıç Değerleri

  // ✅ YENİ AKSİYON: Filtreleri güncelle
  setFilters: (newFilters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters }, 
      pagination: { ...state.pagination, page: 1 } // Filtre değişince sayfayı 1'e sıfırla
    }));
    get().fetchApplications(1); // Filtre değişince veriyi yenile
  },

  // Tüm başvuruları getir (Artık filtreli)
  fetchApplications: async (page = 1) => {
    set({ loading: true, error: null });
    
    // Geçerli filtreleri ve sayfalamayı al
    const currentFilters = get().filters;
    const currentLimit = get().pagination.limit;

    try {
      // ✅ YENİ METOT KULLANIMI: getFilteredApplications
      const response = await getFilteredApplications(currentFilters, page, currentLimit);

      set({ 
        applications: response.data,
        pagination: { 
            total: response.meta.total, 
            page: response.meta.page, 
            limit: response.meta.limit 
        },
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvurular getirilirken hata oluştu.',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Tek başvuruyu ID ile getir
  fetchApplication: async (id: string) => { /* ... mevcut kod ... */ },

  // ✅ YENİ AKSİYON: Başvuru durumunu güncelle
  updateStatus: async (id, newStatus) => {
    set({ loading: true, error: null });
    try {
      const updatedApp = await updateApplicationStatus(id, newStatus);
      
      // Store'daki application ve applications listesini güncelle
      set((state) => ({
        // Tekli görünüm güncellenir
        application: state.application?._id === id ? updatedApp : state.application,
        // Liste görünümü güncellenir
        applications: state.applications.map(app => 
          app._id === id ? updatedApp : app
        ),
      }));

    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Durum güncellenirken hata oluştu.',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Başvuru state temizle
  clearApplication: () => {
    set({ application: null, error: null });
  },
  // ✅ YENİ AKSİYON: Mülakat ID'sine göre başvuruları getirir (Mülakat Detay Sayfası için)
  getApplicationsByInterviewId: async (interviewId: string) => {
    set({ loading: true, error: null });
    try {
        const applications = await getApplicationsByInterviewId(interviewId);
        
        // Bu metot, genellikle sadece ilgili başvuruları getirir, genel paginasyonu etkilemez.
        set({ 
            applications: applications,
            // NOT: Burada pagination verisini güncellemiyoruz, çünkü bu genel liste değil.
        });
    } catch (error: any) {
        set({
            error: error.response?.data?.message || 'Mülakat başvuruları getirilirken hata oluştu.',
        });
    } finally {
        set({ loading: false });
    }
  },
}));

