import React, { useState } from 'react';
import './ForgotPassword.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const IS_DEV = import.meta.env.DEV;

export default function ForgotPassword({ onBack, onOtpSent }) {
  const [email, setEmail]     = useState('admin@hrflow.local');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (data.success) {
        onOtpSent(email.trim().toLowerCase());
      } else {
        setError(data.message || "Impossible d'envoyer le code.");
        if (IS_DEV) {
          onOtpSent(email.trim().toLowerCase());
        }
      }
    } catch {
      setError("Erreur réseau. Vérifiez que le serveur est démarré.");
      if (IS_DEV) {
        onOtpSent(email.trim().toLowerCase());
      }
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