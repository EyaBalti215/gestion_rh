import React, { useState } from 'react';
import './ChangePassword.css';

export default function ChangePassword({ user, onCancel, onSuccess }) {
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!ancienMotDePasse.trim()) {
      setError("L'ancien mot de passe est requis.");
      return;
    }

    if (!nouveauMotDePasse.trim()) {
      setError('Le nouveau mot de passe est requis.');
      return;
    }

    if (nouveauMotDePasse.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (nouveauMotDePasse !== confirmMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (ancienMotDePasse === nouveauMotDePasse) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/employees/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          ancienMotDePasse: ancienMotDePasse,
          nouveauMotDePasse: nouveauMotDePasse,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Mot de passe changé avec succès !');
        setAncienMotDePasse('');
        setNouveauMotDePasse('');
        setConfirmMotDePasse('');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(data.error || 'Erreur lors du changement de mot de passe.');
      }
    } catch (err) {
      setError('❌ Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-overlay">
      <div className="change-password-card">
        <h2>🔐 Changer mon mot de passe</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ancien mot de passe *</label>
            <input
              type="password"
              value={ancienMotDePasse}
              onChange={(e) => setAncienMotDePasse(e.target.value)}
              placeholder="Entrez votre ancien mot de passe"
              required
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe *</label>
            <input
              type="password"
              value={nouveauMotDePasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
              placeholder="Minimum 8 caractères"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmer nouveau mot de passe *</label>
            <input
              type="password"
              value={confirmMotDePasse}
              onChange={(e) => setConfirmMotDePasse(e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'En cours...' : '✅ Changer le mot de passe'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
