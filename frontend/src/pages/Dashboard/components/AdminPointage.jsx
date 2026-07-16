import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';

export default function AdminPointage() {
  const [pointages, setPointages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState(null);
  const [newStatus, setNewStatus] = useState('PRESENT');
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const loadPointages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/pointage/registre');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const pointagesData = Array.isArray(data) ? data : [];
      // Normaliser les champs venant du backend :
      // certains endpoints renvoient `heureEntree` / `heureSortie`,
      // d'autres `entree` / `sortie`. On mappe vers `entree`/`sortie`.
      const normalized = pointagesData.map((d) => ({
        ...d,
        entree: d.heureEntree ?? d.entree ?? null,
        sortie: d.heureSortie ?? d.sortie ?? null,
      }));
      setPointages(normalized);
    } catch (e) {
      console.error(e);
      setPointages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await apiFetch('/employees');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadPointages();
    loadEmployees();
  }, []);

  // Statistiques du jour
  const presentsCount = pointages.filter((p) => p.entree && p.sortie).length;
  const absentsCount = pointages.filter((p) => !p.entree).length;
  const onLeaveCount = 0;

  const parseTimeValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === 'string') {
      const timeOnly = value.match(/^(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?$/);
      if (timeOnly) {
        const date = new Date();
        date.setHours(parseInt(timeOnly[1], 10), parseInt(timeOnly[2], 10), timeOnly[3] ? parseInt(timeOnly[3], 10) : 0, 0);
        return date;
      }
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    if (typeof value === 'number') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }

    return null;
  };

  const formatTime = (time) => {
    const parsed = parseTimeValue(time);
    if (!parsed) return '—';
    return parsed.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotal = (entree, sortie) => {
    const start = parseTimeValue(entree);
    const end = parseTimeValue(sortie);
    if (!start || !end) return '—';
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return '—';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  };

  const getStatus = (pointage) => {
    if (!pointage.entree) return 'Absent';
    if (pointage.sortie) return 'Présent';
    return 'En cours';
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? `${emp.prenom} ${emp.nom}` : 'Employé inconnu';
  };

  const getPointageName = (pointage) => {
    if (pointage.prenom && pointage.nom) {
      return `${pointage.prenom} ${pointage.nom}`;
    }
    if (pointage.employee?.prenom && pointage.employee?.nom) {
      return `${pointage.employee.prenom} ${pointage.employee.nom}`;
    }
    return getEmployeeName(pointage.employee?.id || pointage.employeeId);
  };

  const getPointageInitials = (pointage) => {
    const prenom = pointage.employee?.prenom ?? pointage.prenom;
    const nom = pointage.employee?.nom ?? pointage.nom;
    return `${prenom?.[0]?.toUpperCase() || ''}${nom?.[0]?.toUpperCase() || ''}`;
  };

  const openEditModal = (pointage) => {
    setSelectedPointage(pointage);
    setNewStatus(pointage.statut === 'ABSENT' ? 'ABSENT' : 'PRESENT');
    setShowEditModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedPointage) return;
    try {
      const res = await apiFetch(`/pointage/registre/${selectedPointage.employeeId}/statut`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Erreur de mise à jour');
      }
      await loadPointages();
      setShowEditModal(false);
      setSelectedPointage(null);
    } catch (e) {
      console.error(e);
      alert('Impossible de modifier le statut : ' + e.message);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#0f172a', fontSize: '1.5rem' }}>Pointage & Présences</h2>
        <p style={{ color: '#475569', margin: 0 }}>Suivi des entrées et sorties des employés</p>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#d1fae5', borderRadius: '0.5rem', border: '1px solid #6ee7b7' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{presentsCount}</div>
          <div style={{ color: '#047857', fontSize: '0.875rem' }}>Présents</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{absentsCount}</div>
          <div style={{ color: '#991b1b', fontSize: '0.875rem' }}>Absents</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{onLeaveCount}</div>
          <div style={{ color: '#92400e', fontSize: '0.875rem' }}>En congé</div>
        </div>
      </div>

      {/* Titre du registre */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#0f172a', fontSize: '1.25rem', margin: 0 }}>
          Registre du jour — {today.charAt(0).toUpperCase() + today.slice(1)}
        </h3>
      </div>

      {/* Tableau */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Chargement...</div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Employé</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Entrée</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Sortie</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Total</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pointages.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                    Aucun pointage enregistré
                  </td>
                </tr>
              ) : (
                pointages.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', color: '#1f2937' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            background: '#' + (Math.random().toString(16).slice(2, 8)),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}
                        >
                          {p.employee?.prenom?.[0]?.toUpperCase()}{p.employee?.nom?.[0]?.toUpperCase()}
                        </div>
                        <strong>{getEmployeeName(p.employee?.id || p.employeeId)}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#1f2937' }}>{formatTime(p.entree)}</td>
                    <td style={{ padding: '1rem', color: '#1f2937' }}>{formatTime(p.sortie)}</td>
                    <td style={{ padding: '1rem', color: '#1f2937' }}>{calculateTotal(p.entree, p.sortie)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          background: getStatus(p) === 'Présent' ? '#d1fae5' : getStatus(p) === 'En cours' ? '#fef3c7' : '#fee2e2',
                          color: getStatus(p) === 'Présent' ? '#047857' : getStatus(p) === 'En cours' ? '#92400e' : '#991b1b',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        {getStatus(p)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          background: '#6366f1',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                        onClick={() => openEditModal(p)}
                      >
                        ✏️ Modifier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && selectedPointage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Modifier le statut</h3>
            <p style={{ color: '#475569' }}>
              {selectedPointage.prenom || selectedPointage.employee?.prenom} {selectedPointage.nom || selectedPointage.employee?.nom}
            </p>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 600 }}>
                Statut
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}
                >
                  <option value="PRESENT">Présent</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  style={{ padding: '0.75rem 1rem', border: 'none', borderRadius: '0.75rem', background: '#f3f4f6', color: '#0f172a', cursor: 'pointer' }}
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button
                  style={{ padding: '0.75rem 1rem', border: 'none', borderRadius: '0.75rem', background: '#4338ca', color: '#fff', cursor: 'pointer' }}
                  onClick={handleSaveStatus}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}