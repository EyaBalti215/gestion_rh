import React, { useState } from 'react';
import './NewPassword.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const IS_DEV = import.meta.env.DEV;

// ── Calcul force du mot de passe ─────────────────────────────
function getStrength(pwd) {
  if (!pwd) return { level: 0, label: '—', color: '#e2e8f0' };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { level: 1, label: 'Très faible', color: '#ef4444' };
  if (score === 2) return { level: 2, label: 'Faible',      color: '#f97316' };
  if (score === 3) return { level: 3, label: 'Moyen',       color: '#eab308' };
  if (score === 4) return { level: 4, label: 'Fort',        color: '#22c55e' };
  return             { level: 5, label: 'Très fort',    color: '#16a34a' };
}

export default function NewPassword({ email, onBack, onSuccess }) {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.trim()) {
      setError('Adresse e-mail introuvable. Revenez en arrière et recommencez.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          nouveauMotDePasse: password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Impossible de réinitialiser le mot de passe.");
        if (IS_DEV) {
          onSuccess();
        }
        return;
      }

      onSuccess();
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
      if (IS_DEV) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="np-shell">
      <div className="np-card">

        {/* Icône succès */}
        <div className="np-icon-wrap">
          <span className="np-icon">✅</span>
        </div>

        <h1 className="np-title">Nouveau mot de passe <span aria-hidden="true">🔒</span></h1>
        <p className="np-subtitle">
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>

        <form onSubmit={handleSubmit} className="np-form">

          {/* Nouveau mot de passe */}
          <div className="np-field">
            <label htmlFor="np-pwd" className="np-label">
              Nouveau mot de passe <span className="np-required">*</span>
            </label>
            <div className="np-input-wrap">
              <input
                id="np-pwd"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="np-input"
                placeholder="Min. 8 caractères"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="np-eye"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
                aria-label={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Barre de force */}
            <div className="np-strength-bar">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className="np-strength-seg"
                  style={{
                    background: seg <= strength.level ? strength.color : '#e2e8f0',
                  }}
                />
              ))}
            </div>
            <p className="np-strength-label" style={{ color: strength.color }}>
              Force : {strength.label}
            </p>
          </div>

          {/* Confirmer mot de passe */}
          <div className="np-field">
            <label htmlFor="np-cfm" className="np-label">
              Confirmer le mot de passe <span className="np-required">*</span>
            </label>
            <div className="np-input-wrap">
              <input
                id="np-cfm"
                type={showCfm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="np-input"
                placeholder="Répétez le mot de passe"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="np-eye"
                onClick={() => setShowCfm((v) => !v)}
                tabIndex={-1}
                aria-label={showCfm ? 'Masquer' : 'Afficher'}
              >
                {showCfm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="np-error">{error}</div>}

          <button type="submit" className="np-submit" disabled={loading}>
            {loading ? (
              <span className="np-spinner-row">
                <span className="np-spinner" /> Réinitialisation…
              </span>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>

          <button type="button" className="np-secondary" onClick={onBack} disabled={loading}>
            ← Retour à la connexion
          </button>

        </form>
      </div>
    </main>
  );
}