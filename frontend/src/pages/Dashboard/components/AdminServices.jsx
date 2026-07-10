import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import './AdminServices.css';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalType, setModalType] = useState('service'); // 'service' or 'facture'
  const [form, setForm] = useState({
    nom: '',
    type: '',
    prix: '',
    periodicite: 'Mensuel',
    dateRenouvellement: '',
    statut: 'Actif',
  });
  const [factureForm, setFactureForm] = useState({
    numero: '',
    serviceId: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    statut: 'Payée',
    description: '',
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/services');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFactures = async () => {
    try {
      const res = await apiFetch('/factures');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setFactures(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFactures([]);
    }
  };

  useEffect(() => {
    loadServices();
    loadFactures();
  }, []);

  const handleCreateService = async () => {
    if (!form.nom || !form.type || !form.prix) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      const url = editingId ? `/services/${editingId}` : '/services';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }

      await loadServices();
      setShowNewModal(false);
      setEditingId(null);
      setForm({
        nom: '',
        type: '',
        prix: '',
        periodicite: 'Mensuel',
        dateRenouvellement: '',
        statut: 'Actif',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleCreateFacture = async () => {
    if (!factureForm.numero || !factureForm.serviceId || !factureForm.montant) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      const payload = {
        numero: factureForm.numero,
        service: { id: parseInt(factureForm.serviceId) },
        montant: parseFloat(factureForm.montant),
        date: factureForm.date,
        statut: factureForm.statut,
        description: factureForm.description,
      };

      const url = editingId && modalType === 'facture' ? `/factures/${editingId}` : '/factures';
      const method = editingId && modalType === 'facture' ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        alert(err.error || 'Erreur');
        return;
      }

      await loadFactures();
      setShowNewModal(false);
      setEditingId(null);
      setFactureForm({
        numero: '',
        serviceId: '',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        statut: 'Payée',
        description: '',
      });
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const res = await apiFetch(`/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      await loadServices();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleDeleteFacture = async (factureId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return;

    try {
      const res = await apiFetch(`/factures/${factureId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Erreur lors de la suppression');
        return;
      }

      await loadFactures();
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    }
  };

  const handleEditService = (service) => {
    setForm({
      nom: service.nom,
      type: service.type,
      prix: service.prix,
      periodicite: service.periodicite,
      dateRenouvellement: service.dateRenouvellement,
      statut: service.statut,
    });
    setEditingId(service.id);
    setModalType('service');
    setShowNewModal(true);
  };

  const handleEditFacture = (facture) => {
    setFactureForm({
      numero: facture.numero,
      serviceId: facture.service?.id || '',
      montant: facture.montant,
      date: facture.date,
      statut: facture.statut,
      description: facture.description || '',
    });
    setEditingId(facture.id);
    setModalType('facture');
    setShowNewModal(true);
  };

  const openNewServiceModal = () => {
    setEditingId(null);
    setModalType('service');
    setForm({
      nom: '',
      type: '',
      prix: '',
      periodicite: 'Mensuel',
      dateRenouvellement: '',
      statut: 'Actif',
    });
    setShowNewModal(true);
  };

  const openNewFactureModal = () => {
    setEditingId(null);
    setModalType('facture');
    setFactureForm({
      numero: '',
      serviceId: '',
      montant: '',
      date: new Date().toISOString().split('T')[0],
      statut: 'Payée',
      description: '',
    });
    setShowNewModal(true);
  };

  const stats = {
    totalServices: services.length,
    activeServices: services.filter((s) => s.statut?.toLowerCase() === 'actif').length,
    monthlyFees: services.reduce((sum, s) => sum + (parseFloat(s.prix) || 0), 0),
  };

  return (
    <div className="services-page">
      <div className="services-header-row">
        <div className="services-stats">
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <p>Coût mensuel actif</p>
              <strong>{stats.monthlyFees.toFixed(2)} TND</strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <p>Services actifs</p>
              <strong>{stats.activeServices}</strong>
            </div>
          </div>
        </div>
        <button className="btn-new-service" onClick={() => {
          if (activeTab === 'services') openNewServiceModal();
          else openNewFactureModal();
        }}>
          ➕ Nouveau
        </button>
      </div>

      <div className="services-tabs">
        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`tab-btn ${activeTab === 'factures' ? 'active' : ''}`}
          onClick={() => setActiveTab('factures')}
        >
          Factures
        </button>
      </div>

      {activeTab === 'services' && (
        <div className="services-table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Type</th>
                <th>Prix</th>
                <th>Périodicité</th>
                <th>Renouvellement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Chargement...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="7">Aucun service trouvé</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="service-name">{service.nom}</td>
                    <td>{service.type}</td>
                    <td className="price">{service.prix} TND</td>
                    <td>
                      <span className="badge badge-info">{service.periodicite}</span>
                    </td>
                    <td>{service.dateRenouvellement || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          service.statut?.toLowerCase() === 'actif'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}
                      >
                        {service.statut}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditService(service)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteService(service.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'factures' && (
        <div className="factures-table-container">
          <table className="factures-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Service</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Chargement...</td>
                </tr>
              ) : factures.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucune facture trouvée</td>
                </tr>
              ) : (
                factures.map((facture) => (
                  <tr key={facture.id}>
                    <td className="facture-number"><strong>{facture.numero}</strong></td>
                    <td>{facture.service?.nom || 'N/A'}</td>
                    <td className="price">{facture.montant.toFixed(2)} TND</td>
                    <td>{new Date(facture.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`badge ${
                        facture.statut === 'Payée' ? 'badge-success' :
                        facture.statut === 'En attente' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {facture.statut}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditFacture(facture)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteFacture(facture.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'service' 
                  ? (editingId ? 'Modifier le service' : 'Ajouter un nouveau service')
                  : (editingId ? 'Modifier la facture' : 'Ajouter une nouvelle facture')
                }
              </h2>
              <button className="modal-close" onClick={() => setShowNewModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {modalType === 'service' ? (
                <>
                  <div className="form-group">
                    <label>Nom du service</label>
                    <input
                      type="text"
                      placeholder="Ex: Hébergement Serveur"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      placeholder="Ex: Hébergement, Domaine, Licence"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix (TND)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={form.prix}
                        onChange={(e) => setForm({ ...form, prix: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Périodicité</label>
                      <select
                        value={form.periodicite}
                        onChange={(e) => setForm({ ...form, periodicite: e.target.value })}
                      >
                        <option>Mensuel</option>
                        <option>Annuel</option>
                        <option>Trimestriel</option>
                        <option>Semestriel</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date de renouvellement</label>
                    <input
                      type="date"
                      value={form.dateRenouvellement}
                      onChange={(e) =>
                        setForm({ ...form, dateRenouvellement: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={form.statut}
                      onChange={(e) => setForm({ ...form, statut: e.target.value })}
                    >
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Numéro de facture</label>
                    <input
                      type="text"
                      placeholder="Ex: FAC-2026-0118"
                      value={factureForm.numero}
                      onChange={(e) => setFactureForm({ ...factureForm, numero: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Service</label>
                    <select
                      value={factureForm.serviceId}
                      onChange={(e) => setFactureForm({ ...factureForm, serviceId: e.target.value })}
                    >
                      <option value="">Sélectionner un service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Montant (TND)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={factureForm.montant}
                        onChange={(e) => setFactureForm({ ...factureForm, montant: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={factureForm.date}
                        onChange={(e) => setFactureForm({ ...factureForm, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={factureForm.statut}
                      onChange={(e) => setFactureForm({ ...factureForm, statut: e.target.value })}
                    >
                      <option>Payée</option>
                      <option>En attente</option>
                      <option>Annulée</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description (optionnel)</label>
                    <textarea
                      placeholder="Ajoutez une description..."
                      value={factureForm.description}
                      onChange={(e) => setFactureForm({ ...factureForm, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowNewModal(false)}>
                Annuler
              </button>
              <button 
                className="btn-save" 
                onClick={modalType === 'service' ? handleCreateService : handleCreateFacture}
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
