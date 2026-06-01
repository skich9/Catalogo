'use client';

import Link from 'next/link';
import styles from './dashboard.module.css';
import { useDashboard, STAT_CARDS, getPlanStatusClass, getPlanStatusLabel } from './useDashboard';

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
          className={styles.catalogBtn}
        >
          <span className={styles.catalogBtnIcon}>🛍️</span>
          <div>
            <span className={styles.catalogBtnLabel}>Ver mi catálogo</span>
            <span className={styles.catalogBtnSub}>/{user.tenant.slug}</span>
          </div>
          <span className={styles.catalogBtnArrow}>→</span>
        </a>
      </div>

      {/* Banner del plan */}
      {user.tenant.subscription && (
        <div className={styles.planBanner}>
          <div className={styles.planBannerLeft}>
            <span className={styles.planIcon}>💎</span>
            <div>
              <p className={styles.planText}>
                Plan <strong>{user.tenant.subscription.plan}</strong>
                <span className={`${styles.planStatusBadge} ${styles[getPlanStatusClass(user.tenant.subscription.status)]}`}>
                  {getPlanStatusLabel(user.tenant.subscription.status)}
                </span>
              </p>
              <p className={styles.planSub}>
                {user.tenant.subscription.maxProducts} productos · {user.tenant.subscription.maxEmployees} empleado(s)
              </p>
            </div>
          </div>
          <Link href="/settings" className={styles.planBtn}>
            Gestionar plan →
          </Link>
        </div>
      )}

      {/* Estadísticas */}
      <div className="row g-3 mb-2">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="col-md-4">
            <Link href={card.link} className={styles.statCard}>
              <div className={styles.statInner}>
                <div className={styles.statAccent} style={{ background: card.accent }} />
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
            <Link href="/orders" className={`btn btn-sm ${styles.actionBtn}`}>
              Ver pedidos
            </Link>
            <Link href="/settings" className={`btn btn-sm ${styles.actionBtn}`}>
              ⚙️ Configuración
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
