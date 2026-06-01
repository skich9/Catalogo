'use client';

import { useEffect, useState } from 'react';

export const FEATURES = [
  {
    icon: '📦',
    title: 'Catálogo de Productos',
    text: 'Sube fotos, especificaciones y precios. Organiza por categorías en segundos.',
  },
  {
    icon: '💬',
    title: 'Contacto Directo',
    text: 'Botones de WhatsApp y Facebook en cada producto para cerrar ventas al instante.',
  },
  {
    icon: '🏦',
    title: 'Pago QR Bolivia',
    text: 'Tus clientes pagan con QR de cualquier banco boliviano. Sin intermediarios.',
  },
  {
    icon: '👥',
    title: 'Gestión de Equipo',
    text: 'Administradores y empleados con permisos diferenciados para tu negocio.',
  },
];

export const PLANS = [
  {
    name: 'Free',
    price: '$0',
    sub: 'Para empezar',
    products: '10',
    employees: '1',
    featured: false,
  },
  {
    name: 'Starter',
    price: '$19',
    sub: '/mes',
    products: '100',
    employees: '3',
    featured: true,
  },
  {
    name: 'Professional',
    price: '$49',
    sub: '/mes',
    products: '500',
    employees: '10',
    featured: false,
  },
];

export function useLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled };
}
