'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

export type CheckoutStep = 'cart' | 'form' | 'qr' | 'whatsapp';

export function useCartPage(slug: string) {
  const router = useRouter();
  const { items, total, updateItem, removeItem, checkout } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [form, setFormState] = useState({
    customerName: '', customerPhone: '', customerEmail: '', notes: '',
  });
  const [orderResult, setOrderResult] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [proofSent, setProofSent] = useState(false);

  const setField = (field: string, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleCheckout = async () => {
    try {
      const catalogRes = await api.get(`/public/catalog/${slug}`);
      const tenantId = catalogRes.data.id;
      const result = await checkout(tenantId, form);
      setOrderResult(result);
      setStep(result.cartMode === 'WHATSAPP' ? 'whatsapp' : 'qr');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al procesar el pedido');
    }
  };

  const handleProofUpload = async () => {
    if (!proofFile || !orderResult?.order?.id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', proofFile);
      const uploadRes = await api.post('/storage/upload', formData);
      await api.post(`/payments/${orderResult.order.id}/proof`, {
        proofUrl: uploadRes.data.url,
        proofPublicId: uploadRes.data.publicId,
      });
      setProofSent(true);
    } catch {
      alert('Error subiendo comprobante. Intentá de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return {
    items, total, step, setStep,
    form, setField,
    orderResult,
    proofFile, setProofFile,
    uploading, proofSent,
    handleCheckout, handleProofUpload,
    updateItem, removeItem,
  };
}
