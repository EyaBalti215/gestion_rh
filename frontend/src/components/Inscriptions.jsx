import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import '../pages/Dashboard/components/Inscriptions.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Inscriptions() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const normalizeStatus = (statut) => {
    if (!statut) return 'Unknown';
    if (statut.toUpperCase().includes('ATTENTE')) return 'En attente';
    if (statut.toUpperCase().includes('VALIDE')) return 'Approuvée';
    if (statut.toUpperCase().includes('REJET')) return 'Refusée';
    return statut;
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/employees');
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setAllEmployees(data);
      setPending(data.filter((d) => ['EN_ATTENTE', 'ATTENTE', 'pending', 'En attente'].includes(d.statut) || ['pending'].includes(d.status)));
    } catch (e) {
      console.error(e);
      setAllEmployees([]);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      const endpoint = status === 'approved' ? 'valider' : 'refuser';
      const res = await fetch(`${API_BASE}/employees/${id}/${endpoint}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Erreur serveur');
      await load();
    } catch (e) {
      console.error(e);
      alert('Impossible d\'effectuer l\'action');
    }
  };

  const filtered = pending.filter((it) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return [it.prenom, it.nom, it.email, it.login, it.poste, it.typeContrat].some((value) =>
      value?.toLowerCase().includes(query)
    );
  });

  const counts = {
    pending: allEmployees.filter((it) => ['EN_ATTENTE', 'ATTENTE', 'pending', 'En attente'].includes(it.statut) || ['pending'].includes(it.status)).length,
    approved: allEmployees.filter((it) => ['VALIDE', 'VALIDÉ', 'VALIDÉE', 'Approuvée', 'Valide'].includes(it.statut) || ['approved'].includes(it.status)).length,
    refused: allEmployees.filter((it) => ['REJETE', 'REFUSE', 'REFUSÉ', 'Refusée', 'Refusé'].includes(it.statut) || ['rejected'].includes(it.status)).length,
  };

  return (
    <div className="inscriptions-page">
      <div className="insc-stats">
        <div className="insc-stat-card pending">
          <div className="stat-number">{counts.pending}</div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="insc-stat-card approved">
          <div className="stat-number">{counts.approved}</div>
          <div className="stat-label">Approuvées</div>
        </div>
        <div className="insc-stat-card refused">
          <div className="stat-number">{counts.refused}</div>
          <div className="stat-label">Refusées</div>
        </div>
      </div>

      <div className="insc-panel">
        <div className="insc-panel-header">
          <h2>Demandes en attente de validation</h2>
          <div className="insc-search-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
          </div>
        </div>

        {loading ? (
          <div className="insc-loading">Chargement...</div>
        ) : (
          <div>
            {filtered.length === 0 ? (
              <div className="insc-empty">Aucune inscription en attente.</div>
            ) : (
              <div>
                {filtered.map((it) => (
                  <div key={it.id} className="insc-row">
                    <div className="insc-avatar" style={{ background: '#' + (Math.random().toString(16).slice(2, 8)) }}>
                      {it.prenom?.[0]}{it.nom?.[0]}
                    </div>
                    <div className="insc-info">
                      <div className="insc-name">{it.prenom} {it.nom}</div>
                      <div className="insc-role">{it.poste} — {it.typeContrat || 'CDI'}</div>
                      <div className="insc-email">{it.email}</div>
                    </div>
                    <div className="insc-date">
                      <span className="insc-date-label">Soumis le</span>
                      <strong className="insc-date-value">{new Date(it.createdAt || it.date || Date.now()).toLocaleDateString('fr-FR')}</strong>
                    </div>
                    <div className="insc-actions">
                      <button className="btn-voir">Voir</button>
                      <button className="btn-valider" onClick={() => setStatus(it.id, 'approved')}>Valider</button>
                      <button className="btn-refuser" onClick={() => setStatus(it.id, 'rejected')}>Refuser</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

