'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { useDashboard } from './useDashboard';

const STAT_CARDS = [
  { label: 'Productos', key: 'products', icon: '📦', link: '/products', accent: '#10b981' },
  { label: 'Pedidos totales', key: 'orders', icon: '📋', link: '/orders', accent: '#059669' },
  { label: 'Pagos pendientes', key: 'pendingPayments', icon: '⏳', link: '/orders', accent: '#f59e0b' },
] as const;

export default function DashboardPage() {
  const { user, stats } = useDashboard();

  if (!user) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" style={{ color: '#10b981' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.greeting}>Hola, {user.firstName} 👋</h2>
          <p className={styles.tenantName}>{user.tenant.name}</p>
        </div>
        <a
          href={`/catalog/${user.tenant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-primary"
        >
          🔗 Ver catálogo
        </a>
      </div>

      {/* Estadísticas */}
      <div className="row g-3">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="col-md-4">
            <Link href={card.link} className={styles.statCard}>
              <div className={styles.statInner}>
                <div
                  className={styles.statAccent}
                  style={{ background: card.accent }}
                />
                <span className={styles.statIcon}>{card.icon}</span>
                <div>
                  <p className={styles.statLabel}>{card.label}</p>
                  <h3 className={styles.statValue}>{stats[card.key]}</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className={styles.actionsSection}>
        <div className={styles.actionsCard}>
          <div className={styles.actionsHeader}>Acciones rápidas</div>
          <div className={styles.actionsBody}>
            <Link href="/products/new" className="btn btn-primary btn-sm">
              + Nuevo producto
            </Link>
            <Link href="/orders" className="btn btn-sm"
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
              Ver pedidos
            </Link>
            <Link href="/settings" className="btn btn-sm"
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
              ⚙️ Configuración
            </Link>
          </div>
        </div>
      </div>

      {/* Plan */}
      {user.tenant.subscription && (
        <div className={styles.planBanner}>
          <p className={styles.planText}>
            Plan <strong>{user.tenant.subscription.plan}</strong>{' '}
            · {user.tenant.subscription.status}
          </p>
          <Link href="/settings/billing"
            className="btn btn-sm"
            style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 8 }}>
            Gestionar plan
          </Link>
        </div>
      )}
    </div>
  );
}
