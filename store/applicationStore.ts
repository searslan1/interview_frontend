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
  updateApplicationStatus,
  addHRNote,
  updateHRNote,
  deleteHRNote,
  updateHRRating,
  toggleFavorite
} from '@/services/applicationService';

// ========================================
// CONSTANTS
// ========================================

const DEFAULT_LIMIT = 10;

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
  fetchApplications: (options?: { reset?: boolean; [key: string]: any }) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  setFilters: (newFilters: Partial<ApplicationFilterState>) => void;
  setSort: (newSort: Partial<ApplicationSortState>) => void;
  resetFilters: () => void;
  
  // Single Application Actions
  fetchApplication: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: 'pending' | 'rejected' | 'accepted' | 'completed' | 'archived') => Promise<void>;
  clearApplication: () => void;
  
  // HR Notes Actions
  addNote: (applicationId: string, content: string, isPrivate?: boolean) => Promise<void>;
  updateNote: (applicationId: string, noteId: string, updates: { content?: string; isPrivate?: boolean }) => Promise<void>;
  deleteNote: (applicationId: string, noteId: string) => Promise<void>;
  
  // HR Rating Action
  updateRating: (applicationId: string, rating: number) => Promise<void>;
  
  // Favorite Action
  toggleFavoriteAction: (applicationId: string, isFavorite: boolean) => Promise<void>;
  
  // Interview-specific
  getApplicationsByInterviewId: (interviewId: string) => Promise<void>;
  
  // Legacy compatibility
  applications: Application[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

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
   */
  fetchApplications: async (options: { reset?: boolean; [key: string]: any } = {}) => {
    const { reset = false, ...customFilters } = options;
    const state = get();
    
    if (state.loading) return;
    
    set({ loading: true, error: null });
    
    const targetPage = reset ? 1 : state.page;
    
    try {
      const response = await getApplications({
        page: targetPage,
        limit: customFilters.limit || state.limit,
        interviewId: customFilters.interviewId || state.filters.interviewId,
        status: customFilters.status || state.filters.status,
        analysisStatus: customFilters.analysisStatus || state.filters.analysisStatus,
        query: customFilters.query || state.filters.query,
        aiScoreMin: customFilters.aiScoreMin || state.filters.aiScoreMin,
        sortBy: customFilters.sortBy || state.sort.sortBy,
        sortOrder: customFilters.sortOrder || state.sort.sortOrder,
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

  fetchNextPage: async () => {
    const state = get();
    
    if (!state.hasMore || state.loading) {
      return;
    }
    
    set({ page: state.page + 1 });
    await get().fetchApplications();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
    }));
    get().fetchApplications({ reset: true });
  },

  setSort: (newSort) => {
    set((state) => ({
      sort: { ...state.sort, ...newSort },
      page: 1,
    }));
    get().fetchApplications({ reset: true });
  },

  resetFilters: () => {
    set({
      filters: { ...DEFAULT_FILTERS },
      sort: { ...DEFAULT_SORT },
      page: 1,
    });
    get().fetchApplications({ reset: true });
  },

  fetchApplication: async (id: string) => {
    set({ loading: true, error: null, application: null });
    
    try {
      const application = await getApplicationById(id);
      set({ application, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Başvuru getirilirken hata oluştu.',
        loading: false,
      });
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
        ),
        application: state.application?._id === id
          ? { ...state.application, status: newStatus }
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Durum güncellenirken hata oluştu.',
      });
    }
  },

  addNote: async (applicationId, content, isPrivate = false) => {
    try {
      const updatedApp = await addHRNote(applicationId, content, isPrivate);
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === applicationId ? updatedApp : app
        ),
        application: state.application?._id === applicationId
          ? updatedApp
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Not eklenirken hata oluştu.',
      });
    }
  },

  updateNote: async (applicationId, noteId, updates) => {
    try {
      const updatedApp = await updateHRNote(applicationId, noteId, updates);
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === applicationId ? updatedApp : app
        ),
        application: state.application?._id === applicationId
          ? updatedApp
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Not güncellenirken hata oluştu.',
      });
    }
  },

  deleteNote: async (applicationId, noteId) => {
    try {
      const updatedApp = await deleteHRNote(applicationId, noteId);
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === applicationId ? updatedApp : app
        ),
        application: state.application?._id === applicationId
          ? updatedApp
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Not silinirken hata oluştu.',
      });
    }
  },

  updateRating: async (applicationId, rating) => {
    try {
      await updateHRRating(applicationId, rating);
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === applicationId
            ? { ...app, hrRating: rating }
            : app
        ),
        application: state.application?._id === applicationId
          ? { ...state.application, hrRating: rating }
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Rating güncellenirken hata oluştu.',
      });
    }
  },

  toggleFavoriteAction: async (applicationId, isFavorite) => {
    try {
      await toggleFavorite(applicationId, isFavorite ? 'add' : 'remove');
      
      set((state) => ({
        items: state.items.map(app =>
          app._id === applicationId
            ? { ...app, isFavorite }
            : app
        ),
        application: state.application?._id === applicationId
          ? { ...state.application, isFavorite }
          : state.application,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Favori durumu güncellenirken hata oluştu.',
      });
    }
  },

  clearApplication: () => {
    set({ application: null });
  },

  getApplicationsByInterviewId: async (interviewId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await getApplicationsByInterviewId(interviewId);
      
      // Response zaten PaginatedApplicationResponse tipinde
      set({ 
        items: response.data,
        total: response.meta.total,
        hasMore: false,
        page: 1,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Mülakat başvuruları getirilirken hata oluştu.',
        loading: false,
      });
    }
  },
}));

export default useApplicationStore;
