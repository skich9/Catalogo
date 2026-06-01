'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export function useFloatingCart(tenantId: string | null, waPhone?: string | null) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);
  const { items, total, updateItem, removeItem } = useCartStore();

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  // Generar link de WhatsApp con detalle del carrito
  const buildCartWaLink = () => {
    if (!waPhone || items.length === 0) return null;
    const clean = waPhone.replace(/\D/g, '');
    const lines = items
      .map((i) => `• ${i.quantity}x ${i.productName} — BOB ${(Number(i.priceSnapshot) * i.quantity).toFixed(2)}`)
      .join('\n');
    const msg = `Hola! Quiero hacer el siguiente pedido:\n\n${lines}\n\nTotal: BOB ${Number(total).toFixed(2)}`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  return {
    open, setOpen, panelRef, btnRef,
    items, total, totalItems,
    updateItem, removeItem,
    buildCartWaLink,
  };
}
