import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import './Register.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    login: '',
    telephone: '',
    adresse: '',
    poste: '',
    typeContrat: 'CDI',
    modeReglement: 'Virement bancaire',
    rib: '',
    motDePasse: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim() || !formData.login.trim()) {
      setError('Veuillez remplir au moins prénom, nom, e-mail et login.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/employees/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Impossible de créer le compte.');
        return;
      }

      setSuccess('Demande soumise avec succès. Validation admin requise.');
      setTimeout(() => navigate(PATHS.HOME), 1200);
    } catch {
      setError('Impossible de contacter le serveur. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <button className="back-button" type="button" onClick={() => navigate(PATHS.HOME)}>‹</button>
          <div>
            <h1>Inscription Employé</h1>
            <p className="registration-subtitle">Créez votre compte — validation par l'administrateur requise</p>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>{success}</div>}

        <form onSubmit={handleSubmit} className="step-content">
          <div className="step-panel">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input id="prenom" className="form-input" value={formData.prenom} onChange={(e) => handleChange('prenom', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input id="nom" className="form-input" value={formData.nom} onChange={(e) => handleChange('nom', e.target.value)} />
              </div>
            </div>

            <div className="form-group"><label htmlFor="email">Adresse e-mail</label><input id="email" className="form-input" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} /></div>
            <div className="form-group"><label htmlFor="login">Login</label><input id="login" className="form-input" value={formData.login} onChange={(e) => handleChange('login', e.target.value)} /></div>
            <div className="form-group"><label htmlFor="telephone">Téléphone</label><input id="telephone" className="form-input" value={formData.telephone} onChange={(e) => handleChange('telephone', e.target.value)} /></div>
            <div className="form-group"><label htmlFor="adresse">Adresse</label><input id="adresse" className="form-input" value={formData.adresse} onChange={(e) => handleChange('adresse', e.target.value)} /></div>
            <div className="form-group"><label htmlFor="poste">Poste</label><input id="poste" className="form-input" value={formData.poste} onChange={(e) => handleChange('poste', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="typeContrat">Type de contrat</label><input id="typeContrat" className="form-input" value={formData.typeContrat} onChange={(e) => handleChange('typeContrat', e.target.value)} /></div>
              <div className="form-group"><label htmlFor="modeReglement">Mode de règlement</label><input id="modeReglement" className="form-input" value={formData.modeReglement} onChange={(e) => handleChange('modeReglement', e.target.value)} /></div>
            </div>
            <div className="form-group"><label htmlFor="rib">RIB</label><input id="rib" className="form-input" value={formData.rib} onChange={(e) => handleChange('rib', e.target.value)} /></div>
            <div className="form-group"><label htmlFor="motDePasse">Mot de passe</label><input id="motDePasse" type="password" className="form-input" value={formData.motDePasse} onChange={(e) => handleChange('motDePasse', e.target.value)} /></div>

            <div className="registration-actions">
              <div className="flex-spacer" />
              <button className="btn-success" type="submit" disabled={loading}>{loading ? 'Envoi…' : 'Créer le compte'}</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}