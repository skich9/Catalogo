'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './editProduct.module.css';
import { useEditProduct } from './useEditProduct';
import { MediaUploader } from '@/components/MediaUploader';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';

const CURRENCIES = ['BOB', 'USD', 'ARS', 'PEN', 'CLP'];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const {
    form, setField, media, setMedia,
    categories, loading, saving, error, saved,
    addSpec, setSpec, removeSpec, handleSave,
  } = useEditProduct(id);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#10b981' }} />
      </div>
    );
  }

  const discountPct = form.comparePrice && Number(form.comparePrice) > Number(form.price)
    ? Math.round((1 - Number(form.price) / Number(form.comparePrice)) * 100)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/products" className={styles.backBtn}>← Productos</Link>
        <h2 className={styles.title}>✏️ Editar producto</h2>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      <div className={styles.layout}>
        {/* ─── Columna principal ────────────────────────────────────────── */}
        <div>

          {/* Información básica */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📝</span>
              <p className={styles.cardTitle}>Información básica</p>
            </div>
            <div className={styles.cardBody}>
              <div className="mb-3">
                <label className={styles.label}>
                  Nombre <span className={styles.required}>*</span>
                </label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className="form-control" rows={4}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💰</span>
              <p className={styles.cardTitle}>Precio</p>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.priceRow}>
                <div>
                  <label className={styles.label}>Moneda</label>
                  <select className="form-select" value={form.currency}
                    onChange={(e) => setField('currency', e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Precio <span className={styles.required}>*</span></label>
                  <input type="number" className="form-control" placeholder="0.00"
                    value={form.price} onChange={(e) => setField('price', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}>Precio anterior</label>
                  <input type="number" className="form-control" placeholder="0.00"
                    value={form.comparePrice} onChange={(e) => setField('comparePrice', e.target.value)} />
                </div>
              </div>
              {discountPct > 0 && (
                <p className="small mt-2" style={{ color: '#059669' }}>
                  ✓ Descuento del {discountPct}% visible en el catálogo
                </p>
              )}
            </div>
          </div>

          {/* Fotos y Videos */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🖼️</span>
              <p className={styles.cardTitle}>Fotos y Videos</p>
            </div>
            <div className={styles.cardBody}>
              <MediaUploader
                productId={id}
                items={media}
                onChange={setMedia}
                maxItems={8}
              />
              <p className={styles.hint} style={{ marginTop: '0.5rem' }}>
                Las fotos se suben automáticamente a Cloudinary. ⭐ = foto principal del catálogo.
              </p>
            </div>
          </div>

          {/* Especificaciones */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📋</span>
              <p className={styles.cardTitle}>Especificaciones</p>
            </div>
            <div className={styles.cardBody}>
              {form.specs.map((spec, i) => (
                <motion.div key={i} className={styles.specRow}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <input className="form-control form-control-sm" placeholder="Ej: Color"
                    value={spec.key} onChange={(e) => setSpec(i, 'key', e.target.value)} />
                  <input className="form-control form-control-sm" placeholder="Ej: Rojo"
                    value={spec.value} onChange={(e) => setSpec(i, 'value', e.target.value)} />
                  <button className={styles.specDelBtn} onClick={() => removeSpec(i)}>✕</button>
                </motion.div>
              ))}
              <button className={styles.addSpecBtn} onClick={addSpec}>+ Agregar especificación</button>
            </div>
          </div>

          {/* Contacto */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📱</span>
              <p className={styles.cardTitle}>Contacto directo (opcional)</p>
            </div>
            <div className={styles.cardBody}>
              <div className="mb-3">
                <label className={styles.label}>WhatsApp del producto</label>
                <input className="form-control form-control-sm" placeholder="+591 70000000"
                  value={form.whatsappNumber} onChange={(e) => setField('whatsappNumber', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className={styles.label}>Mensaje de WhatsApp</label>
                <input className="form-control form-control-sm"
                  placeholder={`Me interesa: ${form.name}`}
                  value={form.whatsappMessage} onChange={(e) => setField('whatsappMessage', e.target.value)} />
              </div>
              <div>
                <label className={styles.label}>Link de Facebook</label>
                <input className="form-control form-control-sm" placeholder="https://facebook.com/..."
                  value={form.facebookUrl} onChange={(e) => setField('facebookUrl', e.target.value)} />
              </div>
            </div>
          </div>

        </div>

        {/* ─── Columna lateral ──────────────────────────────────────────── */}
        <div>

          {/* Acciones */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💾</span>
              <p className={styles.cardTitle}>Guardar cambios</p>
            </div>
            <div className={styles.cardBody}>
              <AnimatePresence>
                {saved && (
                  <motion.div className={styles.savedBanner}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} style={{ marginBottom: '0.75rem' }}>
                    ✅ Cambios guardados
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={styles.actionBar}>
                <button className={styles.btnSave} onClick={() => handleSave(false)} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm" /> Guardando...</> : '💾 Guardar cambios'}
                </button>
                {form.status !== 'ACTIVE' && (
                  <button className={styles.btnSecondary} onClick={() => handleSave(true)} disabled={saving}>
                    🚀 Guardar y publicar
                  </button>
                )}
                <Link href="/products" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
                  ← Volver sin guardar
                </Link>
              </div>
            </div>
          </div>

          {/* Organización */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🗂️</span>
              <p className={styles.cardTitle}>Organización</p>
            </div>
            <div className={styles.cardBody}>
              <div className="mb-3">
                <label className={styles.label}>Categoría</label>
                <select className="form-select form-select-sm" value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className={styles.label}>Estado</label>
                <select className="form-select form-select-sm" value={form.status}
                  onChange={(e) => setField('status', e.target.value as any)}>
                  <option value="DRAFT">📝 Borrador</option>
                  <option value="ACTIVE">✅ Activo (visible)</option>
                  <option value="ARCHIVED">📦 Archivado</option>
                </select>
              </div>
              <label className={styles.label}>Destacado</label>
              <div className={`${styles.featuredToggle} ${form.isFeatured ? styles.featuredToggleOn : ''}`}
                onClick={() => setField('isFeatured', !form.isFeatured)}>
                <div className={`${styles.toggleTrack} ${form.isFeatured ? styles.toggleTrackOn : ''}`}>
                  <div className={`${styles.toggleThumb} ${form.isFeatured ? styles.toggleThumbOn : ''}`} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: form.isFeatured ? '#059669' : '#334155' }}>
                    {form.isFeatured ? '⭐ Destacado' : 'Normal'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.73rem', color: '#94a3b8' }}>Aparece primero en el catálogo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {media.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>👁️</span>
                <p className={styles.cardTitle}>Vista previa</p>
              </div>
              <div className={styles.cardBody} style={{ padding: '0.75rem' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <ProductImageCarousel items={media} height={160} />
                  <div style={{ padding: '0.6rem 0.8rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', margin: '0 0 4px' }}>
                      {form.name}
                    </p>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>
                      {form.currency} {form.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
