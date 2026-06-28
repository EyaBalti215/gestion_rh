import React, { useState } from 'react';
import '../components/EmployeeRegistration.css';

export default function EmployeeRegistration({ onCancel, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    poste: '',
    typeContrat: 'CDI',
    modeReglement: 'Virement bancaire',
    rib: '',
    motDePasse: '',
    confirmMotDePasse: '',
  });

  const [errors, setErrors]           = useState({});
  const [isLoading, setIsLoading]     = useState(false);
  const [successData, setSuccessData] = useState(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.prenom.trim())    newErrors.prenom    = 'Le prénom est requis';
      if (!formData.nom.trim())       newErrors.nom       = 'Le nom est requis';
      if (!formData.email.trim()) {
        newErrors.email = "L'e-mail est requis";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "L'e-mail n'est pas valide";
      }
      if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
      if (!formData.adresse.trim())   newErrors.adresse   = "L'adresse est requise";
    }

    if (step === 2) {
      if (!formData.poste.trim()) newErrors.poste = 'Le poste souhaité est requis';
      if (!formData.rib.trim())   newErrors.rib   = 'Le RIB/IBAN est requis';
    }

    if (step === 3) {
      if (!formData.motDePasse.trim()) {
        newErrors.motDePasse = 'Le mot de passe est requis';
      } else if (formData.motDePasse.length < 8) {
        newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (!formData.confirmMotDePasse.trim()) {
        newErrors.confirmMotDePasse = 'Veuillez confirmer le mot de passe';
      } else if (formData.motDePasse !== formData.confirmMotDePasse) {
        newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext     = () => { if (validateStep(currentStep)) setCurrentStep(p => p + 1); };
  const handlePrevious = () => setCurrentStep(p => p - 1);

  // ── Soumission → API ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const payload = {
        prenom:        formData.prenom,
        nom:           formData.nom,
        email:         formData.email,
        telephone:     formData.telephone,
        adresse:       formData.adresse,
        poste:         formData.poste,
        typeContrat:   formData.typeContrat,
        modeReglement: formData.modeReglement,
        rib:           formData.rib,
        motDePasse:    formData.motDePasse,
      };

      const response = await fetch('http://localhost:8080/api/employees/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Une erreur est survenue.' });
        return;
      }

      setSuccessData(data);

    } catch (err) {
      setErrors({ general: 'Impossible de contacter le serveur. Réessayez.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Écran de bienvenue (même carte, même style) ──────────────────────────────

  if (successData) {
    return (
      <main className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <div>
              <h1>Inscription Employé</h1>
              <p className="registration-subtitle">Créez votre compte — validation par l'administrateur requise</p>
            </div>
          </div>

          <div className="step-content">
            <div className="step-panel">
              <div className="step-icon">🎉</div>
              <h2>Demande soumise avec succès !</h2>
              <p className="step-subtitle">
                Bienvenue, <strong>{successData.prenom} {successData.nom}</strong>
              </p>

              <div className="security-info" style={{ marginTop: '16px', background: '#f0fdf4', borderColor: '#86efac' }}>
                <span className="info-icon">✅</span>
                <span className="info-text" style={{ color: '#166534' }}>
                  <strong style={{ color: '#15803d' }}>Votre compte a été créé.</strong>{' '}
                  Vous devez attendre la validation de l'administrateur pour accéder à votre plateforme.
                  Un e-mail de confirmation vous sera envoyé dès l'approbation.
                </span>
              </div>

              <div className="security-info" style={{ marginTop: '12px' }}>
                <span className="info-icon">ℹ</span>
                <span className="info-text">
                  <strong>E-mail enregistré :</strong> {successData.email}
                  <br />
                  <strong>Statut :</strong> En attente de validation
                </span>
              </div>
            </div>
          </div>

          <div className="registration-actions">
            <div className="flex-spacer" />
            <button
              className="btn-success"
              type="button"
              onClick={() => onSuccess && onSuccess()}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Formulaire multi-étapes ─────────────────────────────────────────────────

  return (
    <main className="registration-container">
      <div className="registration-card">

        {/* Header */}
        <div className="registration-header">
          <button className="back-button" onClick={onCancel}>‹</button>
          <div>
            <h1>Inscription Employé</h1>
            <p className="registration-subtitle">
              Créez votre compte — validation par l'administrateur requise
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="steps-container">
          <div className="step-item" data-step="1">
            <div className={`step-number ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className="step-label">Identité</span>
          </div>
          <div className="step-connector" style={{ opacity: currentStep >= 2 ? 1 : 0.3 }}></div>
          <div className="step-item" data-step="2">
            <div className={`step-number ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className="step-label">Poste & Contrat</span>
          </div>
          <div className="step-connector" style={{ opacity: currentStep >= 3 ? 1 : 0.3 }}></div>
          <div className="step-item" data-step="3">
            <div className={`step-number ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <span className="step-label">Sécurité</span>
          </div>
        </div>

        {/* Erreur globale */}
        {errors.general && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ⚠ {errors.general}
          </div>
        )}

        {/* Step Content */}
        <div className="step-content">

          {/* ── Étape 1 : Identité ── */}
          {currentStep === 1 && (
            <div className="step-panel">
              <div className="step-icon">👤</div>
              <h2>Informations personnelles</h2>
              <p className="step-subtitle">Renseignez vos coordonnées</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prenom">Prénom <span className="required-star">*</span></label>
                  <input
                    id="prenom"
                    type="text"
                    placeholder="Karim"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    className={errors.prenom ? 'form-input error' : 'form-input'}
                  />
                  {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="nom">Nom <span className="required-star">*</span></label>
                  <input
                    id="nom"
                    type="text"
                    placeholder="Benali"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className={errors.nom ? 'form-input error' : 'form-input'}
                  />
                  {errors.nom && <span className="error-message">{errors.nom}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse e-mail professionnelle <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="vous@email.dz"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telephone">Téléphone <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    id="telephone"
                    type="tel"
                    placeholder="+213 555 XX XX XX"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className={errors.telephone ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.telephone && <span className="error-message">{errors.telephone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="adresse">Adresse de résidence <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    id="adresse"
                    type="text"
                    placeholder="Rue, Ville, Wilaya"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    className={errors.adresse ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.adresse && <span className="error-message">{errors.adresse}</span>}
              </div>
            </div>
          )}

          {/* ── Étape 2 : Poste & Contrat ── */}
          {currentStep === 2 && (
            <div className="step-panel">
              <div className="step-icon">👔</div>
              <h2>Poste & Contrat</h2>
              <p className="step-subtitle">Précisez vos informations professionnelles</p>

              <div className="form-group">
                <label htmlFor="poste">Poste souhaité <span className="required-star">*</span></label>
                <input
                  id="poste"
                  type="text"
                  placeholder="Ex: Développeur Web, Comptable..."
                  value={formData.poste}
                  onChange={(e) => handleInputChange('poste', e.target.value)}
                  className={errors.poste ? 'form-input error' : 'form-input'}
                />
                {errors.poste && <span className="error-message">{errors.poste}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="typeContrat">Type de contrat</label>
                  <select
                    id="typeContrat"
                    value={formData.typeContrat}
                    onChange={(e) => handleInputChange('typeContrat', e.target.value)}
                    className="form-input"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modeReglement">Mode de règlement préféré</label>
                <select
                  id="modeReglement"
                  value={formData.modeReglement}
                  onChange={(e) => handleInputChange('modeReglement', e.target.value)}
                  className="form-input"
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rib">RIB / IBAN <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">🏦</span>
                  <input
                    id="rib"
                    type="text"
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX"
                    value={formData.rib}
                    onChange={(e) => handleInputChange('rib', e.target.value)}
                    className={errors.rib ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.rib && <span className="error-message">{errors.rib}</span>}
              </div>
            </div>
          )}

          {/* ── Étape 3 : Sécurité ── */}
          {currentStep === 3 && (
            <div className="step-panel">
              <div className="step-icon">🔒</div>
              <h2>Sécurité du compte</h2>
              <p className="step-subtitle">Créez un mot de passe sécurisé</p>

              <div className="form-group">
                <label htmlFor="motDePasse">Mot de passe <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    id="motDePasse"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={formData.motDePasse}
                    onChange={(e) => handleInputChange('motDePasse', e.target.value)}
                    className={errors.motDePasse ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.motDePasse && <span className="error-message">{errors.motDePasse}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmMotDePasse">Confirmer le mot de passe <span className="required-star">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    id="confirmMotDePasse"
                    type="password"
                    placeholder="Répétez votre mot de passe"
                    value={formData.confirmMotDePasse}
                    onChange={(e) => handleInputChange('confirmMotDePasse', e.target.value)}
                    className={errors.confirmMotDePasse ? 'form-input error' : 'form-input'}
                  />
                </div>
                {errors.confirmMotDePasse && <span className="error-message">{errors.confirmMotDePasse}</span>}
              </div>

              <div className="security-info">
                <span className="info-icon">ℹ</span>
                <span className="info-text">
                  <strong>Validation requise :</strong> Votre compte sera activé après validation
                  par un administrateur. Vous recevrez un e-mail de confirmation.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="registration-actions">
          {currentStep > 1 && (
            <button className="btn-secondary" type="button" onClick={handlePrevious} disabled={isLoading}>
              ‹ Précédent
            </button>
          )}
          <div className="flex-spacer"></div>
          {currentStep < 3 && (
            <button className="btn-primary" type="button" onClick={handleNext}>
              Suivant ›
            </button>
          )}
          {currentStep === 3 && (
            <button className="btn-success" type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '⏳ Envoi en cours...' : '✈ Soumettre ma demande'}
            </button>
          )}
        </div>

      </div>
    </main>
  );
}