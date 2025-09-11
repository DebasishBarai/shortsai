import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  credits: number;
  polarCustomerId?: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setCredits: (credits: number) => void;
  incrementCredits: (amount: number) => void;
  decrementCredits: (amount: number) => void;
  resetCredits: () => void;
  refreshUser: () => Promise<void>;
}

// Function to fetch user data
const fetchUserData = async (): Promise<User | null> => {
  try {
    const userRes = await axios.post('/api/user');
    const userData = userRes.data;

    if (userRes.status !== 200) {
      console.log('error fetching data');
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: true, // Start with loading true
  error: null,
  initialized: false,

  setUser: (user) => set({ user, error: null }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  clearUser: () => set({ user: null, error: null }),
  setCredits: (credits) => set((state) => ({
    user: state.user ? { ...state.user, credits } : null
  })),
  incrementCredits: (amount) => set((state) => ({
    user: state.user ? { ...state.user, credits: state.user.credits + amount } : null
  })),
  decrementCredits: (amount) => set((state) => ({
    user: state.user ? { ...state.user, credits: Math.max(0, state.user.credits - amount) } : null
  })),
  resetCredits: () => set((state) => ({
    user: state.user ? { ...state.user, credits: 0 } : null
  })),

  refreshUser: async () => {
    set({ loading: true, error: null });
    const userData = await fetchUserData();

    if (userData) {
      set({ user: userData, loading: false, initialized: true });
    } else {
      set({ user: null, loading: false, initialized: true, error: 'Failed to fetch user' });
    }
  },
}));

// Initialize the store by fetching user data
const initializeStore = async () => {
  const store = useUserStore.getState();

  if (!store.initialized) {
    const userData = await fetchUserData();

    useUserStore.setState({
      user: userData,
      loading: false,
      initialized: true,
      error: userData ? null : 'Failed to fetch user data'
    });
  }
};

// Auto-initialize when the module loads
initializeStore();
