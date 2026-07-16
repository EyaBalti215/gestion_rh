import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useAuth } from "../../../hooks/useAuth";
import "./Profile.css";

/**
 * Page de profil commune à l'Admin et à l'Employé.
 * Placez ce fichier par ex. dans: src/pages/Dashboard/components/Profile.jsx
 * et le CSS associé: src/pages/Dashboard/components/Profile.css
 *
 * Ajoutez la route dans votre fichier de routes (voir note en bas de réponse).
 */
export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({ telephone: "", adresse: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    if (!user?.email) {
      setError("Adresse e-mail utilisateur introuvable.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
      setProfile(res.data);
      setForm({
        telephone: res.data.telephone || "",
        adresse: res.data.adresse || "",
      });
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await api.put(`/profile?email=${encodeURIComponent(user.email)}`, form);
      setProfile(res.data);
      setEditing(false);
      setSuccessMsg("Profil mis à jour avec succès.");
    } catch (err) {
      console.error(err);
      setError("La mise à jour a échoué. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      telephone: profile.telephone || "",
      adresse: profile.adresse || "",
    });
    setEditing(false);
    setError("");
  };

  const getInitials = (nom, prenom) => {
    const n = nom ? nom.charAt(0) : "";
    const p = prenom ? prenom.charAt(0) : "";
    return (p + n).toUpperCase() || "?";
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Chargement du profil...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-error-block">
          <p>{error}</p>
          <button onClick={fetchProfile} className="btn btn-secondary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mon profil</h1>
        <p className="profile-subtitle">
          Consultez et gérez vos informations personnelles
        </p>
      </div>

      <div className="profile-card">
        <div className="profile-card-top">
          <div className="profile-avatar">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Photo de profil" />
            ) : (
              <span>{getInitials(profile.nom, profile.prenom)}</span>
            )}
          </div>

          <div className="profile-identity">
            <h2>
              {profile.prenom} {profile.nom}
            </h2>
            <span className={`role-badge role-${(profile.role || "").toLowerCase()}`}>
              {profile.role === "ADMIN" ? "Administrateur" : "Employé"}
            </span>
            {profile.poste && <p className="profile-poste">{profile.poste}</p>}
          </div>
        </div>

        {successMsg && <div className="profile-success">{successMsg}</div>}
        {error && profile && <div className="profile-error">{error}</div>}

        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-grid">
            <div className="profile-field">
              <label>Prénom</label>
              <input type="text" value={profile.prenom || ""} disabled />
            </div>

            <div className="profile-field">
              <label>Nom</label>
              <input type="text" value={profile.nom || ""} disabled />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input type="email" value={profile.email || ""} disabled />
            </div>

            <div className="profile-field">
              <label>Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Ex: +216 12 345 678"
              />
            </div>

            <div className="profile-field profile-field-full">
              <label>Adresse</label>
              <input
                type="text"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Ex: Tunis, Tunisie"
              />
            </div>

            {profile.departement && (
              <div className="profile-field">
                <label>Département</label>
                <input type="text" value={profile.departement} disabled />
              </div>
            )}

            {profile.dateEmbauche && (
              <div className="profile-field">
                <label>Date d'embauche</label>
                <input
                  type="text"
                  value={new Date(profile.dateEmbauche).toLocaleDateString("fr-FR")}
                  disabled
                />
              </div>
            )}
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Modifier mes informations
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}