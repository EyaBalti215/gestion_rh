import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import ForgotPassword from './components/ForgotPassword';
import NewPassword from './components/NewPassword';
import OtpVerification from './components/OtpVerification';
import './Login.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const IS_DEV = import.meta.env.DEV;

function LoginForm({ role, onCancel, onForgotPassword, onSubmit }) {
  const [email, setEmail] = useState(role === 'admin' ? 'admin@hrflow.local' : '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = role === 'admin';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez saisir votre e-mail et votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/employees/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          motDePasse: password,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || 'Identifiants invalides.');
        if (IS_DEV) {
          onSubmit({
            userData: {
              role: isAdmin ? 'ADMIN' : 'EMPLOYE',
              prenom: isAdmin ? 'Admin' : 'Démo',
              nom: isAdmin ? 'Système' : 'Utilisateur',
              email: email.trim().toLowerCase(),
            },
            email: email.trim().toLowerCase(),
          });
        }
        return;
      }

      const userData = {
        role: data.role === 'ADMIN' ? 'ADMIN' : 'EMPLOYE',
        id: data.employeeId ?? data.id,
        employeeId: data.employeeId ?? data.id,
        prenom: data.prenom || (data.role === 'ADMIN' ? 'Admin' : ''),
        nom: data.nom || (data.role === 'ADMIN' ? 'Système' : ''),
        email: data.email || email.trim().toLowerCase(),
      };

      try {
        await fetch(`${API_BASE}/password/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
      } catch {
        // Le flux continue même si l'envoi OTP échoue.
      }

      onSubmit({ userData, email: email.trim().toLowerCase() });
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
      if (IS_DEV) {
        onSubmit({
          userData: {
            role: isAdmin ? 'ADMIN' : 'EMPLOYE',
            id: 1,
            employeeId: 1,
            prenom: isAdmin ? 'Admin' : 'Démo',
            nom: isAdmin ? 'Système' : 'Utilisateur',
            email: email.trim().toLowerCase(),
          },
          email: email.trim().toLowerCase(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-panel login-panel-left">
        <div className="left-content">
          <div className="brand-icon">🏢</div>
          <div className="brand-copy">
            <div className="brand-title">HRFlow</div>
            <p className="brand-subtitle">Système de gestion RH et financière centralisé.</p>
          </div>
        </div>
      </section>

      <section className="login-panel login-panel-right">
        <div className="login-card">
          <div className="login-card-head">
            <h2>{isAdmin ? '🔐 Administrateur' : 'Bon retour 👋'}</h2>
            <p className="login-card-subtitle">Connectez-vous à votre espace de gestion.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label htmlFor="email" className="login-label">Adresse e-mail</label>
              <div className="input-wrapper">
                <input id="email" type="email" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isAdmin ? 'admin@hrflow.local' : 'vous@entreprise.com'} autoComplete="username" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="login-label">Mot de passe</label>
              <div className="input-wrapper">
                <input id="password" type="password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </div>
            </div>

            <div className="login-options">
              <button type="button" className="link-button" onClick={() => onForgotPassword(email)}>Mot de passe oublié ?</button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-buttons">
              <button type="submit" className="login-submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
              <button type="button" className="login-home" onClick={onCancel} disabled={loading}>← Retour à l'accueil</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const role = location.state?.role === 'admin' ? 'admin' : 'employee';

  const [view, setView] = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  const handleLoginSuccess = ({ userData, email }) => {
    setPendingUser(userData);
    setOtpEmail(email || userData.email || '');
    setView('otp-login');
  };

  const handleForgotPassword = (prefillEmail) => {
    setOtpEmail(prefillEmail || '');
    setView('forgot');
  };

  const handleOtpSent = (email) => {
    setOtpEmail(email);
    setView('otp-forgot');
  };

  const handleLoginOtpVerified = () => {
    login(pendingUser);
    navigate(PATHS.DASHBOARD, { replace: true });
  };

  const handleForgotOtpVerified = () => {
    setView('new-password');
  };

  const handlePasswordReset = () => {
    setView('login');
  };

  if (view === 'forgot') {
    return (
      <ForgotPassword
        onBack={() => setView('login')}
        onOtpSent={handleOtpSent}
      />
    );
  }

  if (view === 'otp-login') {
    return (
      <OtpVerification
        email={otpEmail}
        onBack={() => setView('login')}
        onVerified={handleLoginOtpVerified}
      />
    );
  }

  if (view === 'otp-forgot') {
    return (
      <OtpVerification
        email={otpEmail}
        onBack={() => setView('forgot')}
        onVerified={handleForgotOtpVerified}
      />
    );
  }

  if (view === 'new-password') {
    return (
      <NewPassword
        email={otpEmail}
        onBack={() => setView('login')}
        onSuccess={handlePasswordReset}
      />
    );
  }

  return (
    <LoginForm
      role={role}
      onCancel={() => navigate(PATHS.HOME)}
      onForgotPassword={handleForgotPassword}
      onSubmit={handleLoginSuccess}
    />
  );
}