'use client';

import Link from 'next/link';
import styles from './login.module.css';
import { useLogin } from './useLogin';

export default function LoginPage() {
  const { form, error, loading, setField, handleSubmit } = useLogin();

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} animate__animated animate__fadeInUp`}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>CatálogoSaaS</span>
        </div>

        <h2 className={styles.title}>Bienvenido de vuelta</h2>
        <p className={styles.subtitle}>Ingresá a tu catálogo</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            Iniciar sesión
          </button>
        </form>

        <div className={styles.divider}>o</div>
        <p className={styles.footer}>
          ¿No tenés cuenta?{' '}
          <Link href="/register" className="fw-semibold" style={{ color: '#059669' }}>
            Registrá tu negocio gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
