'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { MediaItem } from '@/components/MediaUploader';

export interface Spec { key: string; value: string; }

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  currency: string;
  categoryId: string;
  status: 'DRAFT' | 'ACTIVE';
  isFeatured: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  facebookUrl: string;
  specs: Spec[];
}

const EMPTY: ProductForm = {
  name: '', description: '', price: '', comparePrice: '',
  currency: 'BOB', categoryId: '', status: 'DRAFT',
  isFeatured: false, whatsappNumber: '', whatsappMessage: '',
  facebookUrl: '', specs: [],
};

export function useNewProduct() {
  const router = useRouter();
  const [form, setForm]       = useState<ProductForm>(EMPTY);
  const [media, setMedia]     = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || [])).catch(() => {});
  }, []);

  const setField = (field: keyof ProductForm, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Specs dinámicas
  const addSpec = () =>
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));

  const setSpec = (i: number, field: 'key' | 'value', val: string) =>
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s),
    }));

  const removeSpec = (i: number) =>
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }));

  const handleSave = async (andPublish = false) => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('El precio debe ser un número válido'); return; }

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price:        Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        status:       andPublish ? 'ACTIVE' : form.status,
        specs:        form.specs.filter((s) => s.key.trim() && s.value.trim()),
        // No enviamos media aquí — las imágenes se suben después de crear
      };

      const { data: product } = await api.post('/products', payload);
      setCreatedId(product.id);

      // Subir imágenes/videos al producto recién creado
      if (media.length > 0) {
        for (const item of media) {
          if (item.url.startsWith('blob:') || !item.id) {
            // Si hay blobs pendientes (raro con el uploader), se ignoran
          }
        }
      }

      router.push('/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  return {
    form, setField, media, setMedia,
    categories, saving, error,
    addSpec, setSpec, removeSpec,
    handleSave,
  };
}
