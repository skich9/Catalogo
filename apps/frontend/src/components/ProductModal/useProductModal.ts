'use client';

import { useState, useEffect, useCallback } from 'react';

export function useProductModal() {
  const [currentImg, setCurrentImg] = useState(0);
  const [zoomed, setZoomed]         = useState(false);

  const reset = useCallback(() => {
    setCurrentImg(0);
    setZoomed(false);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return; // lo maneja el padre
      if (e.key === 'ArrowRight') setCurrentImg((c) => c + 1);
      if (e.key === 'ArrowLeft')  setCurrentImg((c) => Math.max(0, c - 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { currentImg, setCurrentImg, zoomed, setZoomed, reset };
}
