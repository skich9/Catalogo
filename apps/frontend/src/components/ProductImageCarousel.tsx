'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
  url: string;
  resourceType?: string;
}

interface Props {
  items: MediaItem[];
  height?: number;
  autoPlay?: boolean;
  dark?: boolean;
}

export function ProductImageCarousel({ items, height = 180, autoPlay = true, dark }: Props) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const media = items?.length ? items : [{ url: '', resourceType: 'image' }];
  const count  = media.length;

  useEffect(() => {
    if (!autoPlay || count <= 1 || hovered) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % count), 2800);
    return () => clearInterval(t);
  }, [count, autoPlay, hovered]);

  const go = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(i);
  };

  const item = media[current];

  // Colores del placeholder adaptados al dark mode
  const placeholderBg = dark
    ? 'linear-gradient(135deg, #1e293b, #263347)'
    : 'linear-gradient(135deg, #e2e8f0, #f8fafc)';

  const wrapperBg = dark ? '#1a2540' : '#f1f5f9';

  return (
    <div
      style={{ position: 'relative', height, overflow: 'hidden', background: wrapperBg }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {!item.url ? (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: placeholderBg,
              fontSize: '2.5rem',
            }}>📦</div>
          ) : item.resourceType === 'video' ? (
            <video
              src={item.url}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              autoPlay muted loop playsInline
            />
          ) : (
            <img
              src={item.url}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      {count > 1 && (
        <div style={{
          position: 'absolute', bottom: 7, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 5, zIndex: 2,
        }}>
          {media.map((_, i) => (
            <button
              key={i}
              onClick={(e) => go(i, e)}
              style={{
                width: i === current ? 18 : 7,
                height: 7,
                borderRadius: 999,
                background: i === current ? '#059669' : 'rgba(255,255,255,0.6)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s',
              }}
            />
          ))}
        </div>
      )}

      {/* Video badge */}
      {item.resourceType === 'video' && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', color: 'white',
          fontSize: '0.62rem', fontWeight: 700,
          padding: '2px 6px', borderRadius: 4,
        }}>▶ VIDEO</div>
      )}
    </div>
  );
}
