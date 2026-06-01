'use client';

import { AnimatePresence, motion } from 'framer-motion';
import styles from './settings.module.css';
import { useSettings, SettingsSection } from './useSettings';

const COLOR_PRESETS = [
  '#059669', '#0d6efd', '#7c3aed', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#374151',
];

const TABS: { key: SettingsSection; icon: string; label: string }[] = [
  { key: 'info',       icon: '🏪', label: 'Negocio'    },
  { key: 'contact',    icon: '📱', label: 'Contacto'   },
  { key: 'appearance', icon: '🎨', label: 'Apariencia' },
  { key: 'payment',    icon: '💳', label: 'Pagos'      },
];

export default function SettingsPage() {
  const {
    form, setField, loading, saving, saved,
    isDirty, handleSave, handleDiscard,
    activeSection, setActiveSection,
  } = useSettings();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#10b981' }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>⚙️ Configuración</h2>
      <p className={styles.pageSub}>Personalizá tu tienda y catálogo público</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeSection === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveSection(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >

          {/* ─── INFO DEL NEGOCIO ─────────────────────────────────────────── */}
          {activeSection === 'info' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🏪</span>
                <p className={styles.sectionTitle}>Información del negocio</p>
              </div>
              <div className={styles.sectionBody}>
                <div className="mb-3">
                  <label className={styles.label}>Nombre del negocio *</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Ej: Tienda Don Mario"
                  />
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Descripción</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Describe tu negocio en pocas palabras..."
                  />
                  <p className={styles.hint}>Se muestra en el banner de tu catálogo público</p>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className={styles.label}>Dirección</label>
                    <input
                      className="form-control"
                      value={form.address}
                      onChange={(e) => setField('address', e.target.value)}
                      placeholder="Ej: Av. Blanco Galindo Km 5"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className={styles.label}>Sitio web</label>
                    <input
                      className="form-control"
                      value={form.website}
                      onChange={(e) => setField('website', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── CONTACTO ─────────────────────────────────────────────────── */}
          {activeSection === 'contact' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📱</span>
                <p className={styles.sectionTitle}>Contacto y redes sociales</p>
              </div>
              <div className={styles.sectionBody}>
                <div className="mb-3">
                  <label className={styles.label}>Número de WhatsApp</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#25d366', color: 'white', border: 'none' }}>💬</span>
                    <input
                      className="form-control"
                      value={form.whatsappNumber}
                      onChange={(e) => setField('whatsappNumber', e.target.value)}
                      placeholder="+591 70000000"
                    />
                  </div>
                  <p className={styles.hint}>Formato: +591 seguido del número. Ej: +59170123456</p>
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Mensaje por defecto de WhatsApp</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.whatsappMessage}
                    onChange={(e) => setField('whatsappMessage', e.target.value)}
                    placeholder="Hola! Quiero hacer un pedido..."
                  />
                  <p className={styles.hint}>Se pre-carga cuando el cliente toca el botón de WhatsApp</p>
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Página de Facebook</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#1877f2', color: 'white', border: 'none' }}>📘</span>
                    <input
                      className="form-control"
                      value={form.facebookPageUrl}
                      onChange={(e) => setField('facebookPageUrl', e.target.value)}
                      placeholder="https://facebook.com/tu-pagina"
                    />
                  </div>
                </div>
                <div className="mb-1">
                  <label className={styles.label}>Teléfono de contacto</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="+591 4 4123456"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── APARIENCIA ───────────────────────────────────────────────── */}
          {activeSection === 'appearance' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🎨</span>
                <p className={styles.sectionTitle}>Apariencia del catálogo</p>
              </div>
              <div className={styles.sectionBody}>

                {/* Color primario */}
                <div className="mb-4">
                  <label className={styles.label}>Color primario</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.6rem' }}>
                    Se usa en botones, precios y el hero de tu catálogo
                  </p>
                  <div className={styles.colorRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={form.primaryColor}
                      onChange={(e) => setField('primaryColor', e.target.value)}
                    />
                    <span className={styles.colorHex}>{form.primaryColor.toUpperCase()}</span>
                  </div>
                  <div className={styles.presets}>
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        className={`${styles.preset} ${form.primaryColor === c ? styles.presetActive : ''}`}
                        style={{ background: c }}
                        onClick={() => setField('primaryColor', c)}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Color secundario (hero/fondo oscuro) */}
                <div className="mb-4">
                  <label className={styles.label}>Color oscuro / fondo</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.6rem' }}>
                    Se usa en el navbar y fondos oscuros del catálogo
                  </p>
                  <div className={styles.colorRow}>
                    <input
                      type="color"
                      className={styles.colorInput}
                      value={form.secondaryColor}
                      onChange={(e) => setField('secondaryColor', e.target.value)}
                    />
                    <span className={styles.colorHex}>{form.secondaryColor.toUpperCase()}</span>
                  </div>
                  <div className={styles.presets}>
                    {['#0f172a','#1e293b','#1a1a2e','#0d1b2a','#111827','#18181b','#1c1917','#14532d'].map((c) => (
                      <button
                        key={c}
                        className={`${styles.preset} ${form.secondaryColor === c ? styles.presetActive : ''}`}
                        style={{ background: c }}
                        onClick={() => setField('secondaryColor', c)}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <label className={styles.label}>Vista previa del catálogo</label>
                <div className={styles.preview}>
                  <div className={styles.previewBar} style={{
                    background: `linear-gradient(90deg, ${form.secondaryColor}, ${form.primaryColor})`
                  }}>
                    <div className={styles.previewDot} />
                    <div className={styles.previewDot} />
                    <span className={styles.previewDotTitle}>{form.name || 'Mi Tienda'}</span>
                  </div>
                  <div className={styles.previewBody}>
                    {[1,2,3].map((n) => (
                      <div key={n} className={styles.previewCard}>
                        <div className={styles.previewImg} />
                        <div className={styles.previewCardBody}>
                          <div className={styles.previewCardLine} style={{ width: '80%' }} />
                          <div className={styles.previewCardLine} style={{ width: '50%' }} />
                          <div className={styles.previewBtn} style={{ background: form.primaryColor }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── PAGOS ────────────────────────────────────────────────────── */}
          {activeSection === 'payment' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>💳</span>
                <p className={styles.sectionTitle}>Modo de venta y pagos</p>
              </div>
              <div className={styles.sectionBody}>
                <label className={styles.label}>¿Cómo quieres que paguen tus clientes?</label>
                <div className={styles.modeToggle}>
                  <div
                    className={`${styles.modeOption} ${form.cartMode === 'WHATSAPP' ? styles.modeOptionActive : ''}`}
                    onClick={() => setField('cartMode', 'WHATSAPP')}
                  >
                    <span className={styles.modeIcon}>💬</span>
                    <p className={styles.modeLabel}>Pedido por WhatsApp</p>
                    <p className={styles.modeDesc}>
                      El carrito genera un mensaje de WhatsApp con el detalle del pedido
                    </p>
                  </div>
                  <div
                    className={`${styles.modeOption} ${form.cartMode === 'QR_PAYMENT' ? styles.modeOptionActive : ''}`}
                    onClick={() => setField('cartMode', 'QR_PAYMENT')}
                  >
                    <span className={styles.modeIcon}>🏦</span>
                    <p className={styles.modeLabel}>Pago QR Bolivia</p>
                    <p className={styles.modeDesc}>
                      El cliente escanea tu QR bancario y sube el comprobante de pago
                    </p>
                  </div>
                </div>

                {form.cartMode === 'QR_PAYMENT' && (
                  <div className="mt-3">
                    <label className={styles.label}>Instrucciones de pago</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.paymentInstructions}
                      onChange={(e) => setField('paymentInstructions', e.target.value)}
                      placeholder="Ej: Escaneá el QR con cualquier app bancaria boliviana y pagá el monto exacto del pedido."
                    />
                    <p className={styles.hint}>
                      Se muestra al cliente durante el checkout. El QR de tu banco se sube desde la sección de pedidos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Barra de acciones */}
      <div className={styles.actions}>
        {saved && (
          <span className={styles.savedMsg}>✅ Cambios guardados</span>
        )}
        {isDirty && !saved && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            <span className={styles.dirtyDot} />
            Tenés cambios sin guardar
          </span>
        )}
        <div className="ms-auto d-flex gap-2">
          {isDirty && (
            <button
              className="btn btn-sm"
              style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}
              onClick={handleDiscard}
              disabled={saving}
            >
              Descartar
            </button>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || !isDirty}
            style={{ minWidth: 110 }}
          >
            {saving
              ? <><span className="spinner-border spinner-border-sm me-1" /> Guardando...</>
              : '💾 Guardar cambios'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
