'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './floatingCart.module.css';
import { useFloatingCart } from './useFloatingCart';

interface Props {
  slug: string;
  tenantId: string | null;
  waPhone?: string | null;
}

export function FloatingCart({ slug, tenantId, waPhone }: Props) {
  const {
    open, setOpen, panelRef, btnRef,
    items, total, totalItems,
    updateItem, removeItem,
    buildCartWaLink,
  } = useFloatingCart(tenantId, waPhone);

  const waLink = buildCartWaLink();

  return (
    <>
      {/* Panel del carrito */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.5, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 32 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {/* Header */}
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>🛒 Carrito ({totalItems})</p>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Lista de items */}
            <div className={styles.itemList}>
              {items.length === 0 ? (
                <p className={styles.emptyMsg}>Tu carrito está vacío</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    {/* Imagen del producto */}
                    {item.imageUrl
                      ? <img src={item.imageUrl} className={styles.itemImg} alt={item.productName} />
                      : <div className={styles.itemImgPlaceholder}>📦</div>
                    }

                    {/* Info */}
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.productName}</p>
                      <span className={styles.itemPrice}>
                        BOB {Number(item.priceSnapshot).toFixed(2)} c/u
                      </span>
                    </div>

                    {/* Controles de cantidad */}
                    <div className={styles.qtyControls}>
                      <button className={styles.qtyBtn}
                        onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button className={styles.qtyBtn}
                        onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                      <button className={`${styles.qtyBtn} ${styles.qtyBtnDel}`}
                        onClick={() => removeItem(item.id)}>🗑</button>
                    </div>

                    {/* Total del item */}
                    <span className={styles.itemTotal}>
                      BOB {(Number(item.priceSnapshot) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.panelFooter}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>BOB {Number(total).toFixed(2)}</span>
                </div>

                {/* Botón de checkout completo */}
                <Link
                  href={`/catalog/${slug}/cart`}
                  className={styles.payBtn}
                  onClick={() => setOpen(false)}
                >
                  Ver pedido completo →
                </Link>

                {/* Botón WhatsApp directo (para cuando no hay pasarela de pago) */}
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waBtn}
                    onClick={() => setOpen(false)}
                  >
                    💬 Pedir por WhatsApp
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón FAB */}
      <button
        ref={btnRef}
        className={`${styles.fab} ${open ? styles.fabActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Carrito de compras"
      >
        🛒
        {totalItems > 0 && (
          <motion.span
            className={styles.badge}
            key={totalItems}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            {totalItems}
          </motion.span>
        )}
      </button>
    </>
  );
}
