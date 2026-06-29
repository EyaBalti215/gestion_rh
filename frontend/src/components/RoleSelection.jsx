import React from 'react';
import './RoleSelection.css';

export default function RoleSelection({ onAdminClick, onEmployeeClick, onCancel }) {
  return (
    <div className="role-selection-root">
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>Bienvenue sur HRFlow</h1>
          <p>Sélectionnez votre profil pour accéder à la plateforme</p>
        </div>

        <div className="role-cards">
          {/* ADMIN CARD */}
          <div className="role-card admin-card" onClick={onAdminClick}>
            <div className="role-icon">🔐</div>
            <h2>Administrateur</h2>
            <p>Gestion complète des employés et des validations</p>
            <ul className="role-features">
              <li>✓ Valider les inscriptions</li>
              <li>✓ Gérer les employés</li>
              <li>✓ Accès aux rapports</li>
            </ul>
            <button className="role-btn">Connexion Admin</button>
          </div>

          {/* EMPLOYEE CARD */}
          <div className="role-card employee-card" onClick={onEmployeeClick}>
            <div className="role-icon">👤</div>
            <h2>Employé</h2>
            <p>Accès à votre espace personnel et professionnel</p>
            <ul className="role-features">
              <li>✓ Consulter mon profil</li>
              <li>✓ Demander des congés</li>
              <li>✓ Voir mes bulletins</li>
            </ul>
            <button className="role-btn">Connexion Employé</button>
          </div>
        </div>

        <button className="role-cancel" onClick={onCancel}>
          ← Retour
        </button>
      </div>
    </div>
  );
}
