'use client';

import Link from 'next/link';
import styles from './dashboard.layout.module.css';
import { NAV_ITEMS, useDashboardLayout } from './useDashboardLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initializing, pathname, handleLogout } = useDashboardLayout();

  // Solo muestra spinner en la carga inicial, no en cada navegación
  if (initializing) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: '#0f172a' }}>
        <div className="spinner-border" style={{ color: '#10b981' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} d-none d-md-flex flex-column`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>CatálogoSaaS</div>
          <p className={styles.businessName}>{user.tenant.name}</p>
          <small className={styles.userName}>
            {user.firstName} {user.lastName}
          </small>
          <br />
          <span className={styles.roleBadge}>{user.role}</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {user.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin"
              className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.navLinkActive : ''}`}
            >
              <span>👑</span> SuperAdmin
            </Link>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href={`/catalog/${user.tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.catalogLink}
          >
            🔗 Ver mi catálogo público
          </a>
          <button
            className="btn btn-sm w-100"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
