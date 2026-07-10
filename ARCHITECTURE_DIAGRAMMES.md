# 🏗️ Architecture Technique - Services & Factures

## 🎯 Vue d'Ensemble Globale

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        HRFlow Gestion RH v2.0                           │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
          ┌─────▼──────┐        ┌────▼────┐         ┌──────▼────┐
          │  FRONTEND   │        │ BACKEND  │         │ DATABASE  │
          │   React     │        │Spring Boot│        │  MySQL 8  │
          │   Vite      │        │  Java    │        │  (Docker) │
          └──────┬──────┘        └────┬─────┘        └──────┬─────┘
                 │                    │                      │
                 │                    │                      │
          ┌──────┴────────┐   ┌───────┴────────┐   ┌────────┴────────┐
          │                │   │                │   │                 │
    ┌─────▼────┐    ┌─────▼──┐   ┌──────▼──┐   │  ┌──────▼──────┐  │
    │AdminSrv. │    │Fourniss│   │Factures │   │  │ Services    │  │
    │Component │    │Component   │Component │   │  │ Table       │  │
    └──────────┘    └────────┘   └─────────┘   │  └─────────────┘  │
                                                │                   │
                                          ┌─────▼────┐       ┌──────▼──────┐
                                          │Factures  │       │Fournisseurs │
                                          │Table     │       │Table        │
                                          └──────────┘       └─────────────┘
```

---

## 📊 Flux de Données - Factures

```
┌─────────────────────────┐
│  Frontend (AdminSrv.jsx)│
│  - loadFactures()       │
│  - handleCreateFacture()│
│  - handleDeleteFacture()│
└────────────┬────────────┘
             │
             │ HTTP (apiFetch)
             │
             ▼
┌─────────────────────────────────┐
│ Backend API (/api/factures)     │
│ FactureController               │
│ - GET /api/factures             │
│ - POST /api/factures            │
│ - PUT /api/factures/{id}        │
│ - DELETE /api/factures/{id}     │
└────────────┬────────────────────┘
             │
             │ JPA
             │
             ▼
┌─────────────────────────────────┐
│ FactureRepository               │
│ - findAll()                     │
│ - save(facture)                 │
│ - deleteById(id)                │
│ - findByNumero(numero)          │
└────────────┬────────────────────┘
             │
             │ SQL
             │
             ▼
┌─────────────────────────────────┐
│ MySQL Database                  │
│ Table: factures                 │
│ - id (PK)                       │
│ - numero (UNIQUE)               │
│ - montant                       │
│ - date                          │
│ - statut                        │
│ - service_id (FK)               │
└─────────────────────────────────┘
```

---

## 🔄 Relationship Entity Diagram

```
┌──────────────────────┐
│      Service         │
├──────────────────────┤
│ id (PK)              │
│ nom                  │
│ type                 │
│ prix                 │
│ periodicite          │
│ dateRenouvellement   │
│ statut               │
└──────────────────────┘
           ▲
           │ 1
           │
           │
        1:N │
           │
           │ M
           │
┌──────────▼──────────┐
│      Facture        │
├─────────────────────┤
│ id (PK)             │
│ numero (UNIQUE)     │
│ montant             │
│ date                │
│ statut              │
│ description         │
│ service_id (FK) ────┤
└─────────────────────┘
```

---

## 🎨 Frontend Component Hierarchy

```
AdminServices.jsx
├── Header (Statistiques)
│   ├── Coût mensuel actif
│   └── Services actifs
├── Tabs Navigation
│   ├── Services Tab
│   │   ├── Tableau Services
│   │   │   ├── Colonne Nom
│   │   │   ├── Colonne Type
│   │   │   ├── Colonne Prix
│   │   │   ├── Colonne Périodicité
│   │   │   ├── Colonne Renouvellement
│   │   │   ├── Colonne Statut
│   │   │   └── Colonne Actions
│   │   │       ├── ✏️ Modifier
│   │   │       └── 🗑️ Supprimer
│   │   └── Bouton "➕ Nouveau"
│   │
│   └── Factures Tab
│       ├── Tableau Factures
│       │   ├── Colonne Numéro
│       │   ├── Colonne Service
│       │   ├── Colonne Montant
│       │   ├── Colonne Date
│       │   ├── Colonne Statut (Badge)
│       │   │   ├── ✅ Payée (vert)
│       │   │   ├── ⏳ En attente (orange)
│       │   │   └── ❌ Annulée (rouge)
│       │   └── Colonne Actions
│       │       ├── ✏️ Modifier
│       │       └── 🗑️ Supprimer
│       └── Bouton "➕ Nouveau"
│
└── Modal (Service ou Facture)
    ├── Mode Service
    │   ├── Input Nom
    │   ├── Select Type
    │   ├── Input Prix
    │   ├── Select Périodicité
    │   ├── Input Date Renouvellement
    │   ├── Select Statut
    │   └── Boutons (Ajouter/Modifier/Annuler)
    │
    └── Mode Facture
        ├── Input Numéro
        ├── Select Service
        ├── Input Montant
        ├── Input Date
        ├── Select Statut
        ├── Input Description
        └── Boutons (Ajouter/Modifier/Annuler)

AdminFournisseurs.jsx
├── Header (Statistiques)
│   ├── Total Charges
│   └── Charges Réglées
├── Grille Cartes (CSS Grid)
│   └── FournisseurCard (répété)
│       ├── Card Header
│       │   ├── Type Emoji (📦📞🏢⚡)
│       │   └── Status Badge (✓ Actif/❌ Inactif)
│       ├── Card Body
│       │   ├── Titre (Nom Fournisseur)
│       │   ├── Type
│       │   └── Contacts
│       │       ├── ✉️ Email
│       │       └── 📞 Téléphone
│       └── Card Footer
│           ├── 👁️ Bouton Charges
│           └── ✏️ Bouton Modifier
│
├── Modal Charges (Tableau)
│   ├── Colonne Désignation
│   ├── Colonne Fournisseur
│   ├── Colonne Montant
│   ├── Colonne Date
│   └── Colonne Statut
│
└── Modal Création/Édition
    ├── Input Nom
    ├── Select Type
    ├── Input Email
    ├── Input Téléphone
    ├── Input Adresse
    ├── Select Statut
    └── Boutons
```

---

## 🌐 API Endpoints Map

```
GET  /api/factures
      ↓ Retourne liste de factures avec services chargés
      
GET  /api/factures/{id}
      ↓ Retourne une facture spécifique
      
GET  /api/factures/service/{serviceId}
      ↓ Retourne factures filtrées par service
      
POST /api/factures
      ↓ Corps: { numero, serviceId, montant, date, statut, description }
      ↓ Validations: numero unique, service exists, montant > 0
      
PUT  /api/factures/{id}
      ↓ Corps: { champs à modifier }
      ↓ Supporte updates partiels
      
DELETE /api/factures/{id}
      ↓ Supprime la facture

────────────────────────────────────

GET  /api/services
      ↓ Retourne tous les services
      
GET  /api/services/{id}
      ↓ Retourne un service spécifique
      
POST /api/services
      ↓ Crée un service
      
PUT  /api/services/{id}
      ↓ Modifie un service
      
DELETE /api/services/{id}
      ↓ Supprime un service

────────────────────────────────────

GET  /api/fournisseurs
      ↓ Retourne tous les fournisseurs
      
GET  /api/fournisseurs/{id}
      ↓ Retourne un fournisseur spécifique
      
POST /api/fournisseurs
      ↓ Crée un fournisseur
      
PUT  /api/fournisseurs/{id}
      ↓ Modifie un fournisseur
      
DELETE /api/fournisseurs/{id}
      ↓ Supprime un fournisseur
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 640px)
├── Factures: 1 colonne
├── Fournisseurs: 1 carte par ligne
└── Modal: Pleine largeur

Tablet (640px - 1024px)
├── Factures: 1-2 colonnes
├── Fournisseurs: 2 cartes par ligne
└── Modal: 80% largeur

Desktop (> 1024px)
├── Factures: Tableau complet
├── Fournisseurs: 3-4 cartes par ligne (minmax 320px)
└── Modal: 600-800px largeur
```

---

## 🎨 Design System - Couleurs

```
┌─────────────────────────────────────────┐
│       PALETTE DE COULEURS PRINCIPALE    │
├─────────────────────────────────────────┤
│                                         │
│  ████  Indigo Principal: #4338ca        │
│  ████  Indigo Accent:    #6366f1        │
│  ████  Vert Succès:      #15803d        │
│  ████  Orange Avertiss:  #b45309        │
│  ████  Rouge Danger:     #b91c1c        │
│                                         │
└─────────────────────────────────────────┘

BADGES STATUT FACTURES:
┌──────────────────────────────────────────┐
│ Payée                                    │
│ ████ Fond:  #dcfce7 (vert clair)         │
│ ████ Text:  #15803d (vert foncé)         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ En attente                               │
│ ████ Fond:  #fef3c7 (orange clair)       │
│ ████ Text:  #b45309 (orange foncé)       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Annulée                                  │
│ ████ Fond:  #fee2e2 (rouge clair)        │
│ ████ Text:  #b91c1c (rouge foncé)        │
└──────────────────────────────────────────┘

STATUS FOURNISSEURS:
┌──────────────────────────────────────────┐
│ Actif (✓)                                │
│ ████ Fond:  #dcfce7 (vert clair)         │
│ ████ Text:  #15803d (vert foncé)         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Inactif (❌)                             │
│ ████ Fond:  #fee2e2 (rouge clair)        │
│ ████ Text:  #b91c1c (rouge foncé)        │
└──────────────────────────────────────────┘
```

---

## 🔄 State Management Flow

```
AdminServices.jsx
│
├── useState: [services, setServices]
│   └── Chargement depuis /api/services
│
├── useState: [factures, setFactures]
│   └── Chargement depuis /api/factures
│
├── useState: [activeTab, setActiveTab]
│   └── 'services' ou 'factures'
│
├── useState: [editingId, setEditingId]
│   └── null (nouveau) ou id (édition)
│
├── useState: [modalType, setModalType]
│   └── 'service' ou 'facture'
│
├── useState: [showNewModal, setShowNewModal]
│   └── true (afficher) ou false (caché)
│
├── useState: [form, setForm]
│   └── { nom, type, prix, ... }
│
└── useState: [factureForm, setFactureForm]
    └── { numero, serviceId, montant, date, statut, description }
```

---

## 🚀 Cycle de Vie - Création d'une Facture

```
1. Utilisateur clique "➕ Nouveau"
   │
   └─→ setShowNewModal(true)
       setModalType('facture')
       resetFormData

2. Utilisateur remplit le formulaire
   │
   └─→ handleInputChange() met à jour factureForm

3. Utilisateur clique "Ajouter"
   │
   └─→ handleCreateFacture()
       │
       ├─→ Validation côté client
       │   └─→ Si erreur: alert()
       │
       └─→ Sinon:
           └─→ apiFetch('/factures', {
               method: 'POST',
               body: JSON.stringify(factureForm)
             })

4. Backend reçoit la requête
   │
   └─→ FactureController.createFacture()
       │
       ├─→ Validation côté serveur
       │   ├─→ Numéro unique?
       │   ├─→ Service existe?
       │   └─→ Montant > 0?
       │
       └─→ Si valide:
           └─→ factures.save()
               └─→ MySQL INSERT

5. Réponse retour au frontend
   │
   └─→ Si succès (200):
       ├─→ setShowNewModal(false)
       ├─→ resetForm()
       └─→ loadFactures()
           └─→ Tableau se rafraîchit

   └─→ Si erreur:
       └─→ alert(message d'erreur)
```

---

## 📊 Schéma Base de Données

```sql
-- Services (existant)
CREATE TABLE services (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  prix DOUBLE,
  periodicite VARCHAR(50),
  date_renouvellement DATE,
  statut VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Factures (NOUVEAU)
CREATE TABLE factures (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(255) NOT NULL UNIQUE,
  montant DOUBLE NOT NULL CHECK (montant > 0),
  date DATE NOT NULL,
  statut VARCHAR(20) DEFAULT 'Payée',
  description VARCHAR(500),
  date_creation DATE DEFAULT CURRENT_DATE,
  service_id BIGINT NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services(id),
  CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fournisseurs (existant)
CREATE TABLE fournisseurs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  email VARCHAR(100),
  telephone VARCHAR(20),
  adresse VARCHAR(200),
  statut VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_facture_numero ON factures(numero);
CREATE INDEX idx_facture_service_id ON factures(service_id);
CREATE INDEX idx_facture_statut ON factures(statut);
```

---

## 🧪 Validation Rules

```
FACTURES:

Numéro:
├─ ✓ Obligatoire
├─ ✓ Doit être unique
├─ ✓ Type: String
└─ ✓ Exemple: "FAC-2026-0101"

ServiceId:
├─ ✓ Obligatoire
├─ ✓ Doit exister dans BD
└─ ✓ Type: Long

Montant:
├─ ✓ Obligatoire
├─ ✓ Doit être > 0
└─ ✓ Type: Double

Date:
├─ Optionnel (auto = LocalDate.now())
└─ Type: LocalDate

Statut:
├─ Optionnel (auto = "Payée")
├─ Valeurs acceptées: "Payée", "En attente", "Annulée"
└─ Type: String

Description:
├─ Optionnel
├─ Max 500 caractères
└─ Type: String
```

---

**Version:** 1.0  
**Date:** 8 juillet 2026  
**Status:** ✅ Documentation Complète
