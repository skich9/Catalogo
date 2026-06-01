'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export const STAT_CARDS = [
  { label: 'Productos',       key: 'products',        icon: '📦', link: '/products', accent: '#10b981' },
  { label: 'Pedidos totales', key: 'orders',           icon: '📋', link: '/orders',   accent: '#059669' },
  { label: 'Pagos pendientes',key: 'pendingPayments',  icon: '⏳', link: '/orders',   accent: '#f59e0b' },
] as const;

export function getPlanStatusClass(status: string): 'planActive' | 'planTrial' | 'planWarning' {
  if (status === 'ACTIVE')   return 'planActive';
  if (status === 'TRIALING') return 'planTrial';
  return 'planWarning';
}

export function getPlanStatusLabel(status: string): string {
  if (status === 'ACTIVE')   return '✓ Activo';
  if (status === 'TRIALING') return '⏱ Trial';
  return status;
}

export function useDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, orders: 0, pendingPayments: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get('/products?limit=1').then((r) => r.data.total).catch(() => 0),
      api.get('/orders?limit=1').then((r) => r.data.total).catch(() => 0),
      api.get('/payments/pending').then((r) => r.data.length).catch(() => 0),
    ]).then(([products, orders, pendingPayments]) =>
      setStats({ products, orders, pendingPayments })
    );
  }, [user?.id]);

  return { user, stats };
}
