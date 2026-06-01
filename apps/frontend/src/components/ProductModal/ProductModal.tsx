'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './productModal.module.css';
import { useProductModal } from './useProductModal';
import type { CatalogProduct, CatalogInfo } from '@/app/catalog/[slug]/useCatalog';

interface Props {
  product: CatalogProduct | null;
  catalog: CatalogInfo | null;
  onClose: () => void;
  onAddToCart: (product: CatalogProduct) => void;
  buildWaLink: (phone: string, msg?: string, productId?: string) => string;
}

export function ProductModal({ product, catalog, onClose, onAddToCart, buildWaLink }: Props) {
  const { currentImg, setCurrentImg, zoomed, setZoomed, reset } = useProductModal();
  const [added, setAdded] = useState(false);

  // Reset state when product changes
  useEffect(() => { reset(); setAdded(false); }, [product?.id, reset]);

  // Block body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;

  const media = product.images || [];
  const safeIdx = Math.min(currentImg, Math.max(media.length - 1, 0));
  const current = media[safeIdx];

  const discountPct = product.comparePrice && Number(product.comparePrice) > Number(product.price)
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0;

  const waPhone = product.whatsappNumber || catalog?.whatsappNumber;
  const waMsg   = product.whatsappMessage ||
    `Hola! Me interesa: *${product.name}* — ${product.currency} ${Number(product.price).toFixed(2)}`;
  const fbLink  = product.facebookUrl || catalog?.facebookPageUrl;

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.body}>
          {/* ─── Galería ─────────────────────────────────────────────── */}
          <div className={styles.gallery}>
            {/* Imagen/video principal */}
            <div
              className={`${styles.mainImgWrap} ${zoomed ? styles.zoomed : ''}`}
              onClick={() => media.length > 0 && setZoomed((z) => !z)}
            >
              <AnimatePresence mode="wait">
                {!current ? (
                  <div key="placeholder" style={{
                    fontSize: '4rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%',
                  }}>📦</div>
                ) : current.resourceType === 'video' ? (
                  <motion.video
                    key={current.url}
                    src={current.url}
                    className={styles.mainVideo}
                    controls autoPlay muted loop playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                ) : (
                  <motion.img
                    key={current.url}
                    src={current.url}
                    alt={current.altText || product.name}
                    className={styles.mainImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    draggable={false}
                  />
                )}
              </AnimatePresence>

              {/* Flechas */}
              {media.length > 1 && (
                <>
                  <button
                    className={`${styles.arrow} ${styles.arrowLeft} ${safeIdx === 0 ? styles.arrowHidden : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCurrentImg(safeIdx - 1); }}
                  >‹</button>
                  <button
                    className={`${styles.arrow} ${styles.arrowRight} ${safeIdx >= media.length - 1 ? styles.arrowHidden : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCurrentImg(safeIdx + 1); }}
                  >›</button>
                  <span className={styles.imgCounter}>{safeIdx + 1} / {media.length}</span>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {media.length > 1 && (
              <div className={styles.thumbs}>
                {media.map((img, i) => (
                  img.resourceType === 'video' ? (
                    <div
                      key={i}
                      className={`${styles.thumbVideo} ${i === safeIdx ? styles.thumbActive : ''}`}
                      onClick={() => setCurrentImg(i)}
                      style={{
                        background: '#1e293b', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', color: 'white',
                        border: i === safeIdx ? '2px solid #10b981' : '2px solid transparent',
                        opacity: i === safeIdx ? 1 : 0.5,
                      }}
                    >▶</div>
                  ) : (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className={`${styles.thumb} ${i === safeIdx ? styles.thumbActive : ''}`}
                      onClick={() => setCurrentImg(i)}
                    />
                  )
                ))}
              </div>
            )}
          </div>

          {/* ─── Info del producto ─────────────────────────────────────── */}
          <div className={styles.info}>
            {product.category && (
              <p className={styles.category}>{product.category.name}</p>
            )}
            <h2 className={styles.name}>{product.name}</h2>

            {/* Precio */}
            <div className={styles.priceRow}>
              <span className={styles.price}>
                {product.currency} {Number(product.price).toFixed(2)}
              </span>
              {product.comparePrice && Number(product.comparePrice) > 0 && (
                <span className={styles.comparePrice}>
                  {product.currency} {Number(product.comparePrice).toFixed(2)}
                </span>
              )}
              {discountPct > 0 && (
                <span className={styles.discountBadge}>-{discountPct}% OFF</span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {/* Especificaciones */}
            {product.specs?.length > 0 && (
              <>
                <p className={styles.specsTitle}>Especificaciones</p>
                <div className={styles.specsGrid}>
                  {product.specs.map((s, i) => (
                    <div key={i} className={styles.specItem}>
                      <span className={styles.specKey}>{s.key}</span>
                      <span className={styles.specValue}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Acciones */}
            <div className={styles.actionsWrap}>
              {added ? (
                <div className={styles.addedMsg}>✅ Agregado al carrito</div>
              ) : (
                <button className={styles.btnCart} onClick={handleAddToCart}>
                  🛒 Agregar al carrito
                </button>
              )}

              <div className={styles.btnRow}>
                {waPhone && (
                  <a
                    href={buildWaLink(waPhone, waMsg, product.id)}
                    target="_blank" rel="noopener noreferrer"
                    className={styles.btnWa}
                  >
                    💬 WhatsApp
                  </a>
                )}
                {fbLink && (
                  <a
                    href={fbLink}
                    target="_blank" rel="noopener noreferrer"
                    className={styles.btnFb}
                  >
                    📘 Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
