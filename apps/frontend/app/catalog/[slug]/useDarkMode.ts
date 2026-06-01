'use client';

import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('catalog-dark-mode');
    if (saved === 'true') setDark(true);
  }, []);

  const toggle = () => {
    setDark((d) => {
      localStorage.setItem('catalog-dark-mode', String(!d));
      return !d;
    });
  };

  return { dark, toggle };
}
