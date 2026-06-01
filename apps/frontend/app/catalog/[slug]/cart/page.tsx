'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './cart.module.css';
import { useCartPage } from './useCartPage';

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    items, total, step, setStep,
    form, setField,
    orderResult, proofFile, setProofFile,
    uploading, proofSent,
    handleCheckout, handleProofUpload,
    updateItem, removeItem,
  } = useCartPage(slug);

  if (step === 'whatsapp' && orderResult) {
    return (
      <div className={styles.successWrap}>
        <motion.div className={styles.successCard}
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className={styles.successIcon}>🎉</span>
          <h3 className={styles.successTitle}>¡Pedido creado!</h3>
          <p className={styles.successSub}>#{orderResult.order.orderNumber}</p>
          <p className="small text-muted">Enviá el detalle por WhatsApp para confirmar con el negocio.</p>
          <a href={orderResult.whatsappLink} target="_blank" rel="noopener noreferrer"
            className="btn btn-lg w-100 mt-2 btn-whatsapp">
            💬 Enviar pedido por WhatsApp
          </a>
          <Link href={`/catalog/${slug}`}
            className="btn btn-sm w-100 mt-2"
            style={{ background: '#f1f5f9', color: '#334155' }}>
            Seguir comprando
          </Link>
        </motion.div>
      </div>
    );
  }

  if (step === 'qr' && orderResult) {
    return (
      <div className={styles.successWrap}>
        <motion.div className={styles.successCard}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h3 className={styles.successTitle}>Pago con QR</h3>
          <p className={styles.successSub}>#{orderResult.order.orderNumber}</p>

          <div className={styles.qrBox}>
            {orderResult.paymentQrUrl ? (
              <>
                <p className="fw-semibold small mb-2" style={{ color: '#047857' }}>
                  Escaneá con tu app bancaria
                </p>
                <img src={orderResult.paymentQrUrl} alt="QR de pago" />
                <p className={styles.qrAmount}>
                  BOB {Number(orderResult.order.total).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-muted small">El negocio te confirmará el método de pago.</p>
            )}
          </div>

          {!proofSent ? (
            <>
              <label className="form-label fw-semibold small text-start d-block" style={{ color: '#334155' }}>
                Subí tu comprobante de pago
              </label>
              <input type="file" className="form-control mb-2" accept="image/*"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
              <button className="btn btn-primary w-100" disabled={!proofFile || uploading}
                onClick={handleProofUpload}>
                {uploading && <span className="spinner-border spinner-border-sm me-2" />}
                Enviar comprobante
              </button>
            </>
          ) : (
            <div className="alert small text-center mb-0"
              style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              ✅ Comprobante enviado. El negocio confirmará tu pago pronto.
            </div>
          )}

          <Link href={`/catalog/${slug}`}
            className="btn btn-sm w-100 mt-2"
            style={{ background: '#f1f5f9', color: '#334155' }}>
            Volver al catálogo
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link href={`/catalog/${slug}`} className={styles.backLink}>
          ← Volver al catálogo
        </Link>
        <h2 className={styles.title}>🛒 Tu carrito</h2>

        {items.length === 0 ? (
          <div className="text-center py-5" style={{ color: '#94a3b8' }}>
            <p>Tu carrito está vacío.</p>
            <Link href={`/catalog/${slug}`} className="btn btn-primary">Ver productos</Link>
          </div>
        ) : step === 'cart' ? (
          <>
            <div className={styles.itemsCard}>
              {items.map((item: any) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className="flex-grow-1">
                    <p className={styles.itemName}>{item.productName}</p>
                    <small className={styles.itemUnit}>
                      BOB {Number(item.priceSnapshot).toFixed(2)} c/u
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button className={styles.qtyBtn} onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
                    <span className="fw-bold" style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                    <button className={styles.qtyBtn} style={{ color: '#ef4444' }}
                      onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                  <span className={styles.itemTotal}>
                    BOB {(Number(item.priceSnapshot) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>BOB {Number(total).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg w-100" onClick={() => setStep('form')}>
              Continuar con el pedido →
            </button>
          </>
        ) : (
          <div className={styles.formCard}>
            <p className={styles.formTitle}>Tus datos (opcional)</p>
            <input className="form-control mb-3" placeholder="Nombre"
              value={form.customerName} onChange={(e) => setField('customerName', e.target.value)} />
            <input className="form-control mb-3" placeholder="WhatsApp / Teléfono"
              value={form.customerPhone} onChange={(e) => setField('customerPhone', e.target.value)} />
            <input className="form-control mb-3" placeholder="Email (opcional)"
              value={form.customerEmail} onChange={(e) => setField('customerEmail', e.target.value)} />
            <textarea className="form-control mb-4" placeholder="Notas del pedido" rows={2}
              value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
            <div className="d-flex gap-2">
              <button className="btn btn-sm" style={{ background: '#f1f5f9', color: '#334155' }}
                onClick={() => setStep('cart')}>← Atrás</button>
              <button className="btn btn-primary flex-grow-1" onClick={handleCheckout}>
                Confirmar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
