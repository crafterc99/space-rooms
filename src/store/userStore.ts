'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUserId: null,
      setCurrentUserId: (id) => set({ currentUserId: id }),
    }),
    { name: 'space-rooms-user' }
  )
);
