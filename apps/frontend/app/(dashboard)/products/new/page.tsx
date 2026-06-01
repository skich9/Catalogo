'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './newProduct.module.css';
import { useNewProduct } from './useNewProduct';
import { MediaUploader } from '@/components/MediaUploader';

const CURRENCIES = ['BOB', 'USD', 'ARS', 'PEN', 'CLP'];

export default function NewProductPage() {
  const {
    form, setField, media, setMedia,
    categories, saving, error,
    addSpec, setSpec, removeSpec,
    handleSave,
  } = useNewProduct();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/products" className={styles.backBtn}>← Productos</Link>
        <h2 className={styles.title}>Nuevo producto</h2>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small mb-3">{error}</div>
      )}

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
                  Nombre del producto <span className={styles.required}>*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Ej: Auriculares Bluetooth Pro"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
              </div>
              <div className="mb-1">
                <label className={styles.label}>Descripción</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describí el producto, sus características principales..."
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
                  <select
                    className="form-select"
                    value={form.currency}
                    onChange={(e) => setField('currency', e.target.value)}
                  >
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={styles.label}>
                    Precio <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField('price', e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>
                    Precio anterior <span className={styles.compareTag}>(tachado)</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.comparePrice}
                    onChange={(e) => setField('comparePrice', e.target.value)}
                  />
                </div>
              </div>
              {form.comparePrice && Number(form.comparePrice) > Number(form.price) && (
                <p className="small mt-2" style={{ color: '#059669' }}>
                  ✓ Se mostrará un descuento de{' '}
                  {Math.round((1 - Number(form.price) / Number(form.comparePrice)) * 100)}%
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
                productId={undefined}
                items={media}
                onChange={setMedia}
                maxItems={8}
              />
              <p className={styles.hint} style={{ marginTop: '0.5rem' }}>
                Las fotos y videos se suben a Cloudinary. La primera foto se usa como miniatura en el catálogo. Podés reproducir videos con hover. ⭐ = marcar como principal.
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
              {form.specs.length === 0 && (
                <p className="small text-muted mb-3">
                  Agregá características del producto (Color, Talla, Material, etc.)
                </p>
              )}
              {form.specs.map((spec, i) => (
                <motion.div
                  key={i}
                  className={styles.specRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <input
                    className="form-control form-control-sm"
                    placeholder="Ej: Color"
                    value={spec.key}
                    onChange={(e) => setSpec(i, 'key', e.target.value)}
                  />
                  <input
                    className="form-control form-control-sm"
                    placeholder="Ej: Rojo"
                    value={spec.value}
                    onChange={(e) => setSpec(i, 'value', e.target.value)}
                  />
                  <button className={styles.specDelBtn} onClick={() => removeSpec(i)}>✕</button>
                </motion.div>
              ))}
              <button className={styles.addSpecBtn} onClick={addSpec}>
                + Agregar especificación
              </button>
            </div>
          </div>

          {/* Contacto (opcional) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📱</span>
              <p className={styles.cardTitle}>Contacto directo (opcional)</p>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.hint} style={{ marginTop: 0, marginBottom: '1rem' }}>
                Si lo dejás vacío, se usa el WhatsApp/Facebook configurado en tu tienda
              </p>
              <div className="mb-3">
                <label className={styles.label}>WhatsApp específico del producto</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="+591 70000000"
                  value={form.whatsappNumber}
                  onChange={(e) => setField('whatsappNumber', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className={styles.label}>Mensaje de WhatsApp para este producto</label>
                <input
                  className="form-control form-control-sm"
                  placeholder={`Hola! Me interesa el producto: ${form.name || '...'}`}
                  value={form.whatsappMessage}
                  onChange={(e) => setField('whatsappMessage', e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Link de Facebook del producto</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="https://facebook.com/..."
                  value={form.facebookUrl}
                  onChange={(e) => setField('facebookUrl', e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* ─── Columna lateral ──────────────────────────────────────────── */}
        <div>

          {/* Acciones */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🚀</span>
              <p className={styles.cardTitle}>Publicar</p>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.actionBar}>
                <button
                  className={styles.btnPublish}
                  onClick={() => handleSave(true)}
                  disabled={saving}
                >
                  {saving
                    ? <><span className="spinner-border spinner-border-sm" /> Guardando...</>
                    : '🚀 Publicar producto'
                  }
                </button>
                <button
                  className={styles.btnDraft}
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  💾 Guardar como borrador
                </button>
                <p className={styles.statusInfo}>
                  Borrador: visible solo para vos<br />
                  Publicado: visible en tu catálogo
                </p>
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
                <select
                  className="form-select form-select-sm"
                  value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Producto destacado */}
              <label className={styles.label}>Destacado</label>
              <div
                className={`${styles.featuredToggle} ${form.isFeatured ? styles.featuredToggleOn : ''}`}
                onClick={() => setField('isFeatured', !form.isFeatured)}
              >
                <div className={styles.toggleTrack}>
                  <div className={`${styles.toggleThumb} ${form.isFeatured ? styles.toggleThumbOn : ''}`} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: form.isFeatured ? '#059669' : '#334155' }}>
                    {form.isFeatured ? '⭐ Producto destacado' : 'Producto normal'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.73rem', color: '#94a3b8' }}>
                    Los destacados aparecen primero
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview de precio */}
          {(form.price || form.name) && (
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>👁️</span>
                <p className={styles.cardTitle}>Vista previa</p>
              </div>
              <div className={styles.cardBody} style={{ padding: '1rem' }}>
                <div style={{
                  border: '1px solid #e2e8f0', borderRadius: 10,
                  overflow: 'hidden', background: 'white',
                }}>
                  {media[0] ? (
                    media[0].resourceType === 'video'
                      ? <video src={media[0].url} style={{ width: '100%', height: 120, objectFit: 'cover' }} muted />
                      : <img src={media[0].url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 100, background: 'linear-gradient(135deg,#e2e8f0,#f1f5f9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '2rem' }}>
                      📦
                    </div>
                  )}
                  <div style={{ padding: '0.6rem 0.8rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', margin: '0 0 4px' }}>
                      {form.name || 'Nombre del producto'}
                    </p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>
                        {form.currency} {form.price || '0.00'}
                      </span>
                      {form.comparePrice && (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                          {form.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
