-- ════════════════════════════════════════════════════════════════════════════════
-- 📊 SCRIPT D'INITIALISATION - BASE DE DONNÉES HRFLOW
-- ════════════════════════════════════════════════════════════════════════════════

-- ── Création base de données ──
-- Utiliser le même nom que dans le fichier .env (MYSQL_DATABASE=gestion_rh)
CREATE DATABASE IF NOT EXISTS gestion_rh;
USE gestion_rh;

-- ── Table des employés ──
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Identité
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE KEY,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    
    -- Emploi
    poste VARCHAR(100),
    type_contrat VARCHAR(50),
    mode_reglement VARCHAR(50),
    rib VARCHAR(100),
    
    -- Sécurité
    mot_de_passe VARCHAR(255) NOT NULL,
    
    -- Statuts
    statut ENUM('EN_ATTENTE', 'VALIDE', 'REJETE') DEFAULT 'EN_ATTENTE',
    role ENUM('ADMIN', 'EMPLOYE') DEFAULT 'EMPLOYE',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP NULL,
    
    -- Indices
    KEY idx_email (email),
    KEY idx_statut (statut),
    KEY idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Insertion admin par défaut ──
-- Email: admin@hrflow.local / Pass: admin123
UPDATE employees
SET email = 'admin@hrflow.local'
WHERE email = 'admin@gmail.com';

INSERT INTO employees (prenom, nom, email, telephone, adresse, poste, type_contrat, mode_reglement, rib, mot_de_passe, statut, role, created_at, validated_at)
VALUES (
    'Admin',
    'System',
    'admin@hrflow.local',
    '+213500000000',
    'Siège administratif',
    'Administrateur',
    'CDI',
    'Virement bancaire',
    'XXXXXXXXXXXXXX',
    '$2a$10$W6f01r0l6u/CxSvh.wgVJe1jArLl0swuuQxY1Bl8Js6CEQQfPd9HW',
    'VALIDE',
    'ADMIN',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE role='ADMIN', statut='VALIDE';

-- ════════════════════════════════════════════════════════════════════════════════
-- 🔐 DONNÉES DE TEST
-- ════════════════════════════════════════════════════════════════════════════════

-- Employé EN_ATTENTE (pour test validation)
INSERT INTO employees (
    prenom, nom, email, telephone, adresse, poste, type_contrat, mode_reglement, rib, 
    mot_de_passe, statut, role
) VALUES (
    'Ali', 'Souissi', 'ali.souissi@example.com', '98765432', 'Rue Habib Bourguiba, Tunis',
    'Développeur Senior', 'CDI', 'Virement bancaire', 'TN5910000123456789456789',
    '$2a$10$N9qo8uLOickgx2ZMRZoHaeU0sV2.pFVqVyPJ5Vv2cWP3GjETQR1VC',  -- BCrypt: "testpass123"
    'EN_ATTENTE', 'EMPLOYE'
);

-- Employé VALIDE (peut se connecter)
INSERT INTO employees (
    prenom, nom, email, telephone, adresse, poste, type_contrat, mode_reglement, rib,
    mot_de_passe, statut, role, validated_at
) VALUES (
    'Fatima', 'Ben Ahmed', 'fatima.ahmed@example.com', '98765433', 'Avenue de Carthage, Tunis',
    'Responsable RH', 'CDI', 'Virement bancaire', 'TN5910000223456789456789',
    '$2a$10$N9qo8uLOickgx2ZMRZoHaeU0sV2.pFVqVyPJ5Vv2cWP3GjETQR1VC',  -- BCrypt: "testpass123"
    'VALIDE', 'EMPLOYE', NOW()
);

-- Employé REJETE (ne peut pas se connecter)
INSERT INTO employees (
    prenom, nom, email, telephone, adresse, poste, type_contrat, mode_reglement, rib,
    mot_de_passe, statut, role, validated_at
) VALUES (
    'Mohamed', 'Khalil', 'mohamed.khalil@example.com', '98765434', 'Rue Ibn Khaldoun, Tunis',
    'Comptable', 'CDD', 'Virement bancaire', 'TN5910000323456789456789',
    '$2a$10$N9qo8uLOickgx2ZMRZoHaeU0sV2.pFVqVyPJ5Vv2cWP3GjETQR1VC',  -- BCrypt: "testpass123"
    'REJETE', 'EMPLOYE', NOW()
);

-- ════════════════════════════════════════════════════════════════════════════════
-- 📋 RÉSUMÉ DES DONNÉES
-- ════════════════════════════════════════════════════════════════════════════════

-- ADMIN:
--   Email: admin@hrflow.local
--   Pass: admin123
--   Note: En dur dans EmployeeService, pas en BDD

-- EMPLOYÉS DE TEST:
--   
--   1️⃣ Ali Souissi (ali.souissi@example.com / testpass123)
--      Statut: EN_ATTENTE
--      → Admin doit valider ou refuser
--   
--   2️⃣ Fatima Ben Ahmed (fatima.ahmed@example.com / testpass123)
--      Statut: VALIDE
--      → Peut se connecter immédiatement
--   
--   3️⃣ Mohamed Khalil (mohamed.khalil@example.com / testpass123)
--      Statut: REJETE
--      → Verra une erreur à la connexion

-- ════════════════════════════════════════════════════════════════════════════════
-- 🧪 REQUÊTES DE TEST
-- ════════════════════════════════════════════════════════════════════════════════

-- Voir tous les employés:
-- SELECT id, prenom, nom, email, statut, role FROM employees;

-- Voir employés EN_ATTENTE (validation):
-- SELECT id, prenom, nom, email, poste FROM employees WHERE statut = 'EN_ATTENTE';

-- Voir employés VALIDES:
-- SELECT id, prenom, nom, email, poste FROM employees WHERE statut = 'VALIDE';

-- Mettre à jour le statut d'Ali à VALIDE:
-- UPDATE employees SET statut = 'VALIDE', validated_at = NOW() WHERE id = 1;
