import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  shop: string | null;
  accessToken: string | null;
  login: (userId: string, shop: string, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: localStorage.getItem('userId'),
  shop: localStorage.getItem('shop'),
  accessToken: localStorage.getItem('accessToken'),

  login: (userId: string, shop: string, accessToken: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('shop', shop);
    localStorage.setItem('accessToken', accessToken);
    set({ isAuthenticated: true, userId, shop, accessToken });
  },

  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('shop');
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, userId: null, shop: null, accessToken: null });
  },
}));
