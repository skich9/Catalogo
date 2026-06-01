'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './products.module.css';
import { useProducts } from './useProducts';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';

const STATUS_OPTIONS = [
  { value: '',         label: 'Todos' },
  { value: 'ACTIVE',   label: '✅ Activos' },
  { value: 'DRAFT',    label: '📝 Borradores' },
  { value: 'ARCHIVED', label: '📦 Archivados' },
];

export default function ProductsPage() {
  const {
    products, loading, total, page, setPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    toggleStatus, deleteProduct, deleting,
  } = useProducts();

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>📦 Mis Productos</h2>
          <p className={styles.subtitle}>{total} producto{total !== 1 ? 's' : ''} en total</p>
        </div>
        <Link href="/products/new" className="btn btn-primary btn-sm">
          + Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="search"
          className="form-control form-control-sm"
          style={{ maxWidth: 260 }}
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="d-flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className="btn btn-sm"
              style={{
                borderRadius: 7,
                fontWeight: 600,
                fontSize: '0.78rem',
                background: statusFilter === opt.value ? '#059669' : '#f1f5f9',
                color:      statusFilter === opt.value ? 'white'   : '#64748b',
                border:     statusFilter === opt.value ? 'none'    : '1px solid #e2e8f0',
              }}
              onClick={() => { setStatusFilter(opt.value); setPage(1); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#10b981' }} />
        </div>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {products.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <p style={{ fontWeight: 700, color: '#334155' }}>No hay productos todavía</p>
                <Link href="/products/new" className="btn btn-primary btn-sm mt-2">
                  Crear primer producto
                </Link>
              </div>
            ) : (
              products.map((product, i) => {
                const sorted = [...(product.images || [])].sort((a, b) => {
                  if (a.isPrimary) return -1;
                  if (b.isPrimary) return 1;
                  return a.sortOrder - b.sortOrder;
                });
                const discountPct = product.comparePrice && product.comparePrice > product.price
                  ? Math.round((1 - product.price / product.comparePrice) * 100)
                  : 0;

                return (
                  <motion.div
                    key={product.id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.22 }}
                    layout
                  >
                    {/* Carrusel de imágenes */}
                    <div className={styles.cardMedia}>
                      <ProductImageCarousel items={sorted} height={180} />
                      <div className={styles.badges}>
                        <span className={`${styles.badgeStatus} ${
                          product.status === 'ACTIVE'   ? styles.badgeActive :
                          product.status === 'DRAFT'    ? styles.badgeDraft  :
                                                          styles.badgeArchived
                        }`}>
                          {product.status === 'ACTIVE' ? 'Activo' :
                           product.status === 'DRAFT'  ? 'Borrador' : 'Archivado'}
                        </span>
                        {product.isFeatured && (
                          <span className={`${styles.badgeStatus} ${styles.badgeFeatured}`}>
                            ⭐ Destacado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className={styles.cardBody}>
                      <p className={styles.productName}>{product.name}</p>

                      {/* Precio */}
                      <div className={styles.priceRow}>
                        <span className={styles.price}>
                          {product.currency} {Number(product.price).toFixed(2)}
                        </span>
                        {product.comparePrice && (
                          <span className={styles.comparePrice}>
                            {Number(product.comparePrice).toFixed(2)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className={styles.discount}>-{discountPct}%</span>
                        )}
                      </div>

                      {/* Specs */}
                      {product.specs?.length > 0 && (
                        <div className={styles.specs}>
                          {product.specs.slice(0, 4).map((s, si) => (
                            <span key={si} className={styles.spec}>
                              <span className={styles.specKey}>{s.key}:</span> {s.value}
                            </span>
                          ))}
                          {product.specs.length > 4 && (
                            <span className={styles.spec} style={{ color: '#94a3b8' }}>
                              +{product.specs.length - 4} más
                            </span>
                          )}
                        </div>
                      )}

                      {/* Acciones */}
                      <div className={styles.actions}>
                        <Link href={`/products/${product.id}/edit`} className={styles.btnEdit}>
                          ✏️ Editar
                        </Link>
                        <button
                          className={`${styles.btnToggle} ${
                            product.status === 'ACTIVE' ? styles.btnToggleActive : styles.btnToggleDraft
                          }`}
                          onClick={() => toggleStatus(product)}
                        >
                          {product.status === 'ACTIVE' ? '⏸ Pausar' : '▶ Publicar'}
                        </button>
                        <button
                          className={styles.btnDelete}
                          onClick={() => deleteProduct(product.id)}
                          disabled={deleting === product.id}
                          title="Eliminar producto"
                        >
                          {deleting === product.id
                            ? <span className="spinner-border spinner-border-sm" />
                            : '🗑'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Paginación */}
      {total > 20 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-sm"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >← Anterior</button>
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Página {page} de {Math.ceil(total / 20)}
          </span>
          <button
            className="btn btn-sm"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
          >Siguiente →</button>
        </div>
      )}
    </div>
  );
}
