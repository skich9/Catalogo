'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useDarkMode } from '@/hooks/useDarkMode';

export const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/products',  icon: '📦', label: 'Productos' },
  { href: '/orders',    icon: '📊', label: 'Pedidos' },
  { href: '/settings',  icon: '⚙️', label: 'Configuración' },
];

export function useDashboardLayout() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, fetchMe, logout } = useAuthStore();
  const { dark, toggle: toggleDark } = useDarkMode('dashboard-dark-mode');
  const [initializing, setInitializing] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const token = localStorage.getItem('accessToken');
    if (!token) { router.replace('/login'); setInitializing(false); return; }
    fetchMe().finally(() => setInitializing(false));
  }, []);

  useEffect(() => {
    if (!initializing && !user) router.replace('/login');
  }, [initializing, user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return { user, initializing, pathname, handleLogout, dark, toggleDark };
}
