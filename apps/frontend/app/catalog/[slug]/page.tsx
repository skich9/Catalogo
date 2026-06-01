'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './catalog.module.css';
import { useCatalog } from './useCatalog';
import { FloatingCart } from './FloatingCart';

export default function CatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    catalog, products, search, setSearch, categoryId, setCategoryId,
    loading, cartNotif, handleAddToCart, buildWaLink,
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
      {/* Navbar — solo logo y nombre */}
      <nav className="navbar navbar-dark sticky-top" style={{
        background: 'linear-gradient(90deg, #0f172a, #1e293b)',
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
      <section className={styles.hero}>
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
              >
                💬 WhatsApp
              </a>
            )}
            {catalog?.facebookPageUrl && (
              <a
                href={catalog.facebookPageUrl}
                target="_blank" rel="noopener noreferrer"
                className={`btn ${styles.btnFb}`}
              >
                📘 Facebook
              </a>
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
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
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
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#10b981' }} />
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>No hay productos disponibles.</div>
          ) : (
            <div className="row g-4">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="col-6 col-md-4 col-lg-3"
                  data-aos="fade-up"
                  data-aos-delay={Math.min(i * 50, 300)}
                >
                  <div className={`card h-100 position-relative ${styles.productCard}`}>
                    {product.isFeatured && (
                      <span className={`badge ${styles.featuredBadge}`}>⭐ Destacado</span>
                    )}
                    <img
                      src={product.images[0]?.url || '/placeholder.png'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className="card-body d-flex flex-column p-3">
                      <p className={styles.productName}>{product.name}</p>
                      {product.category && (
                        <small className={styles.productCategory}>{product.category.name}</small>
                      )}
                      <div className="mt-auto">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={styles.price}>
                            {product.currency} {Number(product.price).toFixed(2)}
                          </span>
                          {product.comparePrice && (
                            <span className={styles.comparePrice}>
                              {Number(product.comparePrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-primary btn-sm flex-grow-1"
                            onClick={() => handleAddToCart(product)}
                          >
                            + Agregar
                          </button>
                          {(product.whatsappNumber || catalog?.whatsappNumber) && (
                            <a
                              href={buildWaLink(
                                product.whatsappNumber || catalog!.whatsappNumber!,
                                product.whatsappMessage ||
                                  `Hola, me interesa: *${product.name}* — ${product.currency} ${Number(product.price).toFixed(2)}`,
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carrito flotante — bottom-left */}
      <FloatingCart slug={slug} tenantId={catalog?.id ?? null} />
    </>
  );
}
