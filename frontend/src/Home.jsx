import React from 'react';

export default function Home() {
  return (
    <div className="home-root">
      <header className="hero">
        <div className="hero-left">
          <span className="badge">Système de gestion intégré v2.0</span>
          <h1>
            Gérez votre
            <br />
            <span className="accent">équipe & finances</span>
            <br />
            en un seul outil
          </h1>
          <p className="lead">
            HRFlow centralise la gestion RH, le suivi des présences, la paie
            et les flux financiers de votre structure dans une interface claire
            et professionnelle.
          </p>

          <div className="cta-row">
            <button className="btn primary">Accéder à l'application</button>
            <button className="btn ghost">Créer un compte employé</button>
          </div>

          <p className="small">6+ employés gérés dès aujourd'hui</p>
        </div>

        <aside className="hero-right">
          <div className="dashboard-mock">
            <div className="dash-row">
              <div className="dash-card">6<br/><span>Employés actifs</span></div>
              <div className="dash-card">25 290 DA<br/><span>Masse salariale</span></div>
            </div>
            <div className="dash-row">
              <div className="dash-card green">63 500 DA<br/><span>Recettes Juin</span></div>
              <div className="dash-card violet">34 130 DA<br/><span>Résultat net</span></div>
            </div>
          </div>
        </aside>
      </header>

      <section className="metrics">
        <div className="metric">100%<div className="metric-sub">Automatisation de la paie</div></div>
        <div className="metric">6+<div className="metric-sub">Modules intégrés</div></div>
        <div className="metric">2<div className="metric-sub">Profils utilisateurs</div></div>
        <div className="metric">∞<div className="metric-sub">Employés gérés</div></div>
      </section>

      <section className="features">
        <h2>Tout ce dont vous avez besoin</h2>
        <p className="muted">Une solution complète, modulaire et sécurisée pour gérer votre structure de A à Z.</p>

        <div className="cards-grid">
          <div className="feature-card">
            <div className="icon purple">👥</div>
            <h3>Gestion RH complète</h3>
            <p>Fiches employés, contrats, profils détaillés et gestion des permissions par rôle.</p>
          </div>
          <div className="feature-card">
            <div className="icon blue">⏱️</div>
            <h3>Pointage en temps réel</h3>
            <p>Enregistrement horodaté des entrées/sorties, suivi des présences et heures supplémentaires.</p>
          </div>
          <div className="feature-card">
            <div className="icon green">📅</div>
            <h3>Gestion des congés</h3>
            <p>Soumission de demandes, workflow de validation et décompte automatique des soldes.</p>
          </div>
          <div className="feature-card">
            <div className="icon violet">💳</div>
            <h3>Calcul automatique des salaires</h3>
            <p>Génération mensuelle des bulletins avec heures supplémentaires et déductions.</p>
          </div>
          <div className="feature-card">
            <div className="icon cyan">🗂️</div>
            <h3>Services & Factures</h3>
            <p>Suivi des prestations web, hébergement, licences et gestion des factures associées.</p>
          </div>
          <div className="feature-card">
            <div className="icon orange">📊</div>
            <h3>Bilan financier mensuel</h3>
            <p>Calcul automatique du résultat net : Recettes – Salaires – Services – Charges.</p>
          </div>
        </div>
      </section>

      <section className="how">
        <h2>Comment ça marche ?</h2>
        <p className="muted">Un flux de travail clair et efficace, du recrutement à la clôture mensuelle.</p>

        <div className="steps">
          <div className="step"><div className="step-num">01</div><h4>Inscription de l'employé</h4><p>L'employé soumet sa demande via le formulaire dédié.</p></div>
          <div className="step"><div className="step-num">02</div><h4>Validation par l'Admin</h4><p>L'administrateur examine le dossier et valide ou refuse.</p></div>
          <div className="step"><div className="step-num">03</div><h4>Accès à l'espace</h4><p>Le compte est activé. L'employé accède à son espace.</p></div>
          <div className="step"><div className="step-num">04</div><h4>Clôture mensuelle</h4><p>L'admin calcule la paie et génère les ordres de paiement.</p></div>
        </div>
      </section>

      <section className="profiles">
        <h2>Deux espaces dédiés</h2>
        <p className="muted">Une expérience adaptée à chaque profil utilisateur.</p>

        <div className="profile-row">
          <div className="profile admin">
            <div className="profile-inner">
              <h3>Administrateur</h3>
              <ul>
                <li>Gestion complète des employés</li>
                <li>Validation des inscriptions & congés</li>
                <li>Clôture mensuelle de la paie</li>
                <li>Rapports financiers & bilan mensuel</li>
              </ul>
              <button className="btn white">Connexion Admin</button>
            </div>
          </div>

          <div className="profile employee">
            <div className="profile-inner">
              <h3>Employé</h3>
              <ul>
                <li>Pointage virtuel (entrée/sortie)</li>
                <li>Soumission de demandes de congé</li>
                <li>Consultation des bulletins de paie</li>
                <li>Suivi du solde de congés</li>
              </ul>
              <div className="profile-actions">
                <button className="btn outline">Connexion</button>
                <button className="btn dark">S'inscrire</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="cta-footer">
        <h3>Prêt à simplifier votre gestion ?</h3>
        <p className="muted">Démarrez dès maintenant avec HRFlow et automatisez vos processus RH et financiers.</p>
        <div className="cta-row centered">
          <button className="btn primary large">Accéder à l'application</button>
          <button className="btn ghost large">Créer un compte</button>
        </div>
      </footer>
    </div>
  );
}
