import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import api from '../lib/api';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceSnapshot: number;
  imageUrl?: string;
}

interface CartState {
  sessionId: string;
  items: CartItem[];
  total: number;
  loading: boolean;
  fetchCart: (tenantId: string) => Promise<void>;
  addItem: (tenantId: string, productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (tenantId: string, data: any) => Promise<any>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      sessionId: uuidv4(),
      items: [],
      total: 0,
      loading: false,

      fetchCart: async (tenantId) => {
        const { sessionId } = get();
        const { data } = await api.get(`/cart/${sessionId}?tenantId=${tenantId}`);
        set({ items: data.items || [], total: data.total || 0 });
      },

      addItem: async (tenantId, productId, quantity = 1) => {
        const { sessionId } = get();
        set({ loading: true });
        try {
          const { data } = await api.post(
            `/cart/${sessionId}/items?tenantId=${tenantId}`,
            { productId, quantity },
          );
          set({ items: data.items || [], total: data.total || 0 });
        } finally {
          set({ loading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        const { sessionId } = get();
        const { data } = await api.patch(`/cart/${sessionId}/items/${itemId}`, { quantity });
        set({ items: data.items || [], total: data.total || 0 });
      },

      removeItem: async (itemId) => {
        const { sessionId } = get();
        const { data } = await api.delete(`/cart/${sessionId}/items/${itemId}`);
        set({ items: data.items || [], total: data.total || 0 });
      },

      clearCart: async () => {
        const { sessionId } = get();
        await api.delete(`/cart/${sessionId}`);
        set({ items: [], total: 0 });
      },

      checkout: async (tenantId, checkoutData) => {
        const { sessionId } = get();
        const { data } = await api.post(
          `/cart/${sessionId}/checkout?tenantId=${tenantId}`,
          checkoutData,
        );
        set({ items: [], total: 0 });
        return data;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    },
  ),
);
