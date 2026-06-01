'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  currency: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  description?: string;
  images: { id: string; url: string; isPrimary: boolean; resourceType: string; sortOrder: number }[];
  specs: { key: string; value: string }[];
  category?: { id: string; name: string };
}

export function useProducts() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search)       params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleStatus = async (product: Product) => {
    const next = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    try {
      await api.patch(`/products/${product.id}/status`, { status: next });
      setProducts((prev) =>
        prev.map((p) => p.id === product.id ? { ...p, status: next } : p)
      );
    } catch {}
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminár este producto? Esta acción no se puede deshacer.')) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
    } catch { alert('Error al eliminar'); }
    finally { setDeleting(null); }
  };

  return {
    products, loading, total, page, setPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    toggleStatus, deleteProduct, deleting,
    refetch: fetchProducts,
  };
}
