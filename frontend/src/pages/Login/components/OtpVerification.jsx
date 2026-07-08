import React, { useState, useEffect, useRef } from 'react';
import './OtpVerification.css';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const IS_DEV = import.meta.env.DEV;

export default function OtpVerification({ email, onBack, onVerified }) {
  const [digits, setDigits]       = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  /* Décompte pour "Renvoyer" */
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* Focus sur la 1ère case au montage */
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    // Accepter seulement les chiffres
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError('');

    // Avancer automatiquement
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

  const code = digits.join('');
  const isFull = code.length === OTP_LENGTH;

  const handleVerify = async () => {
    if (!isFull) { setError('Veuillez saisir les 6 chiffres.'); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.success) {
        onVerified(email);
      } else {
        setError(data.message || 'Code invalide ou expiré.');
        if (IS_DEV) {
          onVerified(email);
        }
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est démarré.');
      if (IS_DEV) {
        onVerified(email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/password/send-otp`, {
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
        setError(data.message || "Impossible de renvoyer le code.");
        if (IS_DEV) {
          setDigits(Array(OTP_LENGTH).fill(''));
          setCountdown(RESEND_SECONDS);
          setCanResend(false);
          inputRefs.current[0]?.focus();
        }
      }
    } catch {
      setError('Erreur réseau.');
      if (IS_DEV) {
        setDigits(Array(OTP_LENGTH).fill(''));
        setCountdown(RESEND_SECONDS);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="otp-shell">
      <div className="otp-card">

        <button className="otp-back-link" type="button" onClick={onBack}>
          <span className="otp-back-chevron">‹</span> Modifier l'adresse e-mail
        </button>

        <div className="otp-icon-wrap">
          <span className="otp-icon">🛡️</span>
        </div>

        <h1 className="otp-title">Code de vérification <span aria-hidden="true">✉️</span></h1>
        <p className="otp-subtitle">
          Un code a été envoyé à<br />
          <span className="otp-email">{email}</span>
        </p>

        {/* 6 cases individuelles */}
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

        {/* Renvoyer */}
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
            'Valider le code'
          )}
        </button>

        <button type="button" className="otp-secondary" onClick={onBack} disabled={loading}>
          ← Retour
        </button>

        <p className="otp-demo-hint">
          Pour la démo, entrez n'importe quel code à 6 chiffres
        </p>

      </div>
    </main>
  );
}