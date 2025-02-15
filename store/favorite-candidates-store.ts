"use client"


import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Candidate {
  id: string
  name: string
  position: string
  score: number
}

interface FavoriteCandidatesStore {
  favorites: Candidate[]
  addFavorite: (candidate: Candidate) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoriteCandidatesStore = create<FavoriteCandidatesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (candidate) =>
        set((state) => ({
          favorites: [...state.favorites, candidate],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== id),
        })),
      isFavorite: (id) => get().favorites.some((c) => c.id === id),
    }),
    {
      name: "favorite-candidates-storage",
    },
  ),
)

