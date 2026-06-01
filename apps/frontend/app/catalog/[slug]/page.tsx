'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './catalog.module.css';
import { useDarkMode } from './useDarkMode';
import { useCatalog } from './useCatalog';
import { FloatingCart } from './FloatingCart';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductModal } from '@/components/ProductModal/ProductModal';

export default function CatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { dark, toggle } = useDarkMode();
  const {
    catalog, products, search, setSearch,
    categoryId, setCategoryId,
    loading, cartNotif,
    selectedProduct, openProduct, closeProduct,
    handleAddToCart, buildWaLink,
    fontFamily,
  } = useCatalog(slug);

  const primaryColor   = catalog?.primaryColor   || '#059669';
  const secondaryColor = catalog?.secondaryColor || '#0f172a';

  if (!catalog && !loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? '#0f172a' : '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: dark ? '#f1f5f9' : '#1e293b' }}>Catálogo no encontrado</h2>
          <p style={{ color: '#94a3b8' }}>El negocio no existe o está inactivo.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: dark ? '#0f172a' : '#f1f5f9', minHeight: '100vh', fontFamily }}>

      {/* Navbar */}
      <nav className="navbar navbar-dark sticky-top" style={{
        background: `linear-gradient(90deg, ${secondaryColor}, #1e293b)`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}>
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold">{catalog?.name || '...'}</span>
          <button onClick={toggle} title={dark ? 'Modo claro' : 'Modo oscuro'} style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, color: 'white', padding: '0.3rem 0.7rem',
            cursor: 'pointer', fontSize: '1rem',
          }}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Notificación carrito — lado derecho (mismo que el FAB) */}
      <AnimatePresence>
        {cartNotif && (
          <motion.div
            style={{
              position: 'fixed', bottom: 100, right: 28,
              background: '#ecfdf5', border: '1px solid #a7f3d0',
              color: '#047857', borderRadius: 10, padding: '0.7rem 1rem',
              fontWeight: 600, fontSize: '0.85rem', zIndex: 9999,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {cartNotif}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(145deg, ${secondaryColor} 0%, #1e293b 40%, ${primaryColor} 100%)`,
        color: 'white', padding: '56px 0 44px', textAlign: 'center',
      }}>
        <div className="container">
          {catalog?.logoUrl && (
            <img src={catalog.logoUrl} alt={catalog.name} className={styles.heroLogo} />
          )}
          <h1 className={`${styles.heroTitle} animate__animated animate__fadeInDown`}>
            {catalog?.name || '...'}
          </h1>
          {catalog?.description && <p className={styles.heroDesc}>{catalog.description}</p>}
          <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
            {catalog?.whatsappNumber && (
              <a href={buildWaLink(catalog.whatsappNumber, catalog.whatsappMessage)}
                target="_blank" rel="noopener noreferrer" className={`btn ${styles.btnWa}`}>
                💬 WhatsApp
              </a>
            )}
            {catalog?.facebookPageUrl && (
              <a href={catalog.facebookPageUrl} target="_blank" rel="noopener noreferrer"
                className={`btn ${styles.btnFb}`}>📘 Facebook</a>
            )}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div style={{
        background: dark ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        padding: '0.75rem 0', position: 'sticky', top: 56, zIndex: 10,
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}>
        <div className="container">
          <div className="row g-2">
            <div className="col-md-6">
              <input type="search" className="form-control" placeholder="Buscar productos..."
                style={{ background: dark ? '#334155' : '', color: dark ? '#f1f5f9' : '', borderColor: dark ? '#475569' : '' }}
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={categoryId}
                style={{ background: dark ? '#334155' : '', color: dark ? '#f1f5f9' : '', borderColor: dark ? '#475569' : '' }}
                onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Todas las categorías</option>
                {catalog?.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de productos */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div style={{ borderRadius: 12, overflow: 'hidden', background: dark ? '#1e293b' : 'white', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
                    <div className={styles.skeletonImg} />
                    <div className={styles.skeletonBody}>
                      <div className={styles.skeletonLine} style={{ width: '80%' }} />
                      <div className={styles.skeletonLine} style={{ width: '50%' }} />
                      <div className={styles.skeletonLine} style={{ width: '65%', height: 28, marginTop: 10 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem 1rem',
              background: dark ? '#1e293b' : 'white',
              borderRadius: 16, border: `2px dashed ${dark ? '#334155' : '#e2e8f0'}`,
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🛍️</span>
              <p style={{ fontWeight: 700, color: dark ? '#f1f5f9' : '#334155' }}>
                {search || categoryId ? 'Sin resultados' : 'Todavía no hay productos'}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                {search || categoryId ? 'Intentá con otros términos' : 'Volvé pronto'}
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product, i) => {
                const discountPct = product.comparePrice && Number(product.comparePrice) > Number(product.price)
                  ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100) : 0;

                return (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3"
                    data-aos="fade-up" data-aos-delay={Math.min(i * 50, 300)}>
                    <div
                      onClick={() => openProduct(product)}
                      className={styles.productCard}
                      style={{
                        background: dark ? '#1e293b' : '#ffffff',
                        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                        cursor: 'pointer', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        borderRadius: 12, overflow: 'hidden',
                        boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      {product.isFeatured && (
                        <span className={`badge ${styles.featuredBadge}`}>⭐ Destacado</span>
                      )}
                      <ProductImageCarousel
                        items={product.images.map((img) => ({ url: img.url, resourceType: img.resourceType }))}
                        height={180} autoPlay
                      />
                      <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <p style={{
                          fontWeight: 700, fontSize: '0.88rem', margin: '0 0 2px',
                          color: dark ? '#f1f5f9' : '#1e293b',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{product.name}</p>
                        {product.category && (
                          <small style={{ color: '#94a3b8', fontSize: '0.73rem', marginBottom: '0.4rem', display: 'block' }}>
                            {product.category.name}
                          </small>
                        )}
                        {product.specs?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: '0.5rem' }}>
                            {product.specs.slice(0, 2).map((s, si) => (
                              <span key={si} style={{
                                background: dark ? '#334155' : '#f1f5f9',
                                border: `1px solid ${dark ? '#475569' : '#e2e8f0'}`,
                                borderRadius: 4, fontSize: '0.67rem',
                                color: dark ? '#94a3b8' : '#475569',
                                padding: '1px 5px', whiteSpace: 'nowrap',
                              }}>
                                <span style={{ color: '#64748b' }}>{s.key}:</span> {s.value}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <span style={{ fontWeight: 800, color: primaryColor, fontSize: '1rem' }}>
                              {product.currency} {Number(product.price).toFixed(2)}
                            </span>
                            {product.comparePrice && Number(product.comparePrice) > 0 && (
                              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.78rem' }}>
                                {Number(product.comparePrice).toFixed(2)}
                              </span>
                            )}
                            {discountPct > 0 && (
                              <span style={{ background: '#fef9c3', color: '#a16207', fontSize: '0.65rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4 }}>
                                -{discountPct}%
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm flex-grow-1"
                              style={{ background: primaryColor, color: 'white', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: '0.78rem' }}
                              onClick={() => handleAddToCart(product)}>🛒 Agregar</button>
                            {(product.whatsappNumber || catalog?.whatsappNumber) && (
                              <a href={buildWaLink(
                                  product.whatsappNumber || catalog!.whatsappNumber!,
                                  product.whatsappMessage || `Hola! Me interesa: *${product.name}*`,
                                  product.id,
                                )}
                                target="_blank" rel="noopener noreferrer"
                                className={`btn btn-sm ${styles.btnWa}`}>💬</a>
                            )}
                            {(product.facebookUrl || catalog?.facebookPageUrl) && (
                              <a href={product.facebookUrl || catalog!.facebookPageUrl!}
                                target="_blank" rel="noopener noreferrer"
                                className={`btn btn-sm ${styles.btnFb}`}>📘</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Carrito flotante — LADO DERECHO + WA */}
      <FloatingCart
        slug={slug}
        tenantId={catalog?.id ?? null}
        waPhone={catalog?.whatsappNumber}
      />

      {/* Modal de producto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            catalog={catalog}
            onClose={closeProduct}
            onAddToCart={handleAddToCart}
            buildWaLink={buildWaLink}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
