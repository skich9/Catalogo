'use client';

import Link from 'next/link';
import styles from './register.module.css';
import { useRegister } from './useRegister';

export default function RegisterPage() {
  const { form, error, loading, setField, handleBusinessName, handleSubmit } = useRegister();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={`${styles.title} animate__animated animate__fadeInDown`}>
          Creá tu catálogo
        </h2>
        <p className={styles.subtitle}>14 días gratis, sin tarjeta</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={styles.label}>Nombre del negocio</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Tienda Don Mario"
              value={form.businessName}
              onChange={(e) => handleBusinessName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className={styles.label}>URL del catálogo</label>
            <div className="input-group">
              <span className={`input-group-text ${styles.urlPrefix}`}>catalogo.com/</span>
              <input
                type="text"
                className="form-control"
                value={form.businessSlug}
                onChange={(e) => setField('businessSlug', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col">
              <label className={styles.label}>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                required
              />
            </div>
            <div className="col">
              <label className={styles.label}>Apellido</label>
              <input
                type="text"
                className="form-control"
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className={styles.label}>WhatsApp (opcional)</label>
            <input
              type="tel"
              className="form-control"
              placeholder="+591 7..."
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            Crear mi catálogo
          </button>
        </form>

        <hr className="my-3" />
        <p className={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-primary fw-semibold">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
