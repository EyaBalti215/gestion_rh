import React, { useState, useEffect, useCallback } from 'react';
import './MesConges.css';

const API_BASE = 'http://localhost:8080/api/conges';

const TYPE_OPTIONS = [
  { value: 'CONGE_ANNUEL', label: 'Congé annuel' },
  { value: 'CONGE_MALADIE', label: 'Congé maladie' },
  { value: 'AUTORISATION_EXCEPTIONNELLE', label: 'Autorisation exceptionnelle' },
];

const FILTERS = [
  { key: 'TOUS', label: 'Tous' },
  { key: 'EN_ATTENTE', label: 'En attente' },
  { key: 'APPROUVE', label: 'Approuvés' },
  { key: 'REFUSE', label: 'Refusés' },
];

function StatutBadge({ statut, label }) {
  const cls =
    statut === 'APPROUVE' ? 'emp-cg-badge-approuve' :
    statut === 'REFUSE' ? 'emp-cg-badge-refuse' : 'emp-cg-badge-attente';
  return <span className={`emp-cg-statut ${cls}`}>{label}</span>;
}

export default function MesConges({ employeeId }) {
  const [conges, setConges] = useState([]);
  const [activeFilter, setActiveFilter] = useState('TOUS');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: 'CONGE_ANNUEL',
    dateDebut: '',
    dateFin: '',
    motif: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const parseJsonResponse = async (response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const fetchConges = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/employee/${employeeId}`);
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data?.message || 'Erreur lors du chargement des congés');
      }
      setConges(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  const filteredConges = conges.filter(
    (c) => activeFilter === 'TOUS' || c.statut === activeFilter
  );

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ type: 'CONGE_ANNUEL', dateDebut: '', dateFin: '', motif: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.dateDebut || !form.dateFin) {
      setFormError('Veuillez renseigner les deux dates.');
      return;
    }
    if (new Date(form.dateFin) < new Date(form.dateDebut)) {
      setFormError('La date de fin doit être après la date de début.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/employee/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data?.message || "Erreur lors de l'envoi de la demande");

      setShowModal(false);
      resetForm();
      fetchConges();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!employeeId) {
    return (
      <div className="emp-cg-error">
        Impossible de charger vos congés : identifiant employé manquant.
      </div>
    );
  }

  return (
    <div className="emp-cg-wrapper">
      <div className="emp-cg-toolbar">
        <div className="emp-cg-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`emp-cg-filter-btn${activeFilter === f.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          className="emp-cg-new-btn"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          + Nouvelle demande
        </button>
      </div>

      {error && <div className="emp-cg-error">{error}</div>}

      <div className="emp-cg-table-card">
        <table className="emp-cg-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Période</th>
              <th>Durée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="emp-cg-empty">Chargement...</td></tr>
            ) : filteredConges.length === 0 ? (
              <tr><td colSpan={4} className="emp-cg-empty">Aucune demande de congé</td></tr>
            ) : (
              filteredConges.map((c) => (
                <tr key={c.id}>
                  <td>{c.typeLabel}</td>
                  <td>{c.dateDebut} → {c.dateFin}</td>
                  <td>{c.duree}j</td>
                  <td><StatutBadge statut={c.statut} label={c.statutLabel} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="emp-cg-overlay" onClick={() => setShowModal(false)}>
          <div className="emp-cg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="emp-cg-modal-header">
              <h2>Nouvelle demande de congé</h2>
              <button className="emp-cg-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="emp-cg-form">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleFormChange}>
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <label>Date de début</label>
              <input
                type="date"
                name="dateDebut"
                value={form.dateDebut}
                onChange={handleFormChange}
              />

              <label>Date de fin</label>
              <input
                type="date"
                name="dateFin"
                value={form.dateFin}
                onChange={handleFormChange}
              />

              <label>Motif (optionnel)</label>
              <textarea
                name="motif"
                rows={3}
                value={form.motif}
                onChange={handleFormChange}
                placeholder="Précisez le motif si nécessaire"
              />

              {formError && <div className="emp-cg-form-error">{formError}</div>}

              <div className="emp-cg-modal-actions">
                <button type="button" className="emp-cg-btn-cancel" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="emp-cg-btn-submit" disabled={submitting}>
                  {submitting ? 'Envoi...' : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}