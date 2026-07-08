import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

export default function MesConges() {
  const { user } = useAuth();
  const employeeId = user?.id ?? user?.employeeId;
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState({
    type: 'CONGE_ANNUEL',
    dateDebut: '',
    dateFin: '',
  });

  const loadConges = async () => {
    if (!employeeId) {
      setConges([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/conges/employee/${employeeId}`);
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

  useEffect(() => {
    loadConges();
  }, [employeeId]);

  const handleCreateConge = async () => {
    if (!employeeId) {
      alert('Impossible de créer une demande : utilisateur non identifié.');
      return;
    }

    if (!form.dateDebut || !form.dateFin) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const res = await apiFetch(`/conges/employee/${employeeId}`, {
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
        type: 'CONGE_ANNUEL',
        dateDebut: '',
        dateFin: '',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
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
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: '0.75rem', color: '#0f172a', fontSize: '1.5rem', margin: 0 }}>Mes Congés</h2>
          <p style={{ color: '#475569', margin: 0 }}>Mes demandes de congés et leur statut</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
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
      ) : conges.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            color: '#9ca3af',
          }}
        >
          Aucune demande de congé. Créez votre première demande !
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
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Période</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Durée</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {conges.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    <strong>{c.typeLabel || c.type || '—'}</strong>
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {c.dateDebut && c.dateFin
                      ? `${new Date(c.dateDebut).toLocaleDateString('fr-FR')} → ${new Date(
                          c.dateFin
                        ).toLocaleDateString('fr-FR')}`
                      : '—'}
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {getDuree(c.dateDebut, c.dateFin)}j
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        background: getStatusColor(c.statut),
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {getStatusLabel(c.statut)}
                    </span>
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