import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './Inscriptions.css';

export default function AdminEmployees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [search, setSearch] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    login: '',
    telephone: '',
    adresse: '',
    poste: '',
    typeContrat: 'CDI',
    modeReglement: 'Virement',
    rib: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/employees');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDetail = (emp) => {
    setDetailEmployee(emp);
  };

  const closeDetail = () => {
    setDetailEmployee(null);
  };

  const openEdit = (emp) => {
    setEditingEmployee(emp);
    setForm({
      prenom: emp.prenom || '',
      nom: emp.nom || '',
      email: emp.email || '',
      login: emp.login || '',
      telephone: emp.telephone || '',
      adresse: emp.adresse || '',
      poste: emp.poste || '',
      typeContrat: emp.typeContrat || 'CDI',
      modeReglement: emp.modeReglement || 'Virement',
      rib: emp.rib || '',
    });
    setShowEditModal(true);
    closeDetail();
  };

  const saveEdit = async () => {
    try {
      const res = await apiFetch(`/employees/${editingEmployee.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }
      await load();
      setShowEditModal(false);
      setEditingEmployee(null);
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const filteredItems = items.filter((it) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return [it.prenom, it.nom, it.email, it.login, it.poste, it.typeContrat, it.statut].some((value) =>
      value?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="inscriptions-page">
      <div className="insc-header-row">
        <div>
          <h1>Employés & RH</h1>
          <p>Liste des employés actifs dans le système</p>
        </div>
        <div className="insc-header-actions">
          <div className="insc-search-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="insc-loading">Chargement...</div>
      ) : (
        <div className="insc-card-grid">
          {filteredItems.map((it) => (
            <article className="insc-card" key={it.id}>
              <div className="insc-card-top">
                <div className="insc-avatar" style={{ background: '#' + (Math.random().toString(16).slice(2, 8)) }}>
                  {it.prenom?.[0]?.toUpperCase()}{it.nom?.[0]?.toUpperCase()}
                </div>
                <div className="insc-card-title">
                  <div className="insc-name">{it.prenom} {it.nom}</div>
                  <div className="insc-role">{it.poste} — {it.typeContrat || 'CDI'}</div>
                  <div className="insc-tags">
                    <div className="insc-pill contrat">{it.typeContrat || 'CDI'}</div>
                    <div className="insc-pill status">{it.statut ? it.statut.replace('_', ' ') : 'Actif'}</div>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', minWidth: 120 }}>
                  <div className="insc-date">
                    <span className="insc-date-label">Entrée</span>
                    <strong className="insc-date-value">{it.createdAt ? new Date(it.createdAt).toLocaleDateString('fr-FR') : '—'}</strong>
                  </div>
                </div>
              </div>

              <div className="insc-card-body">
                <div className="insc-card-row"><span>Email</span><strong>{it.email || '—'}</strong></div>
                <div className="insc-card-row"><span>Téléphone</span><strong>{it.telephone || '—'}</strong></div>
                <div className="insc-card-row"><span>Adresse</span><strong>{it.adresse || '—'}</strong></div>
                <div className="insc-card-row"><span>Règlement</span><strong>{it.modeReglement || 'Virement'}</strong></div>
              </div>

              <div className="insc-card-actions">
                <button className="btn-voir" onClick={() => openDetail(it)}>Détails</button>
                <button className="btn-edit" onClick={() => openEdit(it)}>Modifier</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {detailEmployee && (
        <div className="modal-overlay">
          <div className="modal-card modal-form-card">
            <button className="modal-close" onClick={closeDetail}>✖</button>
            <div style={{ width: '100%', marginBottom: '1.5rem' }}>
              <h3 className="modal-form-header">Détail de l'employé</h3>
              <div className="modal-header">
                <div className="modal-avatar" style={{ background: '#4338ca' }}>
                  {detailEmployee.prenom?.[0]?.toUpperCase()}{detailEmployee.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="modal-name">{detailEmployee.prenom} {detailEmployee.nom}</h4>
                  <p className="modal-role">{detailEmployee.poste || 'Poste non défini'} — {detailEmployee.typeContrat || 'CDI'}</p>
                </div>
              </div>
            </div>
            <div className="modal-grid">
              <div className="modal-field"><span>Email</span><strong>{detailEmployee.email || '—'}</strong></div>
              <div className="modal-field"><span>Login</span><strong>{detailEmployee.login || '—'}</strong></div>
              <div className="modal-field"><span>Téléphone</span><strong>{detailEmployee.telephone || '—'}</strong></div>
              <div className="modal-field"><span>Adresse</span><strong>{detailEmployee.adresse || '—'}</strong></div>
              <div className="modal-field"><span>Statut</span><strong>{detailEmployee.statut || '—'}</strong></div>
              <div className="modal-field"><span>Date d'entrée</span><strong>{detailEmployee.createdAt ? new Date(detailEmployee.createdAt).toLocaleDateString('fr-FR') : '—'}</strong></div>
              <div className="modal-field"><span>Règlement</span><strong>{detailEmployee.modeReglement || '—'}</strong></div>
              <div className="modal-field"><span>RIB</span><strong>{detailEmployee.rib || '—'}</strong></div>
            </div>
            <div className="modal-actions">
              <button onClick={closeDetail}>Fermer</button>
              <button className="insc-create-button" onClick={() => openEdit(detailEmployee)}>Modifier</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingEmployee && (
        <div className="modal-overlay">
          <div className="modal-card modal-form-card">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>✖</button>
            <h3 className="modal-form-header">Modifier Employé</h3>
            <div className="modal-form-grid">
              <div className="form-field">
                <label>Prénom</label>
                <input
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Nom</label>
                <input
                  placeholder="Nom"
                  value={form.nom}
                  onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Login</label>
                <input
                  placeholder="Login"
                  value={form.login}
                  onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Téléphone</label>
                <input
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Adresse</label>
                <input
                  placeholder="Adresse"
                  value={form.adresse}
                  onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Poste</label>
                <input
                  placeholder="Poste"
                  value={form.poste}
                  onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Contrat</label>
                <select value={form.typeContrat} onChange={(e) => setForm((f) => ({ ...f, typeContrat: e.target.value }))}>
                  <option>CDI</option>
                  <option>CDD</option>
                </select>
              </div>
              <div className="form-field">
                <label>Mode de règlement</label>
                <select value={form.modeReglement} onChange={(e) => setForm((f) => ({ ...f, modeReglement: e.target.value }))}>
                  <option>Virement</option>
                  <option>Espèces</option>
                </select>
              </div>
              <div className="form-field">
                <label>RIB / IBAN</label>
                <input
                  placeholder="RIB / IBAN"
                  value={form.rib}
                  onChange={(e) => setForm((f) => ({ ...f, rib: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Annuler</button>
              <button className="insc-create-button" onClick={saveEdit}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
