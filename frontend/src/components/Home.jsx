import React from 'react';
import './Home.css';

export default function Home({ onAdminLogin, onEmployeeLogin, onEmployeeRegister }) {
  return (
    <div className="home-root">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <div className="navbar-logo">🏢</div>
          <span>HRFlow</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#features">Fonctionnalités</a></li>
          <li><a href="#how">Comment ça marche</a></li>
          <li><a href="#metrics">Chiffres clés</a></li>
        </ul>
        <div className="navbar-actions">
          <button className="link" type="button" onClick={onEmployeeRegister}>Créer un compte</button>
          <button className="btn-connect" type="button" onClick={onEmployeeLogin}>Se connecter</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="hero-left">
          <span className="badge">Système de gestion intégré v2.0</span>
          <h1>
            Gérez votre<br />
            <span className="accent-purple">équipe</span> &amp; <span className="accent-blue">finances</span><br />
            en un seul outil
          </h1>
          <p className="lead">
            HRFlow centralise la gestion RH, le suivi des présences, la paie
            et les flux financiers de votre structure dans une interface claire
            et professionnelle.
          </p>
          <div className="cta-row">
            <button className="btn-primary" type="button" onClick={onEmployeeLogin}>Accéder à l'application &nbsp;›</button>
            <button className="btn-ghost" type="button" onClick={onEmployeeRegister}>
              <span>👤</span> Créer un compte employé
            </button>
          </div>
          <div className="hero-avatars">
            <div className="avatar-stack">
              <div className="avatar a1">KB</div>
              <div className="avatar a2">SH</div>
              <div className="avatar a3">OM</div>
              <div className="avatar a4">LY</div>
            </div>
            <span className="hero-small"><strong>6+ employés</strong> gérés dès aujourd'hui</span>
          </div>
        </div>

        <aside className="hero-right">
          <div className="dashboard-mock">
            <div className="dash-badge-float">✦ Clôture automatique</div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
              <div>
                <div className="dash-title">Tableau de bord</div>
                <div className="dash-subtitle">Juin 2026</div>
              </div>
              <div className="dash-dots">
                <div className="dot red" />
                <div className="dot yellow" />
                <div className="dot green" />
              </div>
            </div>

            <div className="dash-grid">
              <div className="dash-card">
                <div className="dash-icon indigo">👥</div>
                <div>
                  <div className="dash-val">6</div>
                  <div className="dash-lbl">Employés actifs</div>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-icon blue-c">€</div>
                <div>
                  <div className="dash-val">25 290 TND</div>
                  <div className="dash-lbl">Masse salariale</div>
                </div>
              </div>
              <div className="dash-card green-bg">
                <div className="dash-icon green-c">📈</div>
                <div>
                  <div className="dash-val">63 500 TND</div>
                  <div className="dash-lbl">Recettes Juin</div>
                </div>
              </div>
              <div className="dash-card violet-bg">
                <div className="dash-icon violet-c">📊</div>
                <div>
                  <div className="dash-val">34 130 TND</div>
                  <div className="dash-lbl">Résultat net</div>
                </div>
              </div>
            </div>

            <div className="dash-chart-label">Évolution financière</div>
            <svg className="chart-svg" viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 50 L60 42 L120 35 L180 28 L240 20 L300 14 L360 8 L400 5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M0 50 L60 42 L120 35 L180 28 L240 20 L300 14 L360 8 L400 5 L400 60 L0 60 Z" fill="url(#chartGrad)"/>
            </svg>
            <div className="dash-chart-months">
              {['J','F','M','A','M','J'].map(m => <span key={m}>{m}</span>)}
            </div>

            <div className="dash-pending">
              ⏳ &nbsp;En attente de validation
            </div>
          </div>
        </aside>
      </header>

      {/* ── METRICS ── */}
      <section className="metrics" id="metrics">
        <div className="metric">
          <div className="metric-val">100%</div>
          <div className="metric-sub">Automatisation de la paie</div>
        </div>
        <div className="metric">
          <div className="metric-val">6+</div>
          <div className="metric-sub">Modules intégrés</div>
        </div>
        <div className="metric">
          <div className="metric-val">2</div>
          <div className="metric-sub">Profils utilisateurs</div>
        </div>
        <div className="metric">
          <div className="metric-val">∞</div>
          <div className="metric-sub">Employés gérés</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <span className="section-eyebrow">Modules disponibles</span>
        <h2>Tout ce dont vous avez besoin</h2>
        <p className="section-muted">
          Une solution complète, modulaire et sécurisée pour gérer votre structure de A à Z.
        </p>
        <div className="cards-grid">
          <div className="feature-card">
            <div className="feat-icon purple">👥</div>
            <h3>Gestion RH complète</h3>
            <p>Fiches employés, contrats, profils détaillés et gestion des permissions par rôle.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon blue">🕐</div>
            <h3>Pointage en temps réel</h3>
            <p>Enregistrement horodaté des entrées/sorties, suivi des présences et heures supplémentaires.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon green">📅</div>
            <h3>Gestion des congés</h3>
            <p>Soumission de demandes, workflow de validation et décompte automatique des soldes.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon violet2">💳</div>
            <h3>Calcul automatique des salaires</h3>
            <p>Génération mensuelle des bulletins avec heures supplémentaires et déductions.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon cyan">🗂️</div>
            <h3>Services &amp; Factures</h3>
            <p>Suivi des prestations web, hébergement, licences et gestion des factures associées.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon orange">📊</div>
            <h3>Bilan financier mensuel</h3>
            <p>Calcul automatique du résultat net : Recettes – Salaires – Services – Charges.</p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <span className="section-eyebrow">Processus simplifié</span>
        <h2>Comment ça marche ?</h2>
        <p className="section-muted">
          Un flux de travail clair et efficace, du recrutement à la clôture mensuelle.
        </p>
        <div className="steps-wrapper">
          <div className="steps">
            <div className="step">
              <div className="step-num s1">01</div>
              <h4>Inscription de l'employé</h4>
              <p>L'employé soumet sa demande avec ses informations professionnelles via le formulaire dédié.</p>
            </div>
            <div className="step">
              <div className="step-num s2">02</div>
              <h4>Validation par l'Admin</h4>
              <p>L'administrateur examine le dossier, valide ou refuse l'inscription en un clic.</p>
            </div>
            <div className="step">
              <div className="step-num s3">03</div>
              <h4>Accès à l'espace</h4>
              <p>Le compte est activé. L'employé accède à son espace : pointage, congés, bulletins de paie.</p>
            </div>
            <div className="step">
              <div className="step-num s4">04</div>
              <h4>Clôture mensuelle</h4>
              <p>En fin de mois, l'admin calcule automatiquement le bilan financier et génère les ordres de paiement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFILES ── */}
      <section className="profiles">
        <h2>Deux espaces dédiés</h2>
        <p className="section-muted">Une expérience adaptée à chaque profil utilisateur.</p>

        <div className="profile-row">
          {/* Admin */}
          <div className="profile-admin">
            <div className="profile-icon-wrap">🛡️</div>
            <h3>Administrateur</h3>
            <p className="profile-desc">
              Accès complet à tous les modules. Pilotage RH, financier et organisationnel.
            </p>
            <ul className="profile-list">
              {[
                'Gestion complète des employés',
                'Validation des inscriptions & congés',
                'Clôture mensuelle de la paie',
                'Rapports financiers & bilan mensuel',
                'Gestion des fournisseurs & factures',
              ].map(item => (
                <li key={item}>
                  <span className="check-icon white-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
           <button
  className="btn-admin-connect"
  type="button"
  onClick={onAdminLogin}
>
  Connexion Admin &nbsp;›
</button>
          </div>

          {/* Employee */}
          <div className="profile-employee">
            <div className="profile-icon-wrap light">👤</div>
            <h3>Employé</h3>
            <p className="profile-desc">
              Espace personnel pour le suivi quotidien de votre activité et de vos droits.
            </p>
            <ul className="profile-list">
              {[
                'Pointage virtuel (entrée/sortie)',
                'Soumission de demandes de congé',
                'Consultation des bulletins de paie',
                'Suivi du solde de congés',
                'Consultation & édition du profil',
              ].map(item => (
                <li key={item}>
                  <span className="check-icon green-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="profile-actions">
             <button
  className="btn-outline"
  type="button"
  onClick={onEmployeeLogin}
>
  Connexion
</button>
            <button
  className="btn-dark"
  type="button"
  onClick={onEmployeeRegister}
>
  S'inscrire
</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="cta-footer">
        <div className="cta-footer-icon">🏢</div>
        <h3>Prêt à simplifier votre gestion ?</h3>
        <p className="section-muted">
          Démarrez dès maintenant avec HRFlow et automatisez vos processus RH et financiers.
        </p>
        <div className="cta-row">
       <button
  className="btn-primary"
  type="button"
  onClick={onEmployeeLogin}
>
  Accéder à l'application &nbsp;›
</button>
        <button
  className="btn-ghost"
  type="button"
  onClick={onEmployeeRegister}
>
  <span>👤</span> Créer un compte
</button>
        </div>
      </section>

      {/* ── SITE FOOTER ── */}
      <footer className="site-footer">
        <div className="site-footer-brand">
          <div className="navbar-logo">🏢</div>
          <span>HRFlow</span>
          <span className="site-footer-version"></span>
        </div>
        <div className="site-footer-copy">
          © 2026 HRFlow — Système de Gestion Intégré RH &amp; Finances. Tous droits réservés.
        </div>
        <div className="site-footer-links">
          <a href="#">Connexion</a>
          <a href="#">Inscription</a>
        </div>
      </footer>

    </div>
  );
}