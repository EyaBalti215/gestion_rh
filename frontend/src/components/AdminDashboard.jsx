import React from 'react';
import '../components/AdminDashboard.css';

const sidebarItems = [
  { label: 'Tableau de bord', icon: '📊', active: true },
  { label: 'Employés & RH', icon: '👥' },
  { label: 'Inscriptions', icon: '📝', badge: '3' },
  { label: 'Pointage', icon: '⏱️' },
  { label: 'Congés & Absences', icon: '🏖️' },
  { label: 'Paie & Salaires', icon: '💰' },
  { label: 'Services & Factures', icon: '📄' },
  { label: 'Fournisseurs', icon: '🏢' },
  { label: 'Finance & Rapports', icon: '📈' },
  { label: 'Notifications', icon: '🔔', badge: '4' },
];

const cards = [
  { label: 'Employés actifs', value: '6', detail: '1 en congé', icon: '👤', color: 'purple', trend: '0%' },
  { label: 'Masse salariale', value: '25 290 DA', detail: 'Masse salariale', icon: '€', color: 'blue', trend: '↘ 2%' },
  { label: 'Recettes Juin', value: '63 500 DA', detail: 'Recettes Juin', icon: '📈', color: 'green', trend: '↗ 11%' },
  { label: 'Résultat net', value: '34 130 DA', detail: 'Résultat net', icon: '📊', color: 'violet', trend: '↗ 8%' },
];

export default function AdminDashboard({ adminName, onLogout }) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="brand-sidebar">
          <div className="brand-logo">HR</div>
          <div className="brand-text">
            <strong>HRFlow</strong>
            <span>Administration</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button key={item.label} className={`sidebar-link${item.active ? ' active' : ''}`}>
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-row">
            <div className="avatar-circle">A</div>
            <div>
              <div className="sidebar-user">Admin Système</div>
              <div className="sidebar-user-role">Super Admin</div>
            </div>
          </div>
          <button className="logout-small" onClick={onLogout}>Déconnexion</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="search" placeholder="Rechercher..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-button">
              🔔
              <span className="badge">4</span>
            </button>
            <div className="user-badge">AD</div>
          </div>
        </header>

        <section className="admin-header">
          <h1>Tableau de bord</h1>
        </section>

        <section className="dashboard-cards">
          {cards.map((card) => (
            <article key={card.label} className="metric-card">
              <div className={`metric-icon ${card.color}`}>{card.icon}</div>
              <div className="metric-content">
                <div className="metric-top">
                  <p>{card.label}</p>
                  <span className="metric-trend">{card.trend}</span>
                </div>
                <strong>{card.value}</strong>
                <span className="metric-detail">{card.detail}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboard-panels">
          <div className="panel chart-panel">
            <div className="panel-header">
              <h2>Évolution financière — 6 mois</h2>
              <span>Juin</span>
            </div>
            <div className="chart-placeholder">Graphique ligne ici</div>
          </div>

          <div className="panel donut-panel">
            <div className="panel-header">
              <h2>Répartition Juin</h2>
            </div>
            <div className="donut-grid">
              <div className="donut-circle" />
              <div className="donut-legend">
                <div><span className="legend-dot purple" /> Masse salariale <strong>25 290 DA</strong></div>
                <div><span className="legend-dot blue" /> Services & IT <strong>974 DA</strong></div>
                <div><span className="legend-dot yellow" /> Charges courantes <strong>3 106 DA</strong></div>
                <div><span className="legend-dot green" /> Résultat net <strong>34 130 DA</strong></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
