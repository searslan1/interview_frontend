// src/store/candidateStore.ts

"use client";

import { create } from "zustand";
import type { 
  Candidate, 
  CandidateFilters, 
  CandidateSortBy, 
  CandidateSortOrder,
  CandidateStatus,
  PositionOption
} from "@/types/candidate";
import * as candidateService from "@/services/candidateService";


// ========== STORE STATE ==========

interface CandidateStoreState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  
  filters: Partial<CandidateFilters>;
  sortBy: CandidateSortBy;
  sortOrder: CandidateSortOrder;
  
  pagination: {
    total: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    page: number;
    limit: number;
  };
  
  availablePositions: PositionOption[];
}

// ========== STORE ACTIONS ==========

interface CandidateStoreActions {
  fetchCandidates: (page?: number) => Promise<void>;
  fetchCandidateById: (id: string) => Promise<void>;
  refreshCandidates: () => Promise<void>;
  
  setFilters: (filters: Partial<CandidateFilters>) => void;
  resetFilters: () => void;
  
  setSorting: (sortBy: CandidateSortBy, sortOrder: CandidateSortOrder) => void;
  setPage: (page: number) => void;
  
  // Status Update
  updateStatus: (id: string, status: CandidateStatus) => Promise<void>;
  
  // Notes (Sadece Ekleme Var)
  addNote: (candidateId: string, content: string) => Promise<void>;
  
  // Merge
  mergeCandidates: (primaryId: string, secondaryId: string) => Promise<void>;
  
  // Helpers
  clearSelectedCandidate: () => void;
  fetchAvailablePositions: () => Promise<void>;
}

// ========== DEFAULT VALUES ==========

const defaultFilters: Partial<CandidateFilters> = {
  status: [], // Backend array bekler, boş array = hepsi
};

const defaultPagination = {
  total: 0,
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  page: 1,
  limit: 20,
};

// ========== STORE IMPLEMENTATION ==========

export const useCandidateStore = create<CandidateStoreState & CandidateStoreActions>()(
  (set, get) => ({
    // Initial State
    candidates: [],
    selectedCandidate: null,
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    filters: defaultFilters,
    sortBy: "lastInterview", 
    sortOrder: "desc",
    pagination: defaultPagination,
    availablePositions: [],

    // ========== FETCH CANDIDATES ==========
    fetchCandidates: async (page = 1) => {
      set({ isLoading: true, error: null });
      
      const { filters, sortBy, sortOrder, pagination } = get();
      
      try {
        const response = await candidateService.getCandidates(
          filters,
          page,
          pagination.limit,
          sortBy,
          sortOrder
        );
        
        const total = response.meta.total;
        const totalPages = Math.ceil(total / pagination.limit);
        
        set({
          candidates: response.data,
          pagination: {
            total: total,
            totalItems: total,
            totalPages: totalPages,
            currentPage: response.meta.page,
            page: response.meta.page,
            limit: response.meta.limit,
          },
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Adaylar yüklenirken hata oluştu",
          isLoading: false,
        });
      }
    },

    // ========== FETCH SINGLE CANDIDATE ==========
    fetchCandidateById: async (id: string) => {
      set({ isLoadingDetail: true, error: null });
      try {
        const candidate = await candidateService.getCandidateById(id);
        set({
          selectedCandidate: candidate,
          isLoadingDetail: false,
        });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Aday detayları yüklenirken hata oluştu",
          isLoadingDetail: false,
        });
      }
    },

    refreshCandidates: async () => {
      const { pagination } = get();
      await get().fetchCandidates(pagination.page);
    },

    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        pagination: { ...state.pagination, page: 1 },
      }));
      get().fetchCandidates(1);
    },

    resetFilters: () => {
      set({ filters: defaultFilters, pagination: defaultPagination });
      get().fetchCandidates(1);
    },

    setSorting: (sortBy, sortOrder) => {
      set({ sortBy, sortOrder });
      get().fetchCandidates(1);
    },

    setPage: (page) => {
      // Sadece state güncelleme değil, fetch de yapmalı
      set((state) => ({
        pagination: { ...state.pagination, page, currentPage: page },
      }));
      get().fetchCandidates(page);
    },

    // ========== STATUS UPDATE ==========
    updateStatus: async (id, status) => {
      try {
        // Optimistic Update
        const previousCandidates = get().candidates;
        
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c._id === id ? { ...c, status } : c
          ),
          selectedCandidate: state.selectedCandidate?._id === id 
            ? { ...state.selectedCandidate, status } 
            : state.selectedCandidate,
        }));

        await candidateService.updateCandidateStatus(id, status);
        
      } catch (error: any) {
        // Rollback
        set({ error: "Durum güncellenemedi" });
        await get().fetchCandidates(get().pagination.page);
        throw error;
      }
    },

    // ========== NOTES ==========
    addNote: async (candidateId, content) => {
      try {
        const newNote = await candidateService.addCandidateNote(candidateId, content);
        
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c._id === candidateId 
              ? { ...c, notesCount: (c.notesCount || 0) + 1 }
              : c
          ),
          selectedCandidate: state.selectedCandidate?._id === candidateId
            ? { 
                ...state.selectedCandidate, 
                notes: [newNote, ...(state.selectedCandidate.notes || [])] 
              }
            : state.selectedCandidate,
        }));
      } catch (error: any) {
        set({ error: "Not eklenirken hata oluştu" });
        throw error;
      }
    },

    // ========== MERGE ==========
    mergeCandidates: async (primaryId, secondaryId) => {
      try {
        await candidateService.mergeCandidates(primaryId, secondaryId);
        
        // Listeyi yenile çünkü secondary aday kayboldu
        await get().fetchCandidates(get().pagination.page);
        
        // Seçili aday merge edildiyse seçimi kaldır
        if (get().selectedCandidate?._id === secondaryId) {
            set({ selectedCandidate: null });
        }
      } catch (error: any) {
        set({ error: "Adaylar birleştirilirken hata oluştu" });
        throw error;
      }
    },

    // ========== HELPERS ==========
    clearSelectedCandidate: () => {
      set({ selectedCandidate: null });
    },

    fetchAvailablePositions: async () => {
      try {
        // Tip uyuşmazlığını düzeltiyoruz (API dönüş tipini store tipine map'le)
        const positions = await candidateService.getAvailablePositions();
        set({ availablePositions: positions as unknown as PositionOption[] });
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    },
  })
);

export default useCandidateStore;