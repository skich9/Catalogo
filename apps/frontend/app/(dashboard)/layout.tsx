'use client';

import Link from 'next/link';
import styles from './dashboard.layout.module.css';
import { NAV_ITEMS, useDashboardLayout } from './useDashboardLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initializing, pathname, handleLogout, dark, toggleDark } = useDashboardLayout();

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div className="spinner-border" style={{ color: '#10b981' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.shell} data-theme={dark ? 'dark' : 'light'}>

      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`${styles.sidebar} d-none d-md-flex flex-column`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>CatálogoSaaS</div>
          <p className={styles.businessName}>{user.tenant.name}</p>
          <small className={styles.userName}>{user.firstName} {user.lastName}</small>
          <br />
          <span className={styles.roleBadge}>{user.role}</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          {user.role === 'SUPER_ADMIN' && (
            <Link href="/admin"
              className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.navLinkActive : ''}`}>
              <span>👑</span>SuperAdmin
            </Link>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href={`/catalog/${user.tenant.slug}`} target="_blank" rel="noopener noreferrer"
            className={styles.catalogLink}>
            🔗 Ver mi catálogo público
          </a>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDark}
            className={styles.darkToggle}
            title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className={styles.darkToggleIcon}>{dark ? '☀️' : '🌙'}</span>
            <span>{dark ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ─── Contenido principal ─────────────────────────────────────────── */}
      <main className={`${styles.main} ${dark ? styles.mainDark : ''}`}>

        {/* Barra superior — "Ver catálogo" en todas las páginas */}
        <div className={styles.topBar}>
          <p className={styles.topBarTitle}>
            {user.tenant.name}
          </p>
          <a
            href={`/catalog/${user.tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.topBarCatalogBtn}
          >
            <span>🛍️</span>
            <span>Ver catálogo</span>
            <span className={styles.topBarSlug}>/{user.tenant.slug}</span>
            <span>↗</span>
          </a>
        </div>

        <div className={styles.pageContent}>
          {children}
        </div>
      </main>

    </div>
  );
}
