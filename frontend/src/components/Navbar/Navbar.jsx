import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
  };

  return (
    <header className={styles.navbar}>
      <Link to={PATHS.HOME} className={styles.brand}>
        <span className={styles.logo}>HR</span>
        <span>HRFlow</span>
      </Link>

      <div className={styles.actions}>
        <Link to={PATHS.HOME} className={styles.link}>Accueil</Link>
        {token ? (
          <button type="button" className={styles.button} onClick={handleLogout}>
            Déconnexion
          </button>
        ) : (
          <Link to={PATHS.LOGIN} className={styles.buttonLink}>Connexion</Link>
        )}
      </div>
    </header>
  );
}