import { create } from 'zustand';
import axios from 'axios';

export interface User {
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

export interface Ad {
  id: string;
  adImageUrl: string;
  adVideoUrl: string;
}

interface AdStore {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  setAds: (ads: Ad[]) => void;
  addAd: (ad: Ad) => void;
  updateAd: (id: string, updates: Partial<Ad>) => void;
  removeAd: (id: string) => void;
  clearAds: () => void;
  refreshAds: () => Promise<void>;
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

// Function to fetch ads data
const fetchAdData = async (): Promise<Ad[] | null> => {
  try {
    const adRes = await axios.post('/api/user/ads');
    const adData = adRes.data;

    if (adRes.status !== 200) {
      console.log('error fetching ad data');
      return null;
    }

    return adData;
  } catch (error) {
    console.error('Error fetching ads:', error);
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


export const useAdStore = create<AdStore>((set, get) => ({
  ads: [],
  loading: true, // Start with loading true
  error: null,
  initialized: false,

  setAds: (ads) => set({ ads, error: null }),
  addAd: (ad) => set((state) => ({
    ads: [ad, ...state.ads]
  })),
  updateAd: (id, updates) => set((state) => ({
    ads: state.ads.map(ad =>
      ad.id === id ? { ...ad, ...updates } : ad
    )
  })),
  removeAd: (id) => set((state) => ({
    ads: state.ads.filter(ad => ad.id !== id)
  })),
  clearAds: () => set({ ads: [], error: null }),

  refreshAds: async () => {
    set({ loading: true, error: null });
    const adData = await fetchAdData();

    if (adData) {
      set({ ads: adData, loading: false, initialized: true });
    } else {
      set({ ads: [], loading: false, initialized: true, error: 'Failed to fetch ads' });
    }
  },
}));

// Initialize the store by fetching user data
const initializeStore = async () => {
  const store = useUserStore.getState();

  if (!store.initialized) {
    const userData = await fetchUserData();

    const adData = await fetchAdData();

    useUserStore.setState({
      user: userData,
      loading: false,
      initialized: true,
      error: userData ? null : 'Failed to fetch user data'
    });

    useAdStore.setState({
      ads: adData || [],
      loading: false,
      initialized: true,
      error: adData ? null : 'Failed to fetch ad data'
    });

  }
};

// Auto-initialize when the module loads
initializeStore();
