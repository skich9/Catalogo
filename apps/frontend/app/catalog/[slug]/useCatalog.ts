'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

const FONT_URLS: Record<string, string> = {
  inter:       'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  poppins:     'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap',
  montserrat:  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap',
  nunito:      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
  playfair:    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap',
  roboto:      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  lato:        'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
};

const FONT_FAMILIES: Record<string, string> = {
  default:     'system-ui, sans-serif',
  inter:       "'Inter', sans-serif",
  poppins:     "'Poppins', sans-serif",
  montserrat:  "'Montserrat', sans-serif",
  nunito:      "'Nunito', sans-serif",
  playfair:    "'Playfair Display', serif",
  roboto:      "'Roboto', sans-serif",
  lato:        "'Lato', sans-serif",
};

export interface CatalogImage {
  id?: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
  resourceType?: string;
}

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
  images: CatalogImage[];
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
  instagramUrl?: string;
  tiktokUrl?: string;
  cartMode: 'WHATSAPP' | 'QR_PAYMENT';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  categories: { id: string; name: string; slug: string }[];
}

export function useCatalog(slug: string) {
  const [catalog, setCatalog]   = useState<CatalogInfo | null>(null);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [search, setSearch]     = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading]   = useState(true);
  const [cartNotif, setCartNotif] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const { addItem, items } = useCartStore();

  // Cargar info del catálogo + inyectar fuente
  useEffect(() => {
    api.get(`/public/catalog/${slug}`)
      .then((r) => {
        const data = r.data;
        setCatalog(data);
        // Inyectar la fuente elegida por el negocio
        const fontId = data.fontFamily || 'default';
        if (fontId !== 'default' && FONT_URLS[fontId]) {
          const url = FONT_URLS[fontId];
          if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
          }
        }
      })
      .catch(() => setCatalog(null));
  }, [slug]);

  // Cargar productos — usa el slug directamente, no el objeto catalog
  useEffect(() => {
    setLoading(true);
    setProducts([]);
    const params = new URLSearchParams();
    if (search)     params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);

    api.get(`/public/catalog/${slug}/products?${params}`)
      .then((r) => setProducts(r.data.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug, search, categoryId]); // sin depender del objeto catalog

  const handleAddToCart = async (product: CatalogProduct) => {
    if (!catalog) return;
    await addItem(catalog.id, product.id);
    api.post('/analytics/click', { tenantId: catalog.id, productId: product.id, type: 'cart' }).catch(() => {});
    setCartNotif(`✓ ${product.name} agregado`);
    setTimeout(() => setCartNotif(''), 2500);
  };

  const buildWaLink = (phone: string, msg?: string, productId?: string) => {
    if (catalog?.id && productId) {
      api.post('/analytics/click', { tenantId: catalog.id, productId, type: 'whatsapp' }).catch(() => {});
    }
    const clean = phone.replace(/\D/g, '');
    return msg ? `https://wa.me/${clean}?text=${encodeURIComponent(msg)}` : `https://wa.me/${clean}`;
  };

  const openProduct  = (product: CatalogProduct) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  const fontFamily = FONT_FAMILIES[catalog?.fontFamily || 'default'] || 'system-ui, sans-serif';

  return {
    catalog, products,
    search, setSearch,
    categoryId, setCategoryId,
    loading, cartNotif, items,
    selectedProduct, openProduct, closeProduct,
    handleAddToCart, buildWaLink,
    fontFamily,
  };
}
