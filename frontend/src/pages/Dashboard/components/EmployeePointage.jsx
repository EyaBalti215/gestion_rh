import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

export default function EmployeePointage() {
  const { user } = useAuth();
  const employeeId = user?.id ?? user?.employeeId;
  const [time, setTime] = useState(new Date());
  const [entree, setEntree] = useState(null);
  const [sortie, setSortie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mise à jour de l'horloge
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const normalizePointage = (data) => {
    if (!data) return null;
    return {
      entree: data.heureEntree ?? data.entree ?? null,
      sortie: data.heureSortie ?? data.sortie ?? null,
    };
  };

  // Charger le pointage du jour
  useEffect(() => {
    const loadPointage = async () => {
      if (!employeeId) return;
      try {
        const res = await apiFetch(`/pointage/aujourdhui/${employeeId}`);
        if (res.ok) {
          const data = await res.json();
          const normalized = normalizePointage(data);
          if (normalized) {
            setEntree(normalized.entree);
            setSortie(normalized.sortie);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadPointage();
  }, [employeeId]);

  const handleEntree = async () => {
    if (!employeeId) {
      setMessage('Utilisateur non identifié.');
      return;
    }
    if (entree) {
      setMessage('Entrée déjà enregistrée');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/pointage/entree/${employeeId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizePointage(data);
        setEntree(normalized?.entree);
        setMessage('✓ Entrée enregistrée');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erreur');
      }
    } catch (e) {
      console.error(e);
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleSortie = async () => {
    if (!entree) {
      setMessage('Veuillez d\'abord enregistrer votre entrée');
      return;
    }
    if (sortie) {
      setMessage('Sortie déjà enregistrée');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/pointage/sortie/${employeeId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizePointage(data);
        setSortie(normalized?.sortie);
        setMessage('✓ Sortie enregistrée');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erreur');
      }
    } catch (e) {
      console.error(e);
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const date = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeString = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div
      style={{
        padding: '1.5rem',
        background: '#f9fafb',
        borderRadius: '0.5rem',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#0f172a', fontSize: '1.5rem', textAlign: 'center' }}>Pointage & Présences</h2>
        <p style={{ color: '#475569', margin: 0, textAlign: 'center' }}>Enregistrez votre entrée et sortie</p>
      </div>

      {/* Horloge */}
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '3rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
          marginBottom: '2rem',
          minWidth: '350px',
        }}
      >
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>
          {timeString}
        </div>
        <div style={{ color: '#6b7280', fontSize: '1rem', marginTop: '1rem', textTransform: 'capitalize' }}>
          {date}
        </div>

        {/* Entrée/Sortie */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ENTRÉE</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>
              {formatTime(entree)}
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>SORTIE</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>
              {formatTime(sortie)}
            </div>
          </div>
        </div>

        {/* Bouton d'enregistrement */}
        <button
          onClick={!entree || sortie ? handleEntree : handleSortie}
          disabled={loading}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#10b981',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            width: '100%',
          }}
        >
          {loading
            ? 'Enregistrement...'
            : !entree
            ? 'Enregistrer mon Entrée'
            : sortie
            ? 'Jour complété'
            : 'Enregistrer ma Sortie'}
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              background: message.includes('✓') ? '#d1fae5' : '#fee2e2',
              color: message.includes('✓') ? '#047857' : '#991b1b',
              fontSize: '0.875rem',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}