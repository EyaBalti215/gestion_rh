import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './AdminFournisseurs.css';

export default function AdminFournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fournisseurs'); // 'fournisseurs' ou 'charges'
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalType, setModalType] = useState('fournisseur'); // 'fournisseur' ou 'charge'
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [form, setForm] = useState({
    nom: '',
    type: '',
    email: '',
    telephone: '',
    adresse: '',
    statut: 'Actif',
  });
  const [chargeForm, setChargeForm] = useState({
    designation: '',
    fournisseurId: '',
    montant: '',
    statut: 'En attente',
  });

  const loadFournisseurs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/fournisseurs');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setFournisseurs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFournisseurs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCharges = async () => {
    try {
      const res = await apiFetch('/charges');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setCharges(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setCharges([]);
    }
  };

  useEffect(() => {
    loadFournisseurs();
    loadCharges();
  }, []);

  const handleCreateCharge = async () => {
    if (!chargeForm.designation || !chargeForm.fournisseurId || !chargeForm.montant) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      const url = editingId && modalType === 'charge' ? `/charges/${editingId}` : '/charges';
      const method = editingId && modalType === 'charge' ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify({
          designation: chargeForm.designation,
          fournisseurId: parseInt(chargeForm.fournisseurId),
          montant: parseFloat(chargeForm.montant),
          statut: chargeForm.statut,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur lors de la création');
        return;
      }

      await loadCharges();
      setShowNewModal(false);
      setEditingId(null);
      setChargeForm({
        designation: '',
        fournisseurId: '',
        montant: '',
        statut: 'En attente',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleDeleteCharge = async (chargeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) return;

    try {
      const res = await apiFetch(`/charges/${chargeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      await loadCharges();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleEditCharge = (charge) => {
    setChargeForm({
      designation: charge.designation,
      fournisseurId: charge.fournisseur?.id || '',
      montant: charge.montant,
      statut: charge.statut,
    });
    setEditingId(charge.id);
    setModalType('charge');
    setShowNewModal(true);
  };

  const handleCreateFournisseur = async () => {
    if (!form.nom || !form.type) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      const url = editingId && modalType === 'fournisseur' ? `/fournisseurs/${editingId}` : '/fournisseurs';
      const method = editingId && modalType === 'fournisseur' ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur lors de la création');
        return;
      }

      await loadFournisseurs();
      setShowNewModal(false);
      setEditingId(null);
      setModalType('fournisseur');
      setForm({
        nom: '',
        type: '',
        email: '',
        telephone: '',
        adresse: '',
        statut: 'Actif',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleDeleteFournisseur = async (fournisseurId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) return;

    try {
      const res = await apiFetch(`/fournisseurs/${fournisseurId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      await loadFournisseurs();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleEditFournisseur = (fournisseur) => {
    setForm({
      nom: fournisseur.nom,
      type: fournisseur.type,
      email: fournisseur.email || '',
      telephone: fournisseur.telephone || '',
      adresse: fournisseur.adresse || '',
      statut: fournisseur.statut,
    });
    setEditingId(fournisseur.id);
    setShowNewModal(true);
  };

  const openChargesModal = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setShowChargesModal(true);
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      'Fournitures': '📦',
      'Télécommunications': '📞',
      'Immobilier': '🏢',
      'Énergie': '⚡',
    };
    return typeIcons[type] || '🏢';
  };

  const stats = {
    totalCharges: charges.reduce((sum, c) => sum + (c.montant || 0), 0),
    paidCharges: charges.filter(c => c.statut === 'Payée').reduce((sum, c) => sum + (c.montant || 0), 0),
  };

  return (
    <div className="fournisseurs-page">
      <div className="fournisseurs-header-row">
        <div className="fournisseurs-stats">
          <div className="stat-card charges-card">
            <div className="stat-icon charges-icon">📦</div>
            <div className="stat-content">
              <p>Total charges</p>
              <strong>{stats.totalCharges.toFixed(2)} TND</strong>
            </div>
          </div>
          <div className="stat-card regulated-card">
            <div className="stat-icon regulated-icon">✓</div>
            <div className="stat-content">
              <p>Charges réglées</p>
              <strong>{stats.paidCharges.toFixed(2)} TND</strong>
            </div>
          </div>
        </div>
        <button className="btn-new-fournisseur" onClick={() => {
          setEditingId(null);
          if (activeTab === 'fournisseurs') {
            setModalType('fournisseur');
            setForm({
              nom: '',
              type: '',
              email: '',
              telephone: '',
              adresse: '',
              statut: 'Actif',
            });
          } else {
            setModalType('charge');
            setChargeForm({
              designation: '',
              fournisseurId: '',
              montant: '',
              statut: 'En attente',
            });
          }
          setShowNewModal(true);
        }}>
          ➕ Nouveau
        </button>
      </div>

      {/* ONGLETS */}
      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === 'fournisseurs' ? 'active' : ''}`}
          onClick={() => setActiveTab('fournisseurs')}
        >
          Fournisseurs
        </button>
        <button
          className={`tab-btn ${activeTab === 'charges' ? 'active' : ''}`}
          onClick={() => setActiveTab('charges')}
        >
          Charges
        </button>
      </div>

      {/* CONTENU ONGLETS */}
      {activeTab === 'fournisseurs' ? (
        <div className="fournisseurs-grid-container">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : fournisseurs.length === 0 ? (
            <div className="no-data">Aucun fournisseur trouvé</div>
          ) : (
            <div className="fournisseurs-grid">
              {fournisseurs.map((fournisseur) => (
                <div key={fournisseur.id} className="fournisseur-card">
                  <div className="card-header">
                    <div className="type-badge" title={fournisseur.type}>
                      {getTypeIcon(fournisseur.type)}
                    </div>
                    <span className={`status-badge ${fournisseur.statut?.toLowerCase() === 'actif' ? 'active' : 'inactive'}`}>
                      {fournisseur.statut}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="fournisseur-name">{fournisseur.nom}</h3>
                    <p className="fournisseur-type">{fournisseur.type}</p>

                    <div className="contact-info">
                      {fournisseur.email && (
                        <div className="contact-item">
                          <span className="label">✉️</span>
                          <span className="value">{fournisseur.email}</span>
                        </div>
                      )}
                      {fournisseur.telephone && (
                        <div className="contact-item">
                          <span className="label">📞</span>
                          <span className="value">{fournisseur.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="action-btn charges"
                      onClick={() => openChargesModal(fournisseur)}
                      title="Voir les charges"
                    >
                      👁️ Charges
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditFournisseur(fournisseur)}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="charges-table-container">
          <table className="charges-table">
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Fournisseur</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charges.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">Aucune charge trouvée</td>
                </tr>
              ) : (
                charges.map((charge) => (
                  <tr key={charge.id}>
                    <td><strong>{charge.designation}</strong></td>
                    <td>{charge.fournisseur?.nom}</td>
                    <td className="amount">{charge.montant} TND</td>
                    <td>{charge.date}</td>
                    <td>
                      <span className={`badge badge-${charge.statut === 'Payée' ? 'success' : 'warning'}`}>
                        {charge.statut}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="action-btn edit-small"
                        onClick={() => handleEditCharge(charge)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-small"
                        onClick={() => handleDeleteCharge(charge.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'fournisseur' 
                ? (editingId ? 'Modifier le fournisseur' : 'Ajouter un nouveau fournisseur')
                : (editingId ? 'Modifier la charge' : 'Ajouter une nouvelle charge')
              }</h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {modalType === 'fournisseur' ? (
                <>
                  <div className="form-group">
                    <label>Nom du fournisseur</label>
                    <input
                      type="text"
                      placeholder="Ex: Bureau Plus SARL"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Fournitures">Fournitures</option>
                      <option value="Télécommunications">Télécommunications</option>
                      <option value="Immobilier">Immobilier</option>
                      <option value="Énergie">Énergie</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="contact@fournisseur.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse</label>
                    <textarea
                      placeholder="Adresse complète du fournisseur"
                      rows="3"
                      value={form.adresse}
                      onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={form.statut}
                      onChange={(e) => setForm({ ...form, statut: e.target.value })}
                    >
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Désignation *</label>
                    <input
                      type="text"
                      placeholder="Ex: Fournitures de bureau"
                      value={chargeForm.designation}
                      onChange={(e) => setChargeForm({ ...chargeForm, designation: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fournisseur *</label>
                    <select
                      value={chargeForm.fournisseurId}
                      onChange={(e) => setChargeForm({ ...chargeForm, fournisseurId: e.target.value })}
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {fournisseurs.map((f) => (
                        <option key={f.id} value={f.id}>{f.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Montant (TND) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={chargeForm.montant}
                      onChange={(e) => setChargeForm({ ...chargeForm, montant: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={chargeForm.statut}
                      onChange={(e) => setChargeForm({ ...chargeForm, statut: e.target.value })}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Payée">Payée</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowNewModal(false)}>
                Annuler
              </button>
              <button 
                className="btn-save" 
                onClick={modalType === 'fournisseur' ? handleCreateFournisseur : handleCreateCharge}
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChargesModal && selectedFournisseur && (
        <div className="modal-overlay" onClick={() => setShowChargesModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Charges - {selectedFournisseur.nom}</h2>
              <button className="modal-close" onClick={() => setShowChargesModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="charges-table-wrapper">
                <table className="charges-table">
                  <thead>
                    <tr>
                      <th>Désignation</th>
                      <th>Fournisseur</th>
                      <th>Montant</th>
                      <th>Date</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fournitures de bureau (Juin)</td>
                      <td>{selectedFournisseur.nom}</td>
                      <td className="amount">380 TND</td>
                      <td>2026-06-08</td>
                      <td><span className="badge badge-success">Payée</span></td>
                    </tr>
                    <tr>
                      <td>Abonnement Téléphonique Pro</td>
                      <td>{selectedFournisseur.nom}</td>
                      <td className="amount">156 TND</td>
                      <td>2026-06-01</td>
                      <td><span className="badge badge-success">Payée</span></td>
                    </tr>
                    <tr>
                      <td>Loyer Local Commercial</td>
                      <td>{selectedFournisseur.nom}</td>
                      <td className="amount">2200 TND</td>
                      <td>2026-06-05</td>
                      <td><span className="badge badge-success">Payée</span></td>
                    </tr>
                    <tr>
                      <td>Facture Électricité Juin</td>
                      <td>{selectedFournisseur.nom}</td>
                      <td className="amount">245 TND</td>
                      <td>2026-06-12</td>
                      <td><span className="badge badge-warning">En attente</span></td>
                    </tr>
                    <tr>
                      <td>Fournitures consommables</td>
                      <td>{selectedFournisseur.nom}</td>
                      <td className="amount">125 TND</td>
                      <td>2026-06-18</td>
                      <td><span className="badge badge-success">Payée</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowChargesModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
