import React, { useEffect, useState } from 'react';
import './AdminPointage.css';

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

export default function AdminPointage() {
  const [registre, setRegistre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const fetchRegistre = async (selectedDate) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/registre?date=${selectedDate}`);
      if (!res.ok) throw new Error('Impossible de charger le registre.');
      const data = await res.json();
      setRegistre(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistre(date);
  }, [date]);

  return (
    <div className="admin-pointage-root">
      <header className="admin-pointage-header">
        <div>
          <h2>Registre de pointage</h2>
          <p>Visualisez le pointage de vos employés pour la date sélectionnée.</p>
        </div>
        <div className="admin-pointage-date">
          <label htmlFor="registre-date">Date</label>
          <input
            id="registre-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>

      {error && <div className="admin-pointage-error">{error}</div>}

      <div className="admin-pointage-table-card">
        <table>
          <thead>
            <tr>
              <th>Employé</th>
              <th>Entrée</th>
              <th>Sortie</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Chargement...</td></tr>
            ) : registre.length === 0 ? (
              <tr><td colSpan="5">Aucun pointage trouvé pour cette date.</td></tr>
            ) : (
              registre.map((item) => (
                <tr key={`${item.employeeId}-${item.datePointage}`}>
                  <td>{item.prenom || ''} {item.nom || ''}</td>
                  <td>{formatTime(item.heureEntree)}</td>
                  <td>{formatTime(item.heureSortie)}</td>
                  <td>{item.totalHeures != null ? `${item.totalHeures} h` : '—'}</td>
                  <td>{mapStatutLabel(item.statut)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
