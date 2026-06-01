'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './catalog.module.css';
import { useCatalog } from './useCatalog';
import { FloatingCart } from './FloatingCart';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductModal } from '@/components/ProductModal/ProductModal';

export default function CatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    catalog, products,
    search, setSearch,
    categoryId, setCategoryId,
    loading, cartNotif,
    selectedProduct, openProduct, closeProduct,
    handleAddToCart, buildWaLink,
  } = useCatalog(slug);

  if (!catalog && !loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2>Catálogo no encontrado</h2>
          <p className="text-muted">El negocio no existe o está inactivo.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark sticky-top" style={{
        background: `linear-gradient(90deg, ${catalog?.secondaryColor || '#0f172a'}, #1e293b)`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <div className="container">
          <span className="navbar-brand fw-bold">{catalog?.name || '...'}</span>
        </div>
      </nav>

      {/* Notificación carrito */}
      <AnimatePresence>
        {cartNotif && (
          <motion.div
            className={styles.cartNotif}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {cartNotif}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className={styles.hero} style={{
        background: `linear-gradient(145deg, ${catalog?.secondaryColor || '#0f172a'} 0%, #1e293b 40%, ${catalog?.primaryColor || '#047857'} 100%)`,
      }}>
        <div className="container">
          {catalog?.logoUrl && (
            <img src={catalog.logoUrl} alt={catalog.name} className={styles.heroLogo} />
          )}
          <h1 className={`${styles.heroTitle} animate__animated animate__fadeInDown`}>
            {catalog?.name || '...'}
          </h1>
          {catalog?.description && (
            <p className={styles.heroDesc}>{catalog.description}</p>
          )}
          <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
            {catalog?.whatsappNumber && (
              <a
                href={buildWaLink(catalog.whatsappNumber, catalog.whatsappMessage)}
                target="_blank" rel="noopener noreferrer"
                className={`btn ${styles.btnWa}`}
              >💬 WhatsApp</a>
            )}
            {catalog?.facebookPageUrl && (
              <a
                href={catalog.facebookPageUrl}
                target="_blank" rel="noopener noreferrer"
                className={`btn ${styles.btnFb}`}
              >📘 Facebook</a>
            )}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className={styles.filterBar}>
        <div className="container">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={categoryId}
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
      <section className={styles.grid}>
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className={styles.skeleton}>
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
            <div className="row">
              <div className="col-12">
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🛍️</span>
                  <p className={styles.emptyTitle}>
                    {search || categoryId ? 'Sin resultados' : 'Todavía no hay productos disponibles'}
                  </p>
                  <p className={styles.emptyText}>
                    {search || categoryId ? 'Intentá con otros términos' : 'Volvé pronto'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product, i) => {
                const discountPct = product.comparePrice && Number(product.comparePrice) > Number(product.price)
                  ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
                  : 0;

                return (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3"
                    data-aos="fade-up" data-aos-delay={Math.min(i * 50, 300)}>
                    <div
                      className={`card h-100 position-relative ${styles.productCard}`}
                      onClick={() => openProduct(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.isFeatured && (
                        <span className={`badge ${styles.featuredBadge}`}>⭐ Destacado</span>
                      )}

                      {/* Carrusel de imágenes con transición */}
                      <ProductImageCarousel
                        items={product.images.map((img) => ({
                          url: img.url,
                          resourceType: img.resourceType,
                        }))}
                        height={180}
                        autoPlay={true}
                      />

                      <div className="card-body d-flex flex-column p-3">
                        <p className={styles.productName}>{product.name}</p>
                        {product.category && (
                          <small className={styles.productCategory}>{product.category.name}</small>
                        )}

                        {/* Specs */}
                        {product.specs?.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {product.specs.slice(0, 2).map((s, si) => (
                              <span key={si} style={{
                                background: '#f1f5f9', border: '1px solid #e2e8f0',
                                borderRadius: 4, fontSize: '0.68rem', color: '#475569',
                                padding: '1px 5px', whiteSpace: 'nowrap',
                              }}>
                                <span style={{ color: '#94a3b8' }}>{s.key}:</span> {s.value}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto">
                          {/* Precio */}
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className={styles.price} style={{ color: catalog?.primaryColor || '#059669' }}>
                              {product.currency} {Number(product.price).toFixed(2)}
                            </span>
                            {product.comparePrice && Number(product.comparePrice) > 0 && (
                              <span className={styles.comparePrice}>
                                {Number(product.comparePrice).toFixed(2)}
                              </span>
                            )}
                            {discountPct > 0 && (
                              <span style={{
                                background: '#fef9c3', color: '#a16207',
                                fontSize: '0.65rem', fontWeight: 700,
                                padding: '1px 5px', borderRadius: 4,
                              }}>-{discountPct}%</span>
                            )}
                          </div>

                          {/* Botones — stopPropagation para no abrir el modal */}
                          <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-primary btn-sm flex-grow-1"
                              style={{ background: catalog?.primaryColor, borderColor: catalog?.primaryColor }}
                              onClick={() => handleAddToCart(product)}
                            >
                              🛒 Agregar
                            </button>
                            {(product.whatsappNumber || catalog?.whatsappNumber) && (
                              <a
                                href={buildWaLink(
                                  product.whatsappNumber || catalog!.whatsappNumber!,
                                  product.whatsappMessage || `Hola! Me interesa: *${product.name}*`,
                                  product.id,
                                )}
                                target="_blank" rel="noopener noreferrer"
                                className={`btn btn-sm ${styles.btnWa}`}
                              >💬</a>
                            )}
                            {(product.facebookUrl || catalog?.facebookPageUrl) && (
                              <a
                                href={product.facebookUrl || catalog!.facebookPageUrl!}
                                target="_blank" rel="noopener noreferrer"
                                className={`btn btn-sm ${styles.btnFb}`}
                              >📘</a>
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

      {/* Carrito flotante */}
      <FloatingCart slug={slug} tenantId={catalog?.id ?? null} />

      {/* Modal de producto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            catalog={catalog}
            onClose={closeProduct}
            onAddToCart={(p) => { handleAddToCart(p); }}
            buildWaLink={buildWaLink}
          />
        )}
      </AnimatePresence>
    </>
  );
}
