'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  currency: string;
  isFeatured: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
  facebookUrl?: string;
  images: { url: string; altText?: string }[];
  category?: { name: string; slug: string };
  specs: { key: string; value: string }[];
}

export interface CatalogInfo {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  facebookPageUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  cartMode: 'WHATSAPP' | 'QR_PAYMENT';
  categories: { id: string; name: string; slug: string }[];
}

export function useCatalog(slug: string) {
  const [catalog, setCatalog] = useState<CatalogInfo | null>(null);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartNotif, setCartNotif] = useState('');
  const { addItem, items } = useCartStore();

  useEffect(() => {
    api.get(`/public/catalog/${slug}`).then((r) => setCatalog(r.data)).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!catalog) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    api
      .get(`/public/catalog/${slug}/products?${params}`)
      .then((r) => setProducts(r.data.items || []))
      .finally(() => setLoading(false));
  }, [catalog, search, categoryId, slug]);

  const handleAddToCart = async (product: CatalogProduct) => {
    if (!catalog) return;
    await addItem(catalog.id, product.id);
    setCartNotif(`✓ ${product.name} agregado al carrito`);
    setTimeout(() => setCartNotif(''), 2500);
  };

  const buildWaLink = (phone: string, msg?: string) => {
    const clean = phone.replace(/\D/g, '');
    return msg ? `https://wa.me/${clean}?text=${encodeURIComponent(msg)}` : `https://wa.me/${clean}`;
  };

  return {
    catalog,
    products,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    loading,
    cartNotif,
    items,
    handleAddToCart,
    buildWaLink,
  };
}
