import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    cartMode: 'WHATSAPP' | 'QR_PAYMENT';
    subscription?: { plan: string; status: string; maxProducts: number; maxEmployees: number };
  };
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const me = await api.get('/auth/me');
    set({ user: me.data });
  },

  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const me = await api.get('/auth/me');
    set({ user: me.data });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) await api.post('/auth/logout', { refreshToken }).catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },
}));
