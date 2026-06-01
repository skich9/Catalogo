'use client';

import { useEffect, useState } from 'react';

export function useDarkMode(storageKey = 'app-dark-mode') {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'true') setDark(true);
  }, [storageKey]);

  const toggle = () => {
    setDark((d) => {
      localStorage.setItem(storageKey, String(!d));
      return !d;
    });
  };

  return { dark, toggle };
}
