'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './orders.module.css';
import { useOrders } from './useOrders';

const DAY_OPTIONS = [7, 14, 30, 90];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Pendiente',  cls: styles.statusPending   },
  CONFIRMED: { label: 'Confirmado', cls: styles.statusConfirmed },
  PAID:      { label: 'Pagado',     cls: styles.statusPaid      },
  SHIPPED:   { label: 'Enviado',    cls: styles.statusShipped   },
  COMPLETED: { label: 'Completado', cls: styles.statusPaid      },
  CANCELED:  { label: 'Cancelado',  cls: styles.statusCanceled  },
};

const MEDAL = ['🥇', '🥈', '🥉', '4°', '5°'];

export default function OrdersPage() {
  const {
    tab, setTab,
    orders, ranking,
    summary, days, setDays,
    loading, maxClicks,
    bestProducts, worstProducts,
    statusFilter, setStatusFilter,
  } = useOrders();

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>📊 Pedidos e Interés</h2>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'ranking' ? styles.tabActive : ''}`}
          onClick={() => setTab('ranking')}
        >
          📈 Interés por producto
        </button>
        <button
          className={`${styles.tab} ${tab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setTab('orders')}
        >
          🛒 Pedidos recibidos
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#10b981' }} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >

            {/* ─── TAB: RANKING DE INTERÉS ─────────────────────────────── */}
            {tab === 'ranking' && (
              <>
                {/* Filtro de días */}
                <div className={styles.dayFilter}>
                  <span className={styles.dayLabel}>Período:</span>
                  {DAY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      className={`${styles.dayBtn} ${days === d ? styles.dayBtnActive : ''}`}
                      onClick={() => setDays(d)}
                    >
                      {d} días
                    </button>
                  ))}
                </div>

                {/* Summary cards */}
                <div className={styles.summaryGrid}>
                  {[
                    { icon: '💬', label: 'Clicks WhatsApp', value: summary.waClicks, color: '#25d366' },
                    { icon: '📦', label: 'Clicks totales', value: summary.totalClicks, color: '#059669' },
                    { icon: '🛒', label: 'Pedidos totales', value: summary.totalOrders, color: '#0d6efd' },
                    { icon: '⏳', label: 'Pedidos pendientes', value: summary.pendingOrders, color: '#f59e0b' },
                    { icon: '✅', label: 'Productos activos', value: summary.activeProducts, color: '#10b981' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      className={styles.summaryCard}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <span className={styles.summaryIcon}>{s.icon}</span>
                      <div className={styles.summaryValue} style={{ color: s.color }}>{s.value}</div>
                      <div className={styles.summaryLabel}>{s.label}</div>
                    </motion.div>
                  ))}
                </div>

                {ranking.length === 0 ? (
                  <div className={styles.noDataCard}>
                    <span className={styles.noDataIcon}>📊</span>
                    <p style={{ fontWeight: 700, color: '#334155' }}>Sin datos de interés aún</p>
                    <p style={{ fontSize: '0.85rem' }}>
                      Los datos se registran cuando los clientes hacen click en los botones
                      de WhatsApp o agregan productos al carrito en tu catálogo público.
                    </p>
                  </div>
                ) : (
                  <div className={styles.rankingSection}>
                    {/* MEJORES */}
                    <div className={styles.rankCard}>
                      <div className={`${styles.rankCardHeader} ${styles.rankHeaderBest}`}>
                        <p className={styles.rankHeaderTitle}>🏆 Mayor interés — Top {bestProducts.length}</p>
                      </div>
                      <div className={styles.rankList}>
                        {bestProducts.map((item, i) => (
                          <motion.div
                            key={item.productId}
                            className={styles.rankItem}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                          >
                            <span className={`${styles.rankPos} ${styles.rankPosBest}`}>
                              {MEDAL[i]}
                            </span>
                            {item.imageUrl
                              ? <img src={item.imageUrl} className={styles.rankImg} alt="" />
                              : <div className={styles.rankImgPlaceholder}>📦</div>
                            }
                            <div className={styles.rankInfo}>
                              <p className={styles.rankName}>{item.productName}</p>
                              <div className={styles.rankBarWrap}>
                                <div
                                  className={styles.rankBarFill}
                                  style={{
                                    width: `${Math.round((item.clicks / maxClicks) * 100)}%`,
                                    background: 'linear-gradient(90deg,#059669,#10b981)',
                                  }}
                                />
                              </div>
                              <p className={styles.rankClicks}>
                                <span className={styles.rankClicksNum}>{item.clicks}</span> clicks
                                {item.waClicks > 0 && <> · 💬 {item.waClicks} WA</>}
                                {item.cartClicks > 0 && <> · 🛒 {item.cartClicks}</>}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* PEORES */}
                    <div className={styles.rankCard}>
                      <div className={`${styles.rankCardHeader} ${styles.rankHeaderWorst}`}>
                        <p className={styles.rankHeaderTitle}>📉 Menor interés — Últimos {worstProducts.length}</p>
                      </div>
                      <div className={styles.rankList}>
                        {worstProducts.map((item, i) => (
                          <motion.div
                            key={item.productId}
                            className={styles.rankItem}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                          >
                            <span className={`${styles.rankPos} ${styles.rankPosWorst}`}>
                              {ranking.length - i}°
                            </span>
                            {item.imageUrl
                              ? <img src={item.imageUrl} className={styles.rankImg} alt="" />
                              : <div className={styles.rankImgPlaceholder}>📦</div>
                            }
                            <div className={styles.rankInfo}>
                              <p className={styles.rankName}>{item.productName}</p>
                              <div className={styles.rankBarWrap}>
                                <div
                                  className={styles.rankBarFill}
                                  style={{
                                    width: `${Math.max(Math.round((item.clicks / maxClicks) * 100), 4)}%`,
                                    background: '#94a3b8',
                                  }}
                                />
                              </div>
                              <p className={styles.rankClicks}>
                                <span style={{ color: '#94a3b8', fontWeight: 700 }}>{item.clicks}</span> clicks
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ─── TAB: PEDIDOS ────────────────────────────────────────── */}
            {tab === 'orders' && (
              <>
                {/* Filtro estado */}
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {[
                    { v: '', l: 'Todos' },
                    { v: 'PENDING', l: '⏳ Pendientes' },
                    { v: 'PAID', l: '✅ Pagados' },
                    { v: 'CANCELED', l: '❌ Cancelados' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      className="btn btn-sm"
                      style={{
                        borderRadius: 7, fontWeight: 600, fontSize: '0.78rem',
                        background: statusFilter === opt.v ? '#059669' : '#f1f5f9',
                        color:      statusFilter === opt.v ? 'white'   : '#64748b',
                        border:     statusFilter === opt.v ? 'none'    : '1px solid #e2e8f0',
                      }}
                      onClick={() => setStatusFilter(opt.v)}
                    >{opt.l}</button>
                  ))}
                </div>

                {orders.length === 0 ? (
                  <div className={styles.noDataCard}>
                    <span className={styles.noDataIcon}>🛒</span>
                    <p style={{ fontWeight: 700, color: '#334155' }}>No hay pedidos todavía</p>
                    <p style={{ fontSize: '0.85rem' }}>
                      Los pedidos aparecen aquí cuando los clientes completan el proceso de compra en tu catálogo.
                    </p>
                  </div>
                ) : (
                  <div className={styles.ordersTable}>
                    <div className={styles.tableHeader}>
                      <p className={styles.tableTitle}>Lista de pedidos ({orders.length})</p>
                    </div>
                    <div className={`${styles.orderRow} ${styles.orderHeaderRow}`}>
                      <span>Número</span>
                      <span>Cliente</span>
                      <span>Total</span>
                      <span>Estado</span>
                      <span>Fecha</span>
                    </div>
                    {orders.map((order, i) => {
                      const s = STATUS_MAP[order.status] || { label: order.status, cls: '' };
                      return (
                        <motion.div
                          key={order.id}
                          className={styles.orderRow}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <span className={styles.orderNum}>#{order.orderNumber}</span>
                          <span className={styles.orderCustomer}>
                            {order.customerName || 'Cliente anónimo'}
                            {order.customerPhone && (
                              <small style={{ display: 'block', color: '#94a3b8' }}>{order.customerPhone}</small>
                            )}
                          </span>
                          <span className={styles.orderAmount}>
                            {order.currency} {Number(order.total).toFixed(2)}
                          </span>
                          <span>
                            <span className={`${styles.statusBadge} ${s.cls}`}>{s.label}</span>
                            {order.payment?.proofUrl && (
                              <small style={{ display: 'block', color: '#94a3b8', marginTop: 2 }}>
                                📎 Comprobante subido
                              </small>
                            )}
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            {new Date(order.createdAt).toLocaleDateString('es-BO', {
                              day: '2-digit', month: 'short', year: '2-digit',
                            })}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
