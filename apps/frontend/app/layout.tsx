'use client';

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import 'aos/dist/aos.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar AOS para las animaciones al hacer scroll
    import('aos').then((AOS) => {
      AOS.default.init({
        duration: 400,
        once: true,      // solo anima una vez al entrar en pantalla
        offset: 60,
        easing: 'ease-out-cubic',
      });
    });
  }, []);

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
