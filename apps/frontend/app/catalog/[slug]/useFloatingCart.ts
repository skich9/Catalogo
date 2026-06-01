'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export function useFloatingCart(tenantId: string | null) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef  = useRef<HTMLButtonElement>(null);
  const { items, total, updateItem, removeItem } = useCartStore();

  // Cierra al hacer click fuera del panel y del botón
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return { open, setOpen, panelRef, btnRef, items, total, totalItems, updateItem, removeItem };
}
