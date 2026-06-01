'use client';

import { AnimatePresence, motion } from 'framer-motion';
import styles from './settings.module.css';
import { useSettings, SettingsSection, FONT_OPTIONS } from './useSettings';

const COLOR_PRESETS = [
  '#059669', '#0d6efd', '#7c3aed', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#374151',
];
const DARK_PRESETS = [
  '#0f172a', '#1e293b', '#1a1a2e', '#0d1b2a',
  '#111827', '#18181b', '#1c1917', '#14532d',
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
    logoUploading, logoInputRef, handleLogoUpload, removeLogo,
    currentFont,
  } = useSettings();

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#10b981' }} /></div>;
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>⚙️ Configuración</h2>
      <p className={styles.pageSub}>Personalizá tu tienda y catálogo público</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button key={tab.key}
            className={`${styles.tab} ${activeSection === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveSection(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSection}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>

          {/* ─── INFO DEL NEGOCIO ─────────────────────────────────────── */}
          {activeSection === 'info' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🏪</span>
                <p className={styles.sectionTitle}>Información del negocio</p>
              </div>
              <div className={styles.sectionBody}>
                <div className="mb-3">
                  <label className={styles.label}>Nombre del negocio *</label>
                  <input className="form-control" placeholder="Ej: Mi Tienda Bolivia"
                    value={form.name} onChange={(e) => setField('name', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Descripción</label>
                  <textarea className="form-control" rows={3}
                    placeholder="Describí tu negocio en pocas palabras..."
                    value={form.description} onChange={(e) => setField('description', e.target.value)} />
                  <p className={styles.hint}>Se muestra en el banner de tu catálogo</p>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className={styles.label}>Dirección</label>
                    <input className="form-control" placeholder="Ej: Av. Blanco Galindo Km 5"
                      value={form.address} onChange={(e) => setField('address', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className={styles.label}>Sitio web</label>
                    <input className="form-control" placeholder="https://..."
                      value={form.website} onChange={(e) => setField('website', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── CONTACTO ─────────────────────────────────────────────── */}
          {activeSection === 'contact' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📱</span>
                <p className={styles.sectionTitle}>Contacto y redes sociales</p>
              </div>
              <div className={styles.sectionBody}>
                <div className="mb-3">
                  <label className={styles.label}>WhatsApp</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#25d366', color: 'white', border: 'none' }}>💬</span>
                    <input className="form-control" placeholder="+591 70000000"
                      value={form.whatsappNumber} onChange={(e) => setField('whatsappNumber', e.target.value)} />
                  </div>
                  <p className={styles.hint}>Formato: +591 seguido del número</p>
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Mensaje por defecto de WhatsApp</label>
                  <textarea className="form-control" rows={2}
                    placeholder="Hola! Quiero hacer un pedido..."
                    value={form.whatsappMessage} onChange={(e) => setField('whatsappMessage', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Facebook</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#1877f2', color: 'white', border: 'none' }}>📘</span>
                    <input className="form-control" placeholder="https://facebook.com/tu-pagina"
                      value={form.facebookPageUrl} onChange={(e) => setField('facebookPageUrl', e.target.value)} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={styles.label}>Instagram</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white', border: 'none' }}>📸</span>
                    <input className="form-control" placeholder="https://instagram.com/tu-perfil"
                      value={form.instagramUrl} onChange={(e) => setField('instagramUrl', e.target.value)} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={styles.label}>TikTok</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: '#010101', color: 'white', border: 'none', fontSize: '1rem' }}>🎵</span>
                    <input className="form-control" placeholder="https://tiktok.com/@tu-usuario"
                      value={form.tiktokUrl} onChange={(e) => setField('tiktokUrl', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={styles.label}>Teléfono de contacto</label>
                  <input className="form-control" placeholder="+591 4 4123456"
                    value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ─── APARIENCIA ───────────────────────────────────────────── */}
          {activeSection === 'appearance' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🎨</span>
                <p className={styles.sectionTitle}>Apariencia del catálogo</p>
              </div>
              <div className={styles.sectionBody}>

                {/* Logo */}
                <div className="mb-4">
                  <label className={styles.label}>Logo del negocio</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.75rem' }}>
                    Se muestra en el header de tu catálogo público
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {form.logoUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img src={form.logoUrl} alt="Logo" style={{
                          width: 80, height: 80, borderRadius: 12, objectFit: 'cover',
                          border: '2px solid var(--dash-border, #e2e8f0)',
                        }} />
                        <button onClick={removeLogo} style={{
                          position: 'absolute', top: -8, right: -8,
                          background: '#ef4444', color: 'white', border: 'none',
                          borderRadius: '50%', width: 22, height: 22,
                          fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>✕</button>
                      </div>
                    ) : (
                      <div style={{
                        width: 80, height: 80, borderRadius: 12,
                        background: 'var(--dash-hover, #f1f5f9)',
                        border: '2px dashed var(--dash-border, #e2e8f0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.8rem',
                      }}>🏪</div>
                    )}
                    <div>
                      <input ref={logoInputRef} type="file" accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={logoUploading}
                      >
                        {logoUploading ? <><span className="spinner-border spinner-border-sm me-1" />Subiendo...</> : '📤 Subir logo'}
                      </button>
                      <p className={styles.hint} style={{ marginBottom: 0 }}>JPG, PNG, WebP — máx. 5 MB</p>
                    </div>
                  </div>
                </div>

                {/* Tipo de letra */}
                <div className="mb-4">
                  <label className={styles.label}>Tipografía del catálogo</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.75rem' }}>
                    Se aplica a todos los textos de tu catálogo público
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setField('fontFamily', font.id)}
                        style={{
                          fontFamily: font.family,
                          border: `2px solid ${form.fontFamily === font.id ? '#059669' : 'var(--dash-border, #e2e8f0)'}`,
                          background: form.fontFamily === font.id ? 'rgba(5,150,105,0.08)' : 'var(--dash-card, #fff)',
                          borderRadius: 10, padding: '0.75rem 0.5rem',
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 4,
                        }}
                      >
                        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: form.fontFamily === font.id ? '#059669' : 'var(--dash-text, #1e293b)' }}>
                          Aa
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dash-text-muted, #94a3b8)' }}>
                          {font.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color primario */}
                <div className="mb-4">
                  <label className={styles.label}>Color primario</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.6rem' }}>
                    Se usa en botones, precios y el hero
                  </p>
                  <div className={styles.colorRow}>
                    <input type="color" className={styles.colorInput}
                      value={form.primaryColor} onChange={(e) => setField('primaryColor', e.target.value)} />
                    <span className={styles.colorHex}>{form.primaryColor.toUpperCase()}</span>
                  </div>
                  <div className={styles.presets}>
                    {COLOR_PRESETS.map((c) => (
                      <button key={c}
                        className={`${styles.preset} ${form.primaryColor === c ? styles.presetActive : ''}`}
                        style={{ background: c }}
                        onClick={() => setField('primaryColor', c)} title={c} />
                    ))}
                  </div>
                </div>

                {/* Color oscuro */}
                <div className="mb-4">
                  <label className={styles.label}>Color oscuro / fondo</label>
                  <p className={styles.hint} style={{ marginTop: 0, marginBottom: '0.6rem' }}>
                    Se usa en el navbar y fondos oscuros
                  </p>
                  <div className={styles.colorRow}>
                    <input type="color" className={styles.colorInput}
                      value={form.secondaryColor} onChange={(e) => setField('secondaryColor', e.target.value)} />
                    <span className={styles.colorHex}>{form.secondaryColor.toUpperCase()}</span>
                  </div>
                  <div className={styles.presets}>
                    {DARK_PRESETS.map((c) => (
                      <button key={c}
                        className={`${styles.preset} ${form.secondaryColor === c ? styles.presetActive : ''}`}
                        style={{ background: c }}
                        onClick={() => setField('secondaryColor', c)} title={c} />
                    ))}
                  </div>
                </div>

                {/* Vista previa */}
                <label className={styles.label}>Vista previa del catálogo</label>
                <div className={styles.preview} style={{ fontFamily: currentFont.family }}>
                  <div className={styles.previewBar} style={{
                    background: `linear-gradient(90deg, ${form.secondaryColor}, ${form.primaryColor})`
                  }}>
                    {form.logoUrl && (
                      <img src={form.logoUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover', marginRight: 4 }} />
                    )}
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

          {/* ─── PAGOS ────────────────────────────────────────────────── */}
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
                    <p className={styles.modeDesc}>El carrito genera un mensaje con el detalle</p>
                  </div>
                  <div
                    className={`${styles.modeOption} ${form.cartMode === 'QR_PAYMENT' ? styles.modeOptionActive : ''}`}
                    onClick={() => setField('cartMode', 'QR_PAYMENT')}
                  >
                    <span className={styles.modeIcon}>🏦</span>
                    <p className={styles.modeLabel}>Pago QR Bolivia</p>
                    <p className={styles.modeDesc}>El cliente escanea tu QR bancario y sube el comprobante</p>
                  </div>
                </div>
                {form.cartMode === 'QR_PAYMENT' && (
                  <div className="mt-3">
                    <label className={styles.label}>Instrucciones de pago</label>
                    <textarea className="form-control" rows={3}
                      placeholder="Ej: Escaneá el QR con cualquier app bancaria boliviana..."
                      value={form.paymentInstructions}
                      onChange={(e) => setField('paymentInstructions', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Barra de acciones */}
      <div className={styles.actions}>
        {saved && <span className={styles.savedMsg}>✅ Cambios guardados</span>}
        {isDirty && !saved && (
          <span style={{ fontSize: '0.82rem', color: 'var(--dash-text-muted, #94a3b8)' }}>
            <span className={styles.dirtyDot} />Tenés cambios sin guardar
          </span>
        )}
        <div className="ms-auto d-flex gap-2">
          {isDirty && (
            <button className="btn btn-sm"
              style={{ background: 'var(--dash-hover, #f1f5f9)', color: 'var(--dash-text-muted, #64748b)', border: '1px solid var(--dash-border, #e2e8f0)' }}
              onClick={handleDiscard} disabled={saving}>
              Descartar
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSave}
            disabled={saving || !isDirty} style={{ minWidth: 130 }}>
            {saving ? <><span className="spinner-border spinner-border-sm me-1" />Guardando...</> : '💾 Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
