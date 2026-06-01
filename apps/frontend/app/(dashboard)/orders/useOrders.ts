'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName?: string;
  customerPhone?: string;
  total: number;
  currency: string;
  createdAt: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  payment?: { status: string; proofUrl?: string };
}

export interface RankItem {
  productId:   string;
  productName: string;
  price:       number;
  currency:    string;
  imageUrl:    string | null;
  clicks:      number;
  waClicks:    number;
  fbClicks:    number;
  cartClicks:  number;
}

export type OrderTab = 'ranking' | 'orders';

// Configuración y mapeos — aquí, no en el JSX
export const DAY_OPTIONS = [7, 14, 30, 90];

export const MEDAL = ['🥇', '🥈', '🥉', '4°', '5°'];

export interface StatusConfig { label: string; cssKey: string }
export const STATUS_MAP: Record<string, StatusConfig> = {
  PENDING:   { label: 'Pendiente',  cssKey: 'statusPending'   },
  CONFIRMED: { label: 'Confirmado', cssKey: 'statusConfirmed' },
  PAID:      { label: 'Pagado',     cssKey: 'statusPaid'      },
  SHIPPED:   { label: 'Enviado',    cssKey: 'statusShipped'   },
  COMPLETED: { label: 'Completado', cssKey: 'statusPaid'      },
  CANCELED:  { label: 'Cancelado',  cssKey: 'statusCanceled'  },
};

export const SUMMARY_CARDS = [
  { icon: '💬', label: 'Clicks WhatsApp',  key: 'waClicks',       color: '#25d366' },
  { icon: '📦', label: 'Clicks totales',   key: 'totalClicks',    color: '#059669' },
  { icon: '🛒', label: 'Pedidos totales',  key: 'totalOrders',    color: '#0d6efd' },
  { icon: '⏳', label: 'Pendientes',        key: 'pendingOrders',  color: '#f59e0b' },
  { icon: '✅', label: 'Productos activos', key: 'activeProducts', color: '#10b981' },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { v: '',         l: 'Todos'         },
  { v: 'PENDING',  l: '⏳ Pendientes' },
  { v: 'PAID',     l: '✅ Pagados'    },
  { v: 'CANCELED', l: '❌ Cancelados' },
];

export function useOrders() {
  const [tab, setTab]                   = useState<OrderTab>('ranking');
  const [orders, setOrders]             = useState<Order[]>([]);
  const [ranking, setRanking]           = useState<RankItem[]>([]);
  const [summary, setSummary]           = useState({ totalOrders: 0, pendingOrders: 0, totalClicks: 0, waClicks: 0, activeProducts: 0 });
  const [days, setDays]                 = useState(30);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/analytics/summary?days=${days}`).then((r) => setSummary(r.data)).catch(() => {}),
      api.get(`/analytics/products?days=${days}`).then((r) => setRanking(r.data || [])).catch(() => {}),
      api.get('/orders?limit=50').then((r) => setOrders(r.data.items || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [days]);

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const maxClicks     = ranking.length > 0 ? Math.max(...ranking.map((r) => r.clicks), 1) : 1;
  const bestProducts  = ranking.slice(0, 5);
  const worstProducts = [...ranking].reverse().slice(0, 5);

  return {
    tab, setTab,
    orders: filteredOrders, ranking,
    summary, days, setDays,
    loading, maxClicks,
    bestProducts, worstProducts,
    statusFilter, setStatusFilter,
  };
}
