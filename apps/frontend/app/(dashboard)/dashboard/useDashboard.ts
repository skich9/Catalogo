'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

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
