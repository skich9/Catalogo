'use client';

import Link from 'next/link';
import styles from './landing.module.css';
import { useLanding, FEATURES, PLANS } from './useLanding';

export default function LandingPage() {
  const { scrolled } = useLanding();

  return (
    <>
      {/* Navbar flotante */}
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <Link href="/" className={styles.logo}>
          CatálogoSaaS
        </Link>
        <Link href="/login" className={styles.btnLogin}>
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={`${styles.heroTag} animate__animated animate__fadeIn`}>
            🇧🇴 Hecho para Bolivia
          </span>
          <h1 className={`${styles.heroTitle} animate__animated animate__fadeInDown`}>
            Tu catálogo online<br />
            <span>en minutos</span>
          </h1>
          <p className={`${styles.heroSub} animate__animated animate__fadeIn`}
            style={{ animationDelay: '0.2s' }}>
            Sube tus productos, comparte por WhatsApp y<br />
            recibe pedidos con pago QR boliviano.
          </p>
          <Link
            href="/register"
            className={`${styles.btnCta} animate__animated animate__fadeInUp`}
            style={{ animationDelay: '0.35s' }}
          >
            Empezar gratis →
          </Link>
          <p className={styles.heroNote}>Sin tarjeta • 14 días gratis • Cancelá cuando quieras</p>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Todo lo que necesitás</h2>
          <p className={styles.sectionSub}>Una plataforma completa para vender más</p>
          <div className="row g-4">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>{feat.icon}</span>
                  <p className={styles.featureTitle}>{feat.title}</p>
                  <p className={styles.featureText}>{feat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className="container">
          <h2 className={styles.sectionTitle} data-aos="fade-up">Planes simples</h2>
          <p className={styles.sectionSub} data-aos="fade-up">Empezá gratis, escalá cuando crezcas</p>
          <div className="row g-4 justify-content-center">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className="col-md-4"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className={`${styles.planCard} ${plan.featured ? styles.planCardFeatured : ''}`}>
                  <div className={`${styles.planHeader} ${plan.featured ? styles.planHeaderFeatured : ''}`}>
                    {plan.featured && <span className={styles.planBadge}>Más popular</span>}
                    <p className={`${styles.planName} ${plan.featured ? styles.planNameFeatured : ''}`}>
                      {plan.name}
                    </p>
                  </div>
                  <div className={styles.planBody}>
                    <p className={styles.planPrice}>{plan.price}</p>
                    <p className={styles.planPriceSub}>{plan.sub}</p>
                    <div className="text-start">
                      <p className={styles.planFeature}>{plan.products} productos</p>
                      <p className={styles.planFeature}>{plan.employees} empleado(s)</p>
                      <p className={styles.planFeature}>WhatsApp + Facebook</p>
                      <p className={styles.planFeature}>Pago QR Bolivia</p>
                    </div>
                    <Link
                      href="/register"
                      className={`${styles.btnPlan} ${plan.featured ? styles.btnPlanFeatured : ''}`}
                    >
                      Comenzar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()}{' '}
          <span className={styles.footerEm}>CatálogoSaaS</span>{' '}
          — Hecho con ❤️ para Bolivia
        </p>
      </footer>
    </>
  );
}
