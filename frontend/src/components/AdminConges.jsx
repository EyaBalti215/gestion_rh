import React, { useEffect, useState } from 'react';
import './MesConges.css';

const API_BASE = 'http://localhost:8080/api/conges';

function StatutBadge({ statut, label }) {
  const cls =
    statut === 'APPROUVE' ? 'emp-cg-badge-approuve' :
    statut === 'REFUSE' ? 'emp-cg-badge-refuse' : 'emp-cg-badge-attente';
  return <span className={`emp-cg-statut ${cls}`}>{label}</span>;
}

export default function AdminConges() {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const parseJsonResponse = async (response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const fetchConges = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data?.message || 'Erreur lors du chargement des demandes.');
      setConges(data || []);
    } catch (e) {
      setError(e.message || 'Impossible de charger les congés.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const handleDecision = async (congeId, action) => {
    setActionLoading((prev) => ({ ...prev, [congeId]: true }));
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${congeId}/${action}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentaire: action === 'approve' ? 'Approuvé par l\'administrateur' : 'Refusé par l\'administrateur' }),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data?.message || 'Erreur lors de la mise à jour du congé.');
      }
      await fetchConges();
    } catch (e) {
      setError(e.message || 'Impossible de mettre à jour le congé.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [congeId]: false }));
    }
  };

  return (
    <div className="emp-cg-wrapper">
      <div className="emp-cg-toolbar">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Demandes de congés</h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Toutes les demandes soumises par les employés.</p>
        </div>
      </div>

      {error && <div className="emp-cg-error">{error}</div>}

      <div className="emp-cg-table-card">
        <table className="emp-cg-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Type</th>
              <th>Période</th>
              <th>Durée</th>
              <th>Statut</th>
              <th>Commentaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="emp-cg-empty">Chargement...</td></tr>
            ) : conges.length === 0 ? (
              <tr><td colSpan={7} className="emp-cg-empty">Aucune demande de congé</td></tr>
            ) : (
              conges.map((c) => (
                <tr key={c.id}>
                  <td>{c.employeeNom}</td>
                  <td>{c.typeLabel}</td>
                  <td>{c.dateDebut} → {c.dateFin}</td>
                  <td>{c.duree}j</td>
                  <td><StatutBadge statut={c.statut} label={c.statutLabel} /></td>
                  <td>{c.commentaireAdmin || '-'}</td>
                  <td>
                    {c.statut === 'EN_ATTENTE' ? (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className="emp-cg-btn-submit"
                          type="button"
                          disabled={actionLoading[c.id]}
                          onClick={() => handleDecision(c.id, 'approve')}
                        >
                          {actionLoading[c.id] ? '...' : 'Approuver'}
                        </button>
                        <button
                          className="emp-cg-btn-cancel"
                          type="button"
                          disabled={actionLoading[c.id]}
                          onClick={() => handleDecision(c.id, 'reject')}
                        >
                          {actionLoading[c.id] ? '...' : 'Refuser'}
                        </button>
                      </div>
                    ) : ('-')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
