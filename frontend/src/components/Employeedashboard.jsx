import React, { useState } from 'react';
import './Employeedashboard.css';
import MesConges from './MesConges';

const sidebarItems = [
  { key: 'dashboard', label: 'Mon tableau de bord', icon: '📊', active: true },
  { key: 'profil',    label: 'Mon profil',           icon: '👤' },
  { key: 'pointage',  label: 'Mon pointage',         icon: '⏱️' },
  { key: 'conges',    label: 'Mes congés',           icon: '🏖️' },
  { key: 'bulletins', label: 'Mes bulletins de paie',icon: '💰' },
  { key: 'notifs',    label: 'Notifications',        icon: '🔔', badge: '1' },
];

export default function EmployeeDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const pageTitle = sidebarItems.find(i => i.key === activePage)?.label || 'Mon tableau de bord';
  const initials  = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase();

  return (
    <div className="emp-app">

      {/* ── Sidebar ── */}
      <aside className="emp-sidebar">
        <div className="emp-brand">
          <div className="emp-brand-logo">HR</div>
          <div className="emp-brand-text">
            <strong>HRFlow</strong>
            <span>Espace Employé</span>
          </div>
        </div>

        <nav className="emp-nav">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`emp-nav-link${activePage === item.key ? ' active' : ''}`}
              onClick={() => setActivePage(item.key)}
            >
              <span className="emp-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="emp-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="emp-sidebar-footer">
          <div className="emp-user-row">
            <div className="emp-avatar">{initials}</div>
            <div>
              <div className="emp-user-name">{user?.prenom} {user?.nom}</div>
              <div className="emp-user-role">Employé</div>
            </div>
          </div>
          <button className="emp-logout" onClick={onLogout}>Déconnexion</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="emp-main">
        <header className="emp-topbar">
          <div className="emp-search">
            <span>🔍</span>
            <input type="search" placeholder="Rechercher..." />
          </div>
          <div className="emp-topbar-right">
            <button className="emp-icon-btn">🔔<span className="emp-badge-top">1</span></button>
            <div className="emp-user-badge">{initials}</div>
          </div>
        </header>

        <section className="emp-page-header">
          <h1>{pageTitle}</h1>
        </section>

        {(() => {
          switch (activePage) {
            case 'dashboard':
              return (
                <>
                  {/* Carte de bienvenue */}
                  <div className="emp-welcome-card">
                    <div className="emp-welcome-left">
                      <div className="emp-welcome-avatar">{initials}</div>
                      <div>
                        <h2>Bienvenue, {user?.prenom} {user?.nom} 👋</h2>
                        <p>Votre compte a été validé. Voici votre espace personnel.</p>
                      </div>
                    </div>
                    <div className="emp-welcome-badge">
                      <span>✅</span> Compte actif
                    </div>
                  </div>

                  {/* Cartes stats */}
                  <div className="emp-cards">
                    <div className="emp-card">
                      <div className="emp-card-icon blue">⏱️</div>
                      <div>
                        <p className="emp-card-label">Jours travaillés</p>
                        <strong className="emp-card-value">18</strong>
                        <span className="emp-card-detail">ce mois</span>
                      </div>
                    </div>
                    <div className="emp-card">
                      <div className="emp-card-icon green">🏖️</div>
                      <div>
                        <p className="emp-card-label">Congés restants</p>
                        <strong className="emp-card-value">12</strong>
                        <span className="emp-card-detail">jours</span>
                      </div>
                    </div>
                    <div className="emp-card">
                      <div className="emp-card-icon purple">💰</div>
                      <div>
                        <p className="emp-card-label">Dernier salaire</p>
                        <strong className="emp-card-value">—</strong>
                        <span className="emp-card-detail">En attente</span>
                      </div>
                    </div>
                    <div className="emp-card">
                      <div className="emp-card-icon orange">📄</div>
                      <div>
                        <p className="emp-card-label">Bulletins disponibles</p>
                        <strong className="emp-card-value">0</strong>
                        <span className="emp-card-detail">documents</span>
                      </div>
                    </div>
                  </div>

                  {/* Info compte */}
                  <div className="emp-info-panel">
                    <h3>📋 Informations de mon compte</h3>
                    <div className="emp-info-grid">
                      <div className="emp-info-row"><span>E-mail</span><strong>{user?.email}</strong></div>
                      <div className="emp-info-row"><span>Rôle</span><strong>Employé</strong></div>
                      <div className="emp-info-row"><span>Statut</span><strong style={{ color: '#16a34a' }}>✅ Validé</strong></div>
                    </div>
                  </div>
                </>
              );
            case 'conges':
              return <MesConges employeeId={user?.id || user?.employeeId} />;
            default:
              return (
                <div className="emp-placeholder">
                  Section « {pageTitle} » — en cours de développement
                </div>
              );
          }
        })()}
      </main>
    </div>
  );
}