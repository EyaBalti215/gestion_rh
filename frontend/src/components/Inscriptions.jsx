import React, { useState, useEffect } from 'react';
import '../components/Inscriptions.css';

export default function Inscriptions({ mode = 'inscriptions' }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [employeeForm, setEmployeeForm] = useState(emptyForm());
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const isEmployeePage = mode === 'employes';

  function emptyForm() {
    return {
      prenom: '', nom: '', email: '', telephone: '',
      adresse: '', poste: '', typeContrat: 'CDI',
      modeReglement: 'Virement bancaire', rib: '', login: '',
      motDePasse: '',
    };
  }

  const closeModal = () => {
    setSelectedEmployee(null);
    setModalMode('view');
    setEmployeeForm(emptyForm());
    setModalError('');
    setModalLoading(false);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedEmployee(null);
    setEmployeeForm(emptyForm());
    setModalError('');
  };

  const openViewModal = (emp) => {
    setModalMode('view');
    setSelectedEmployee(emp);
    setModalError('');
  };

  const openEditModal = (emp) => {
    setModalMode('edit');
    setSelectedEmployee(emp);
    setEmployeeForm({
      prenom: emp.prenom || '',
      nom: emp.nom || '',
      email: emp.email || '',
      telephone: emp.telephone || '',
      adresse: emp.adresse || '',
      poste: emp.poste || '',
      typeContrat: emp.typeContrat || 'CDI',
      modeReglement: emp.modeReglement || 'Virement bancaire',
      rib: emp.rib || '',
      login: emp.login || '',
      motDePasse: '',
    });
    setModalError('');
  };

  const updateFormField = (key, value) => {
    setEmployeeForm(prev => ({ ...prev, [key]: value }));
    if (modalError) setModalError('');
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/employees');
      const data = await res.json();
      setEmployees(data || []);
    } catch {
      setError('❌ Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const saveEmployee = async () => {
    // Validation côté client
    if (!employeeForm.prenom.trim() || !employeeForm.nom.trim()) {
      setModalError('Prénom et nom sont obligatoires.');
      return;
    }
    if (!employeeForm.email.trim()) {
      setModalError("L'email est obligatoire.");
      return;
    }
    if (modalMode === 'create' && !employeeForm.login.trim()) {
      setModalError('Le login est obligatoire pour créer un employé.');
      return;
    }
    if (modalMode === 'create' && employeeForm.motDePasse.trim() && employeeForm.motDePasse.length < 8) {
      setModalError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setModalError('');
    setModalLoading(true);

    try {
      const url = modalMode === 'create'
        ? 'http://localhost:8080/api/employees'
        : `http://localhost:8080/api/employees/${selectedEmployee.id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const payload = {
        ...employeeForm,
        motDePasse: employeeForm.motDePasse,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setModalError(data.error || `Erreur serveur ${response.status}.`);
        return;
      }

      setSuccessMessage(data.message || 'Enregistrement effectué avec succès.');
      closeModal();
      fetchEmployees();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch {
      setModalError('Impossible de contacter le serveur. Réessayez.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    setError('');
    setSuccessMessage('');
    const url = action === 'valider'
      ? `http://localhost:8080/api/employees/${id}/valider`
      : `http://localhost:8080/api/employees/${id}/refuser`;

    try {
      const res = await fetch(url, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || 'Succès');
        fetchEmployees();
        setSelectedEmployee(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('❌ Erreur réseau');
    } finally {
      setActionLoading(null);
    }
  };

  const enAttente = employees.filter(e => e.statut === 'EN_ATTENTE');
  const validees = employees.filter(e => e.statut === 'VALIDE');
  const refusees = employees.filter(e => e.statut === 'REJETE');
  const displayEmployees = isEmployeePage ? employees : enAttente;

  const title = isEmployeePage ? 'Employés & RH' : 'Inscriptions en attente';
  const subtitle = isEmployeePage
    ? 'Parcourez la liste des employés inscrits et consultez leurs informations RH.'
    : "Validez ou refusez les nouvelles demandes d'inscription.";

  const formatDate = (date) => date ? date.slice(0, 10) : '—';

  const initials = (p, n) =>
    `${(p?.[0] || '').toUpperCase()}${(n?.[0] || '').toUpperCase()}`;

  const avatarColor = (prenom) => {
    const colors = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
    return colors[(prenom?.charCodeAt(0) || 0) % colors.length];
  };

  const filtered = displayEmployees.filter(e =>
    `${e.prenom} ${e.nom} ${e.email} ${e.poste} ${e.typeContrat} ${e.modeReglement} ${e.login}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="inscriptions-page">

      {/* ── STATS ── */}
      <div className="insc-stats">
        <div className="insc-stat-card pending">{enAttente.length} En attente</div>
        <div className="insc-stat-card approved">{validees.length} Validées</div>
        <div className="insc-stat-card refused">{refusees.length} Refusées</div>
      </div>

      <div className="insc-header-row">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="insc-header-actions">
          <div className="insc-search-row">
            <span className="insc-search-icon">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un employé, un poste, un login..."
            />
          </div>
          {isEmployeePage && (
            <button className="insc-create-button" onClick={openCreateModal}>
              + Nouvel employé
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="insc-panel">
        <div className="insc-panel-header">
          <div className="insc-panel-title">
            <div className="insc-dot" />
            <h2>{isEmployeePage ? 'Liste des employés' : 'Demandes en attente de validation'}</h2>
          </div>
        </div>

        {loading ? (
          <p className="insc-empty">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="insc-empty">Aucun résultat trouvé</p>
        ) : isEmployeePage ? (
          <div className="insc-card-grid">
            {filtered.map(emp => (
              <article className="insc-card" key={emp.id}>
                <div className="insc-card-top">
                  <div className="insc-avatar" style={{ background: avatarColor(emp.prenom) }}>
                    {initials(emp.prenom, emp.nom)}
                  </div>
                  <div className="insc-card-title">
                    <div className="insc-name">{emp.prenom} {emp.nom}</div>
                    <div className="insc-role">{emp.poste || 'Position non définie'}</div>
                    <div className="insc-tags">
                      <span className="insc-pill contrat">{emp.typeContrat || 'CDI'}</span>
                      <span className={`insc-pill status ${emp.statut?.toLowerCase() || 'en_attente'}`}>
                        {emp.statut?.replace('_', ' ') || 'EN ATTENTE'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="insc-card-body">
                  <div className="insc-card-row"><span>Login</span><strong>{emp.login || '—'}</strong></div>
                  <div className="insc-card-row"><span>Entrée</span><strong>{formatDate(emp.createdAt || emp.created_at)}</strong></div>
                  <div className="insc-card-row"><span>Règlement</span><strong>{emp.modeReglement || 'Virement'}</strong></div>
                  <div className="insc-card-row"><span>Salaire</span><strong>{emp.salaire ? `${emp.salaire} TND` : 'Non renseigné'}</strong></div>
                </div>
                <div className="insc-card-actions">
                  <button className="btn-voir" onClick={() => openViewModal(emp)}>Détails</button>
                  <button className="btn-edit" onClick={() => openEditModal(emp)}>Modifier</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          filtered.map(emp => (
            <div className="insc-row" key={emp.id}>
              <div className="insc-avatar" style={{ background: avatarColor(emp.prenom) }}>
                {initials(emp.prenom, emp.nom)}
              </div>
              <div className="insc-info">
                <div className="insc-info-top">
                  <div>
                    <div className="insc-name">{emp.prenom} {emp.nom}</div>
                    <div className="insc-role">{emp.poste}</div>
                  </div>
                  <div className="insc-status">Soumis le {formatDate(emp.createdAt || emp.created_at)}</div>
                </div>
                <div className="insc-email">{emp.email}</div>
              </div>
              <div className="insc-actions">
                <button className="btn-voir" onClick={() => openViewModal(emp)}>Voir</button>
                <button className="btn-valider" onClick={() => handleAction(emp.id, 'valider')}
                  disabled={actionLoading === emp.id + 'valider'}>
                  {actionLoading === emp.id + 'valider' ? '...' : '✔ Valider'}
                </button>
                <button className="btn-refuser" onClick={() => handleAction(emp.id, 'refuser')}
                  disabled={actionLoading === emp.id + 'refuser'}>
                  {actionLoading === emp.id + 'refuser' ? '...' : '✖ Refuser'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MODAL ── */}
      {(selectedEmployee || modalMode === 'create') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card modal-form-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeModal}>×</button>

            <div className="modal-header modal-form-header">
              <div>
                <h2 className="modal-name">
                  {modalMode === 'create' ? 'Nouvel employé'
                    : `${selectedEmployee?.prenom || ''} ${selectedEmployee?.nom || ''}`}
                </h2>
                <p className="modal-role">
                  {modalMode === 'create'
                    ? 'Remplissez les informations — les identifiants seront envoyés par email'
                    : modalMode === 'edit'
                      ? "Modifier les informations de l'employé"
                      : selectedEmployee?.poste || 'Employé'}
                </p>
              </div>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-grid">
                <div className="modal-field"><span>Login</span><strong>{selectedEmployee.login || '—'}</strong></div>
                <div className="modal-field"><span>Email</span><strong>{selectedEmployee.email || '—'}</strong></div>
                <div className="modal-field"><span>Téléphone</span><strong>{selectedEmployee.telephone || '—'}</strong></div>
                <div className="modal-field"><span>Contrat</span><strong>{selectedEmployee.typeContrat || 'CDI'}</strong></div>
                <div className="modal-field"><span>Règlement</span><strong>{selectedEmployee.modeReglement || 'Virement'}</strong></div>
                <div className="modal-field"><span>Adresse</span><strong>{selectedEmployee.adresse || '—'}</strong></div>
                <div className="modal-field"><span>RIB / IBAN</span><strong>{selectedEmployee.rib || '—'}</strong></div>
                <div className="modal-field"><span>Soumis le</span><strong>{formatDate(selectedEmployee.createdAt || selectedEmployee.created_at)}</strong></div>
                <div className="modal-field"><span>Statut</span><strong>{selectedEmployee.statut?.replace('_', ' ') || 'EN ATTENTE'}</strong></div>
              </div>
            ) : (
              <div className="modal-form-grid">
                <div className="form-field">
                  <label>Prénom *</label>
                  <input type="text" value={employeeForm.prenom}
                    onChange={(e) => updateFormField('prenom', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Nom *</label>
                  <input type="text" value={employeeForm.nom}
                    onChange={(e) => updateFormField('nom', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input type="email" value={employeeForm.email}
                    onChange={(e) => updateFormField('email', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Téléphone</label>
                  <input type="text" value={employeeForm.telephone}
                    onChange={(e) => updateFormField('telephone', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>
                    Login *
                    {modalMode === 'create' && (
                      <span className="form-hint"> — utilisé pour se connecter à la plateforme</span>
                    )}
                  </label>
                  <input type="text" value={employeeForm.login}
                    onChange={(e) => updateFormField('login', e.target.value)}
                    placeholder="ex: j.dupont" />
                </div>
                <div className="form-field">
                  <label>
                    Mot de passe (optionnel)
                    <span className="form-hint"> — laissez vide pour générer un mot de passe automatique</span>
                  </label>
                  <input type="password" value={employeeForm.motDePasse}
                    onChange={(e) => updateFormField('motDePasse', e.target.value)}
                    placeholder="8 caractères minimum" />
                </div>
                <div className="form-field">
                  <label>Poste</label>
                  <input type="text" value={employeeForm.poste}
                    onChange={(e) => updateFormField('poste', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Contrat</label>
                  <select value={employeeForm.typeContrat}
                    onChange={(e) => updateFormField('typeContrat', e.target.value)}>
                    <option>CDI</option>
                    <option>CDD</option>
                    <option>Stage</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Règlement</label>
                  <select value={employeeForm.modeReglement}
                    onChange={(e) => updateFormField('modeReglement', e.target.value)}>
                    <option>Virement bancaire</option>
                    <option>Chèque</option>
                    <option>Espèces</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>RIB / IBAN</label>
                  <input type="text" value={employeeForm.rib}
                    onChange={(e) => updateFormField('rib', e.target.value)} />
                </div>
                <div className="form-field full-width">
                  <label>Adresse</label>
                  <input type="text" value={employeeForm.adresse}
                    onChange={(e) => updateFormField('adresse', e.target.value)} />
                </div>

                {modalMode === 'create' && (
                  <div className="form-field full-width">
                    <div className="form-info-box">
                      📧 Un mot de passe sera généré automatiquement et envoyé à l'adresse email de l'employé.
                    </div>
                  </div>
                )}
              </div>
            )}

            {modalError && <div className="modal-error">{modalError}</div>}

            <div className="modal-actions">
              {modalMode === 'view' ? (
                <>
                  {selectedEmployee?.statut === 'EN_ATTENTE' && (
                    <>
                      <button className="btn-valider" onClick={() => handleAction(selectedEmployee.id, 'valider')}>
                        ✔ Valider
                      </button>
                      <button className="btn-refuser" onClick={() => handleAction(selectedEmployee.id, 'refuser')}>
                        ✖ Refuser
                      </button>
                    </>
                  )}
                  <button className="btn-edit" onClick={() => openEditModal(selectedEmployee)}>Modifier</button>
                  <button className="btn-voir" onClick={closeModal}>Fermer</button>
                </>
              ) : (
                <>
                  <button className="btn-valider" onClick={saveEmployee} disabled={modalLoading}>
                    {modalLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button className="btn-voir" onClick={closeModal}>Annuler</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}