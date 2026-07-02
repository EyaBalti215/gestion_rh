import React, { useEffect, useState } from 'react';
import './EmployeePointage.css';

const API_BASE = 'http://localhost:8080/api/pointage';

const formatTime = (value) => {
  if (!value) return '—';
  return value.toString().slice(0, 5);
};

const mapStatutLabel = (statut) => {
  switch (statut) {
    case 'PRESENT': return 'Présent';
    case 'EN_COURS': return 'En cours';
    case 'ABSENT': return 'Absent';
    case 'CONGE': return 'En congé';
    default: return statut || 'N/A';
  }
};

export default function EmployeePointage({ employeeId }) {
  const [todayPointage, setTodayPointage] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAujourdhui = async () => {
    if (!employeeId) return;
    setError('');
    try {
      const res = await fetch(`${API_BASE}/aujourdhui/${employeeId}`);
      if (!res.ok) throw new Error('Impossible de charger le pointage du jour.');
      const data = await res.json();
      setTodayPointage(data || null);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchHistorique = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`${API_BASE}/historique/${employeeId}`);
      if (!res.ok) throw new Error('Impossible de charger l\'historique.');
      const data = await res.json();
      setHistorique(data || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchAujourdhui(), fetchHistorique()]);
      setLoading(false);
    };
    load();
  }, [employeeId]);

  const handleAction = async () => {
    if (!employeeId || actionLoading) return;
    setError('');
    setActionLoading(true);

    const url = todayPointage?.heureEntree && !todayPointage?.heureSortie
      ? `${API_BASE}/sortie/${employeeId}`
      : `${API_BASE}/entree/${employeeId}`;

    try {
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Erreur lors de l\'enregistrement.');
      }
      const data = await res.json();
      setTodayPointage(data);
      await fetchHistorique();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabel = () => {
    if (!todayPointage) return 'Enregistrer mon entrée';
    if (todayPointage.heureEntree && !todayPointage.heureSortie) return 'Enregistrer ma sortie';
    return 'Pointage du jour complété';
  };

  return (
    <div className="emp-pointage-root">
      <section className="emp-pointage-header">
        <div>
          <h2>Mon pointage</h2>
          <p>Enregistrez votre entrée et votre sortie. Le statut et les heures sont sauvegardés en base.</p>
        </div>
      </section>

      <section className="emp-pointage-card">
        <div className="emp-pointage-status">
          <div>
            <span>Entrée</span>
            <strong>{formatTime(todayPointage?.heureEntree)}</strong>
          </div>
          <div>
            <span>Sortie</span>
            <strong>{formatTime(todayPointage?.heureSortie)}</strong>
          </div>
          <div>
            <span>Statut</span>
            <strong>{mapStatutLabel(todayPointage?.statut)}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{todayPointage?.totalHeures != null ? `${todayPointage.totalHeures} h` : '—'}</strong>
          </div>
        </div>

        <button
          className="emp-pointage-action"
          onClick={handleAction}
          disabled={actionLoading || (todayPointage?.heureSortie != null)}
        >
          {actionLoading ? 'Enregistrement…' : actionLabel()}
        </button>

        {error && <div className="emp-pointage-error">{error}</div>}
      </section>

      <section className="emp-pointage-history">
        <div className="emp-pointage-history-header">
          <h3>Historique récent</h3>
          <span>{historique.length} entrée(s)</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Entrée</th>
              <th>Sortie</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Chargement...</td></tr>
            ) : historique.length === 0 ? (
              <tr><td colSpan="5">Aucun pointage enregistré.</td></tr>
            ) : (
              historique.map((item) => (
                <tr key={`${item.datePointage}-${item.id}`}>
                  <td>{item.datePointage}</td>
                  <td>{formatTime(item.heureEntree)}</td>
                  <td>{formatTime(item.heureSortie)}</td>
                  <td>{item.totalHeures != null ? `${item.totalHeures} h` : '—'}</td>
                  <td>{mapStatutLabel(item.statut)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
