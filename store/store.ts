// store.ts - Migrated to Zustand
import { create } from 'zustand';

interface CreditStore {
  credits: number;
  setCredits: (credits: number) => void;
  incrementCredits: (amount: number) => void;
  decrementCredits: (amount: number) => void;
  resetCredits: () => void;
}

export const useCreditStore = create<CreditStore>((set) => ({
  credits: 0,
  setCredits: (credits) => set({ credits }),
  incrementCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  decrementCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  resetCredits: () => set({ credits: 0 }),
}));
