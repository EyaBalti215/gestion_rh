import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const demoUsers = {
  admin: {
    label: ' Admin',
    email: 'admin@hrflow.local',
    password: 'admin123',
  },
  employee: {
    label: ' Employé',
    email: 'employe@hrflow.local',
    password: 'employe123',
  },
};

const OTP_LENGTH     = 6;
const RESEND_SECONDS = 30;

// ─────────────────────────────────────────────────────────────
// VUE 1 : CONNEXION
// ─────────────────────────────────────────────────────────────
function ViewLogin({ onCancel, onRegisterClick, onForgotPassword, onCredentialsOk }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail]               = useState(demoUsers.admin.email);
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    setEmail(demoUsers[selectedRole].email);
    setPassword('');
    setError('');
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError("Veuillez renseigner l'e-mail et le mot de passe.");
      return;
    }

    // Vérification des identifiants
    if (normalizedEmail !== demoUsers.admin.email || password !== demoUsers.admin.password) {
      setError("Identifiants invalides ou accès réservé à l'administrateur.");
      return;
    }

    // Identifiants corrects → envoyer OTP puis afficher la page de vérification
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await res.json();
      if (data.success) {
        // Passer à la vue OTP avec les infos de l'utilisateur
        onCredentialsOk({ role: 'admin', name: 'Admin Système', email: normalizedEmail });
      } else {
        setError(data.message || "Impossible d'envoyer le code de vérification.");
      }
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
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
            <p className="brand-subtitle">
              Système de gestion intégré des ressources humaines et des flux financiers
            </p>
          </div>
          <div className="left-features">
            <div className="feature-item"><span className="feature-icon">👥</span>Gestion complète des employés</div>
            <div className="feature-item"><span className="feature-icon">⏱️</span>Suivi des présences en temps réel</div>
            <div className="feature-item"><span className="feature-icon">📊</span>Analyses financières automatisées</div>
          </div>
        </div>
      </section>

      <section className="login-panel login-panel-right">
        <div className="login-card">
          <div className="login-card-head">
            <h2>Bon retour <span aria-hidden="true">👋</span></h2>
            <p className="login-card-subtitle">Connectez-vous à votre espace de gestion</p>
          </div>

          <div className="role-tabs">
            {Object.entries(demoUsers).map(([key, user]) => (
              <button
                key={key}
                type="button"
                className={key === selectedRole ? 'role-tab active' : 'role-tab'}
                onClick={() => setSelectedRole(key)}
              >
                {user.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label htmlFor="email" className="login-label">
                Adresse e-mail <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="vous@entreprise.dz"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="login-label">
                Mot de passe <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="login-options">
              <button
                type="button"
                className="link-button"
                onClick={() => onForgotPassword(email)}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-buttons">
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <span className="fp-spinner-row">
                    <span className="fp-spinner" /> Envoi du code…
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
              <button type="button" className="login-home" onClick={onCancel} disabled={loading}>
                ← Retour à l'accueil
              </button>
            </div>
          </form>

          <div className="login-footer">
            <button type="button" className="link-button" onClick={onRegisterClick}>
              Créer un compte employé
            </button>
          </div>

          <div className="login-copy">HRFlow — © 2026 Tous droits réservés</div>
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// VUE 2 : MOT DE PASSE OUBLIÉ
// ─────────────────────────────────────────────────────────────
function ViewForgotPassword({ prefillEmail, onBack, onOtpSent }) {
  const [email, setEmail]     = useState(prefillEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (data.success) {
        onOtpSent(email.trim().toLowerCase());
      } else {
        setError(data.message || "Impossible d'envoyer le code.");
      }
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fp-shell">
      <div className="fp-card">

        <button className="fp-back-link" type="button" onClick={onBack}>
          <span className="fp-back-chevron">‹</span> Retour à la connexion
        </button>

        <div className="fp-icon-wrap">
          <span className="fp-icon">🔒</span>
        </div>

        <h1 className="fp-title">Mot de passe oublié <span aria-hidden="true">🔑</span></h1>
        <p className="fp-subtitle">
          Saisissez votre adresse e-mail. Nous vous enverrons un code de vérification.
        </p>

        <form onSubmit={handleSubmit} className="fp-form">
          <div className="fp-field">
            <label htmlFor="fp-email" className="fp-label">
              Adresse e-mail <span className="fp-required">*</span>
            </label>
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fp-input"
              placeholder="vous@entreprise.dz"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {error && <div className="fp-error">{error}</div>}

          <button type="submit" className="fp-submit" disabled={loading}>
            {loading ? (
              <span className="fp-spinner-row">
                <span className="fp-spinner" /> Envoi en cours…
              </span>
            ) : (
              'Envoyer le code de vérification'
            )}
          </button>

          <button type="button" className="fp-secondary" onClick={onBack} disabled={loading}>
            ← Retour à la connexion
          </button>
        </form>

      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// VUE 3 : SAISIE DU CODE OTP
// ─────────────────────────────────────────────────────────────
function ViewOtpVerification({ email, context, onBack, onVerified }) {
  const [digits, setDigits]       = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError('');
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const code   = digits.join('');
  const isFull = code.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isFull) { setError('Veuillez saisir les 6 chiffres.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified(email);
      } else {
        setError(data.message || 'Code invalide ou expiré.');
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setDigits(Array(OTP_LENGTH).fill(''));
        setCountdown(RESEND_SECONDS);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || 'Impossible de renvoyer le code.');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="otp-shell">
      <div className="otp-card">

        <button className="otp-back-link" type="button" onClick={onBack}>
          <span className="otp-back-chevron">‹</span>{' '}
          {context === 'login' ? 'Retour à la connexion' : "Modifier l'adresse e-mail"}
        </button>

        <div className="otp-icon-wrap">
          <span className="otp-icon">{context === 'login' ? '🔒' : '🛡️'}</span>
        </div>

        <h1 className="otp-title">
          {context === 'login' ? 'Vérification 🔐' : 'Code de vérification ✉️'}
        </h1>
        <p className="otp-subtitle">
          {context === 'login'
            ? 'Un code à 6 chiffres a été envoyé à'
            : 'Un code a été envoyé à'
          }<br />
          <span className="otp-email">{email}</span>
        </p>

        <div className="otp-digits" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-digit${d ? ' filled' : ''}${i === digits.findIndex((x) => !x) ? ' active' : ''}`}
              disabled={loading}
              aria-label={`Chiffre ${i + 1}`}
            />
          ))}
        </div>

        <p className="otp-resend-row">
          Code non reçu ?{' '}
          {canResend ? (
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Envoi…' : 'Renvoyer le code'}
            </button>
          ) : (
            <span className="otp-countdown">Renvoyer dans {countdown}s</span>
          )}
        </p>

        {error && <div className="otp-error">{error}</div>}

        <button
          type="button"
          className="otp-submit"
          onClick={handleVerify}
          disabled={!isFull || loading}
        >
          {loading ? (
            <span className="otp-spinner-row">
              <span className="otp-spinner" /> Vérification…
            </span>
          ) : (
            context === 'login' ? 'Vérifier le code' : 'Valider le code'
          )}
        </button>

        <button type="button" className="otp-secondary" onClick={onBack} disabled={loading}>
          {context === 'login' ? '← Retour à la connexion' : '← Retour'}
        </button>

        <p className="otp-demo-hint">
          Pour la démo, entrez n'importe quel code à 6 chiffres
        </p>

      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL EXPORTÉ — gère les 4 vues en interne
// ─────────────────────────────────────────────────────────────
//
// FLUX "Se connecter" :
//   login → (identifiants ok + OTP envoyé) → otp-login → onLogin()
//
// FLUX "Mot de passe oublié" :
//   login → forgot → otp-forgot → retour login
//
export default function Login({ onLogin, onCancel, onRegisterClick }) {
  // 'login' | 'forgot' | 'otp-login' | 'otp-forgot'
  const [view, setView]         = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [pendingUser, setPendingUser] = useState(null); // stocke les infos user en attente de validation OTP

  // ── Depuis ViewLogin : identifiants ok, OTP envoyé ──────────
  const handleCredentialsOk = (userData) => {
    setPendingUser(userData);
    setOtpEmail(userData.email);
    setView('otp-login');
  };

  // ── Depuis ViewLogin : clic "Mot de passe oublié" ───────────
  const handleForgotPassword = (prefillEmail) => {
    setOtpEmail(prefillEmail || '');
    setView('forgot');
  };

  // ── Depuis ViewForgotPassword : OTP envoyé ──────────────────
  const handleOtpSent = (email) => {
    setOtpEmail(email);
    setView('otp-forgot');
  };

  // ── OTP validé après connexion → accès accordé ──────────────
  const handleLoginOtpVerified = () => {
    onLogin(pendingUser);
  };

  // ── OTP validé après mot de passe oublié → retour login ─────
  const handleForgotOtpVerified = (email) => {
    alert(`✅ Identité vérifiée pour ${email}.\nVous pouvez maintenant vous reconnecter.`);
    setView('login');
  };

  // ── VUE : Mot de passe oublié ────────────────────────────────
  if (view === 'forgot') {
    return (
      <ViewForgotPassword
        prefillEmail={otpEmail}
        onBack={() => setView('login')}
        onOtpSent={handleOtpSent}
      />
    );
  }

  // ── VUE : OTP après connexion ────────────────────────────────
  if (view === 'otp-login') {
    return (
      <ViewOtpVerification
        email={otpEmail}
        context="login"
        onBack={() => setView('login')}
        onVerified={handleLoginOtpVerified}
      />
    );
  }

  // ── VUE : OTP après "mot de passe oublié" ────────────────────
  if (view === 'otp-forgot') {
    return (
      <ViewOtpVerification
        email={otpEmail}
        context="forgot"
        onBack={() => setView('forgot')}
        onVerified={handleForgotOtpVerified}
      />
    );
  }

  // ── VUE : Connexion (défaut) ─────────────────────────────────
  return (
    <ViewLogin
      onCancel={onCancel}
      onRegisterClick={onRegisterClick}
      onForgotPassword={handleForgotPassword}
      onCredentialsOk={handleCredentialsOk}
    />
  );
}