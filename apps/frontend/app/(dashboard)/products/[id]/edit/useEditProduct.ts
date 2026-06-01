'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { MediaItem } from '@/components/MediaUploader';
import type { ProductForm, Spec } from '../../new/useNewProduct';

export function useEditProduct(id: string) {
  const router = useRouter();
  const [form, setFormState]  = useState<ProductForm>({
    name: '', description: '', price: '', comparePrice: '',
    currency: 'BOB', categoryId: '', status: 'DRAFT',
    isFeatured: false, whatsappNumber: '', whatsappMessage: '',
    facebookUrl: '', specs: [],
  });
  const [media, setMedia]       = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setFormState({
          name:             data.name          || '',
          description:      data.description   || '',
          price:            String(data.price  || ''),
          comparePrice:     data.comparePrice ? String(data.comparePrice) : '',
          currency:         data.currency      || 'BOB',
          categoryId:       data.categoryId    || '',
          status:           data.status        || 'DRAFT',
          isFeatured:       data.isFeatured    || false,
          whatsappNumber:   data.whatsappNumber   || '',
          whatsappMessage:  data.whatsappMessage  || '',
          facebookUrl:      data.facebookUrl      || '',
          specs:            data.specs?.map((s: any) => ({ key: s.key, value: s.value })) || [],
        });

        const sorted = [...(data.images || [])].sort((a: any, b: any) => {
          if (a.isPrimary) return -1;
          if (b.isPrimary) return 1;
          return a.sortOrder - b.sortOrder;
        });
        setMedia(sorted.map((img: any) => ({
          id:           img.id,
          url:          img.url,
          publicId:     img.publicId,
          isPrimary:    img.isPrimary,
          resourceType: img.resourceType || 'image',
        })));
      })
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  const setField = (field: keyof ProductForm, value: any) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const addSpec  = () => setFormState((p) => ({ ...p, specs: [...p.specs, { key: '', value: '' }] }));
  const setSpec  = (i: number, field: 'key' | 'value', val: string) =>
    setFormState((p) => ({ ...p, specs: p.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  const removeSpec = (i: number) =>
    setFormState((p) => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }));

  const handleSave = async (andPublish = false) => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('El precio debe ser un número válido'); return; }

    setSaving(true);
    setError('');
    try {
      await api.patch(`/products/${id}`, {
        ...form,
        price:        Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        status:       andPublish ? 'ACTIVE' : form.status,
        specs:        form.specs.filter((s) => s.key.trim() && s.value.trim()),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (andPublish) router.push('/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return {
    form, setField, media, setMedia,
    categories, loading, saving, error, saved,
    addSpec, setSpec, removeSpec, handleSave,
  };
}
