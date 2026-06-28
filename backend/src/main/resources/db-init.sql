CREATE TABLE IF NOT EXISTS app_ping (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(50) NOT NULL
);

INSERT INTO app_ping (label)
SELECT 'ready'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM app_ping);

CREATE TABLE IF NOT EXISTS employees (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    prenom          VARCHAR(100)  NOT NULL,
    nom             VARCHAR(100)  NOT NULL,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    telephone       VARCHAR(30),
    adresse         VARCHAR(255),
    poste           VARCHAR(150)  NOT NULL,
    type_contrat    VARCHAR(50)   DEFAULT 'CDI',
    mode_reglement  VARCHAR(100)  DEFAULT 'Virement bancaire',
    rib             VARCHAR(100)  NOT NULL,
    mot_de_passe    VARCHAR(255)  NOT NULL,   -- BCrypt hash ($2a$10$...)
    statut          ENUM('EN_ATTENTE', 'VALIDE', 'REJETE') DEFAULT 'EN_ATTENTE',
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);