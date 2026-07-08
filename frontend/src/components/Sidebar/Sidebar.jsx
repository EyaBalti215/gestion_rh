import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { token, user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink to={PATHS.HOME} className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}>
          Accueil
        </NavLink>
        <NavLink to={PATHS.LOGIN} className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}>
          Connexion
        </NavLink>
        {token && (
          <NavLink to={PATHS.DASHBOARD} className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}>
            Dashboard
          </NavLink>
        )}
      </nav>

      {token && (
        <div className={styles.profile}>
          <div className={styles.avatar}>{(user?.prenom?.[0] || 'U').toUpperCase()}</div>
          <div>
            <div className={styles.name}>{user?.prenom || 'Utilisateur'} {user?.nom || ''}</div>
            <div className={styles.role}>{user?.role || 'Connecté'}</div>
          </div>
        </div>
      )}
    </aside>
  );
}