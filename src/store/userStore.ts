"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  currentUserId: string | null;
  setCurrentUserId: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUserId: null,
      setCurrentUserId: (id) => set({ currentUserId: id }),
    }),
    { name: "space-rooms-user" }
  )
);
