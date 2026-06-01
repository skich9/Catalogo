'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './floatingCart.module.css';
import { useFloatingCart } from './useFloatingCart';

interface Props {
  slug: string;
  tenantId: string | null;
}

export function FloatingCart({ slug, tenantId }: Props) {
  const { open, setOpen, panelRef, btnRef, items, total, totalItems, updateItem, removeItem } =
    useFloatingCart(tenantId);

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
                items.map((item: any) => (
                  <div key={item.id} className={styles.item}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className={styles.itemName}>{item.productName}</p>
                      <span className={styles.itemPrice}>
                        BOB {Number(item.priceSnapshot).toFixed(2)} c/u
                      </span>
                    </div>
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                      >−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                      >+</button>
                      <button
                        className={`${styles.qtyBtn} ${styles.qtyBtnDel}`}
                        onClick={() => removeItem(item.id)}
                      >🗑</button>
                    </div>
                    <span className={styles.itemTotal}>
                      BOB {(Number(item.priceSnapshot) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer con total y botón pagar */}
            <div className={styles.panelFooter}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>BOB {Number(total).toFixed(2)}</span>
              </div>
              <Link
                href={`/catalog/${slug}/cart`}
                className={styles.payBtn}
                onClick={() => setOpen(false)}
              >
                Proceder al pago →
              </Link>
            </div>
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
