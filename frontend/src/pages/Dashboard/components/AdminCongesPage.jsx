import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './AdminCongesPage.css';

export default function AdminCongesPage() {
  const [conges, setConges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('tous'); // 'tous', 'en_attente', 'approuve', 'refuse'
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    type: 'CONGE_ANNUEL',
    dateDebut: '',
    dateFin: '',
  });

  const loadConges = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/conges');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setConges(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setConges([]);
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
    loadConges();
    loadEmployees();
  }, []);

  const handleFilterClick = (status) => {
    setFilter(status);
  };

  const filteredConges = conges.filter((c) => {
    if (filter === 'tous') return true;
    return c.statut?.toLowerCase() === filter;
  });

  const handleCreateConge = async () => {
    if (!form.employeeId || !form.dateDebut || !form.dateFin) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const res = await apiFetch(`/conges/employee/${form.employeeId}`, {
        method: 'POST',
        body: JSON.stringify({
          type: form.type,
          dateDebut: form.dateDebut,
          dateFin: form.dateFin,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }

      await loadConges();
      setShowNewModal(false);
      setForm({
        employeeId: '',
        type: 'CONGE_ANNUEL',
        dateDebut: '',
        dateFin: '',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleApprove = async (congeId) => {
    if (!window.confirm('Approuver ce congé ?')) return;

    try {
      const res = await apiFetch(`/conges/${congeId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ commentaire: '' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }

      await loadConges();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleReject = async (congeId) => {
    if (!window.confirm('Refuser ce congé ?')) return;

    try {
      const res = await apiFetch(`/conges/${congeId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ commentaire: '' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }

      await loadConges();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? `${emp.prenom} ${emp.nom}` : 'Employé inconnu';
  };

  const getDuree = (debut, fin) => {
    if (!debut || !fin) return 0;
    const start = new Date(debut);
    const end = new Date(fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const getStatusColor = (statut) => {
    switch (statut?.toUpperCase()) {
      case 'EN_ATTENTE':
        return '#fbbf24';
      case 'APPROUVE':
        return '#10b981';
      case 'REFUSE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (statut) => {
    if (!statut) return '—';
    return statut.replace(/_/g, ' ').charAt(0).toUpperCase() + statut.slice(1).toLowerCase();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#0f172a', fontSize: '1.5rem' }}>Congés & Absences</h2>
        <p style={{ color: '#475569', margin: 0 }}>Gestion des demandes de congés</p>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleFilterClick('tous')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: filter === 'tous' ? '#6366f1' : '#e5e7eb',
              color: filter === 'tous' ? '#fff' : '#374151',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Tous
          </button>
          <button
            onClick={() => handleFilterClick('en_attente')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: filter === 'en_attente' ? '#f59e0b' : '#e5e7eb',
              color: filter === 'en_attente' ? '#fff' : '#374151',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            En attente
          </button>
          <button
            onClick={() => handleFilterClick('approuve')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: filter === 'approuve' ? '#10b981' : '#e5e7eb',
              color: filter === 'approuve' ? '#fff' : '#374151',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Approuvés
          </button>
          <button
            onClick={() => handleFilterClick('refuse')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: filter === 'refuse' ? '#ef4444' : '#e5e7eb',
              color: filter === 'refuse' ? '#fff' : '#374151',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Refusés
          </button>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#6366f1',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          + Nouvelle demande
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Chargement...</div>
      ) : filteredConges.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            color: '#9ca3af',
          }}
        >
          Aucun congé trouvé
        </div>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            background: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Employé
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Type
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Période
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Durée
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Statut
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredConges.map((conge) => (
                <tr key={conge.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    <strong>{getEmployeeName(conge.employee?.id || conge.employeeId)}</strong>
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {conge.typeLabel || conge.type || '—'}
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {conge.dateDebut && conge.dateFin
                      ? `${new Date(conge.dateDebut).toLocaleDateString('fr-FR')} → ${new Date(
                          conge.dateFin
                        ).toLocaleDateString('fr-FR')}`
                      : '—'}
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {getDuree(conge.dateDebut, conge.dateFin)}j
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        background: getStatusColor(conge.statut),
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {getStatusLabel(conge.statut)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {conge.statut?.toUpperCase() === 'EN_ATTENTE' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(conge.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            background: '#10b981',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          ✓ Approuver
                        </button>
                        <button
                          onClick={() => handleReject(conge.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            background: '#ef4444',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    )}
                    {conge.statut?.toUpperCase() !== 'EN_ATTENTE' && <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Nouvelle demande de congé</h3>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ✖
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Employé *
                </label>
                <select
                  value={form.employeeId}
                  onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">Sélectionner un employé</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.prenom} {emp.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="CONGE_ANNUEL">Congé annuel</option>
                  <option value="CONGE_MALADIE">Congé maladie</option>
                  <option value="AUTORISATION_EXCEPTIONNELLE">Autorisation exceptionnelle</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Date début *
                </label>
                <input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Date fin *
                </label>
                <input
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  background: '#f3f4f6',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateConge}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
