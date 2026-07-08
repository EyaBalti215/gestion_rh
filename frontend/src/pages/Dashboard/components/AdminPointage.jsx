import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';

export default function AdminPointage() {
  const [pointages, setPointages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const presentsCount = pointages.filter((p) => p.sortie).length;
  const absentsCount = employees.length - pointages.length;
  const onLeaveCount = 0;

  const formatTime = (time) => {
    if (!time) return '—';
    const date = new Date(time);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotal = (entree, sortie) => {
    if (!entree || !sortie) return '—';
    const start = new Date(entree);
    const end = new Date(sortie);
    const diffMs = end - start;
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
                      >
                        ✏️ Ajuster
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}