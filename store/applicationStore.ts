// src/store/applicationStore.ts

import { create } from 'zustand';
import { 
  Application, 
  ApplicationFilterState,
  ApplicationSortState,
  ApplicationStatus
} from '@/types/application';
import { 
  getApplications,
  getApplicationsByInterviewId,
  getApplicationById,
  updateApplicationStatus 
} from '@/services/applicationService';

// ========================================
// STORE STATE INTERFACE
// ========================================

interface ApplicationStore {
  // Data
  items: Application[];
  application: Application | null;
  
  // Pagination
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Filters & Sort
  filters: ApplicationFilterState;
  sort: ApplicationSortState;
  
  // Actions
  fetchApplications: (options?: { reset?: boolean }) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  setFilters: (newFilters: Partial<ApplicationFilterState>) => void;
  setSort: (newSort: Partial<ApplicationSortState>) => void;
  resetFilters: () => void;
  
  // Single Application Actions
  fetchApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: 'pending' | 'rejected' | 'accepted') => Promise<void>;
  clearApplication: () => void;
  
  // Interview-specific (Mülakat detay sayfası için)
  getApplicationsByInterviewId: (interviewId: string) => Promise<void>;
  
  // ========================================
  // LEGACY COMPATIBILITY (Geriye Dönük Uyumluluk)
  // ========================================
  
  /** @deprecated Use 'items' instead */
  applications: Application[];
  
  /** @deprecated Use page, limit, total, hasMore instead */
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// ========================================
// DEFAULT VALUES
// ========================================

const DEFAULT_FILTERS: ApplicationFilterState = {
  interviewId: undefined,
  status: 'all',
  analysisStatus: 'all',
  query: '',
  aiScoreMin: 0,
};

const DEFAULT_SORT: ApplicationSortState = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const DEFAULT_LIMIT = 10;

// ========================================
// STORE IMPLEMENTATION
// ========================================

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  // Initial State
  items: [],
  application: null,
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  hasMore: false,
  loading: false,
  error: null,
  filters: { ...DEFAULT_FILTERS },
  sort: { ...DEFAULT_SORT },
  
  // Legacy compatibility getters
  get applications() { return get().items; },
  get pagination() { 
    const state = get();
    return { total: state.total, page: state.page, limit: state.limit }; 
  },

  /**
   * Ana fetch fonksiyonu
   * @param options.reset - true ise page=1 ve items reset edilir
   */
  fetchApplications: async (options = {}) => {
    const { reset = false } = options;
    const state = get();
    
    // Zaten yükleniyorsa çık
    if (state.loading) return;
    
    set({ loading: true, error: null });
    
    const targetPage = reset ? 1 : state.page;
    
    try {
      const response = await getApplications({
        page: targetPage,
        limit: state.limit,
        interviewId: state.filters.interviewId,
        status: state.filters.status,
        analysisStatus: state.filters.analysisStatus,
        query: state.filters.query,
        aiScoreMin: state.filters.aiScoreMin,
        sortBy: state.sort.sortBy,
        sortOrder: state.sort.sortOrder,
      });
      
      const newItems = reset 
        ? response.data 
        : [...state.items, ...response.data];
      
      const totalPages = response.meta.totalPages || Math.ceil(response.meta.total / state.limit);
      const hasMore = response.meta.page < totalPages;
      
      set({
        items: newItems,
        page: response.meta.page,
        total: response.meta.total,
        hasMore,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvurular getirilirken hata oluştu.',
        loading: false,
      });
    }
  },

  /**
   * Sonraki sayfayı yükle (infinite scroll için)
   * ÖNEMLI: Sadece hasMore && !loading iken çağrılmalı
   */
  fetchNextPage: async () => {
    const state = get();
    
    // Guard: hasMore yoksa veya yükleniyorsa çık
    if (!state.hasMore || state.loading) {
      return;
    }
    
    // Sayfa numarasını artır ve fetch et
    set({ page: state.page + 1 });
    await get().fetchApplications();
  },

  /**
   * Filtreleri güncelle ve listeyi sıfırla
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // Filtre değişince sayfa 1'e dön
    }));
    get().fetchApplications({ reset: true });
  },

  /**
   * Sıralamayı güncelle ve listeyi sıfırla
   */
  setSort: (newSort) => {
    set((state) => ({
      sort: { ...state.sort, ...newSort },
      page: 1, // Sort değişince sayfa 1'e dön
    }));
    get().fetchApplications({ reset: true });
  },

  /**
   * Filtreleri varsayılana sıfırla
   */
  resetFilters: () => {
    set({
      filters: { ...DEFAULT_FILTERS },
      sort: { ...DEFAULT_SORT },
      page: 1,
    });
    get().fetchApplications({ reset: true });
  },

  /**
   * Tek başvuruyu ID ile getir (detay sayfası için)
   */
  fetchApplication: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const app = await getApplicationById(id); // ✅ Doğru servis çağrısı
      set({ application: app, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvuru getirilirken hata oluştu.',
        loading: false,
      });
    }
  },

  /**
   * Başvuru durumunu güncelle (Kabul/Red/Beklemede)
   */
  updateStatus: async (id, newStatus) => {
    set({ loading: true, error: null });
    try {
      const updatedApp = await updateApplicationStatus(id, newStatus);
      
      set((state) => ({
        // Tekli görünüm güncellenir
        application: state.application?._id === id ? updatedApp : state.application,
        // Liste görünümü güncellenir
        items: state.items.map(app => 
          app._id === id ? updatedApp : app
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Durum güncellenirken hata oluştu.',
        loading: false,
      });
    }
  },

  /**
   * Başvuru state'ini temizle
   */
  clearApplication: () => {
    set({ application: null, error: null });
  },

  /**
   * Mülakat ID'sine göre başvuruları getir (Mülakat Detay Sayfası için)
   */
  getApplicationsByInterviewId: async (interviewId: string) => {
    set({ loading: true, error: null });
    try {
      const response: any = await getApplicationsByInterviewId(interviewId);
      
      console.log("🔍 STORE GELEN HAM VERİ:", response);
      // ✅ DÜZELTME: response.data diyerek array'e erişiyoruz
      // Backend yapına göre response.data veya response.data.data olabilir. 
      // Eğer service response.data dönüyorsa, burada response.data kullanmalısın.
      // Paylaştığın JSON'a göre array "data" key'inin içinde.
      let applicationsArray: any[] = [];
      let metaData: any = {};

      if (Array.isArray(response)) {
          // 1. Direkt Array geldiyse
          applicationsArray = response;
      } else if (response.data && Array.isArray(response.data)) {
          // 2. { success: true, data: [...] } formatı (Service response.data dönüyorsa)
          applicationsArray = response.data;
          metaData = response.meta;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
           // 3. Axios Objesi formatı { data: { success: true, data: [...] } }
           applicationsArray = response.data.data;
           metaData = response.data.meta;
      }

      console.log("✅ PARSE EDİLEN LİSTE:", applicationsArray);


      set({ 
        items: applicationsArray,
        total: metaData?.total || applicationsArray.length,
        hasMore: false,
        page: 1,
        loading: false,
      });
    } catch (error: any) {
      console.error("Store Error:", error); // Debug için log ekledik
      set({
        error: error.response?.data?.message || 'Mülakat başvuruları getirilirken hata oluştu.',
        loading: false,
      });
    }
  },
}));

// Default export for backward compatibility
export default useApplicationStore;
