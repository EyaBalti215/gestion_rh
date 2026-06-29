# 📋 ARCHITECTURE COMPLÈTE - GESTION RH

## 🎯 OBJECTIF PRINCIPAL

**Création de compte employé AUTONOME** avec **validation admin obligatoire** avant accès:

1. ✅ **Employé** crée son propre compte (formulaire d'inscription)
2. ⏳ **Employé** attend validation par l'admin
3. 👨‍💼 **Admin** valide/refuse dans la page "Inscriptions"
4. 🔑 **Employé** se connecte SEULEMENT si compte validé
5. 🏠 **Chacun accède à sa plateforme** (Admin Dashboard vs Employee Dashboard)

---

## 🏗️ ARCHITECTURE BACKEND

### 1️⃣ Entity: Employee.java

```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String prenom;
    private String nom;
    
    @Column(unique = true)
    private String email;
    
    private String telephone;
    private String adresse;
    private String poste;
    private String typeContrat;
    private String modeReglement;
    private String rib;
    
    @JsonIgnore
    private String motDePasse;  // ← Hash BCrypt
    
    @Enumerated(EnumType.STRING)
    private StatutCompte statut = StatutCompte.EN_ATTENTE;
    // ✅ EN_ATTENTE, VALIDE, REJETE
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.EMPLOYE;
    // ✅ ADMIN, EMPLOYE
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime validatedAt;
    
    public enum StatutCompte { EN_ATTENTE, VALIDE, REJETE }
    public enum Role { ADMIN, EMPLOYE }
}
```

### 2️⃣ DTOs

**LoginRequestDto.java** (entrée login):
```java
public class Loginrequestdto {
    private String email;
    private String motDePasse;
}
```

**LoginResponseDto.java** (réponse login):
```java
public class LoginResponseDto {
    private boolean success;
    private String role;        // "ADMIN" ou "EMPLOYE"
    private String prenom;
    private String nom;
    private String email;
    private String statut;      // "EN_ATTENTE", "VALIDE", "REJETE"
    private String message;
    private Long id;
}
```

**EmployeeResponseDto.java** (réponse inscription):
```java
public class EmployeeResponseDto {
    private Long id;
    private String prenom;
    private String nom;
    private String email;
    private String statut;
    private String message;
}
```

### 3️⃣ Service: EmployeeService.java

**Logique métier**:

```java
@Service
public class EmployeeService {
    private static final String ADMIN_EMAIL = "admin@hrflow.local";
    private static final String ADMIN_PASSWORD = "admin123";
    
    // 🔐 1. INSCRIPTION EMPLOYÉ (PUBLIC)
    public EmployeeResponseDto register(EmployeeRequestDto dto) {
        // ✅ Crée un employé EN_ATTENTE
        // ✅ Hash du mot de passe en BCrypt
        // ✅ Role = EMPLOYE
    }
    
    // 🔑 2. CONNEXION UNIFIÉE (LOGIN)
    public LoginResponseDto login(Loginrequestdto dto) {
        if (email == ADMIN_EMAIL) {
            // ✅ Admin → retourner success avec role=ADMIN
        } else {
            // Chercher employé
            // ❌ Si EN_ATTENTE → "En attente de validation"
            // ❌ Si REJETE → "Demande refusée"
            // ✅ Si VALIDE → success avec role=EMPLOYE
        }
    }
    
    // 👨‍💼 3. GESTION ADMIN
    public EmployeeResponseDto validateEmployee(Long id) {
        // EN_ATTENTE ➜ VALIDE
        // Employé peut maintenant se connecter
    }
    
    public EmployeeResponseDto rejectEmployee(Long id) {
        // EN_ATTENTE ➜ REJETE
        // Employé reçoit erreur à la connexion
    }
}
```

### 4️⃣ Controller: EmployeeController.java

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    // PUBLIC
    @PostMapping("/register")       // Inscription employé
    public ResponseEntity<?> register(EmployeeRequestDto dto)
    
    @PostMapping("/login")          // Connexion unifiée
    public ResponseEntity<LoginResponseDto> login(Loginrequestdto dto)
    
    // ADMIN
    @GetMapping("/pending")         // Employés EN_ATTENTE
    public ResponseEntity<List<Employee>> getPendingEmployees()
    
    @PutMapping("/{id}/valider")    // Valider un employé
    public ResponseEntity<?> validateEmployee(Long id)
    
    @PutMapping("/{id}/refuser")    // Refuser un employé
    public ResponseEntity<?> rejectEmployee(Long id)
}
```

### 5️⃣ SecurityConfig.java

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/employees/register",      // ✅ PUBLIC
                    "/api/employees/login",         // ✅ PUBLIC
                    "/api/employees/pending",       // ✅ PUBLIC (pour admin)
                    "/api/employees/*/valider",     // ✅ PUBLIC
                    "/api/employees/*/refuser"      // ✅ PUBLIC
                ).permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

## 🎨 ARCHITECTURE FRONTEND

### **FLUX UTILISATEUR**

```
┌─────────────────────────────────────────────────────────────┐
│                      App.jsx (Router)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Home.jsx                                                    │
│  ├─ Bouton: "Se connecter"                                  │
│  └─ Bouton: "Créer un compte employé"                       │
│                                                              │
│  Login.jsx (Connexion)                                       │
│  ├─ Formulaire email + mot de passe                         │
│  ├─ Lien "Créer un compte" (masqué si admin)                │
│  ├─ Lien "Mot de passe oublié"                              │
│  ├─ [Admin]  → OTP requis → AdminDashboard                  │
│  └─ [Employé validé] → Accès direct → EmployeeDashboard    │
│                                                              │
│  EmployeeRegistration.jsx (Inscription - 3 étapes)          │
│  ├─ Étape 1: Identité (prénom, nom, email, tel, adresse)   │
│  ├─ Étape 2: Emploi (poste, contrat, RIB)                  │
│  ├─ Étape 3: Sécurité (mot de passe)                        │
│  └─ → Statut: EN_ATTENTE                                    │
│                                                              │
│  AdminDashboard.jsx                                          │
│  ├─ Sidebar avec modules                                    │
│  ├─ Page: "Inscriptions" (liste EN_ATTENTE)                 │
│  │   ├─ Bouton: "✅ Valider" → VALIDE                       │
│  │   └─ Bouton: "❌ Refuser" → REJETE                       │
│  └─ Autres modules (Pointage, Paie, etc.)                   │
│                                                              │
│  EmployeeDashboard.jsx                                       │
│  ├─ Tableau de bord employé                                 │
│  ├─ Affiche: "✅ Compte actif"                              │
│  ├─ Stats: Jours travaillés, Congés, Salaire               │
│  └─ Infos compte (Email, Rôle, Statut)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1️⃣ **Home.jsx** - Page d'accueil

- ✅ Bouton "Se connecter" (redirige vers Login)
- ✅ Bouton "Créer un compte employé" (redirige vers Registration)
- ✅ LE LIEN POUR CRÉER UN COMPTE N'APPARAÎT QUE ICI (pas sur Admin)

### 2️⃣ **Login.jsx** - Connexion unifiée

```javascript
// Détection email admin
const isAdminEmail = email.trim().toLowerCase() === 'admin@hrflow.local';

// Le lien "Créer un compte" est caché si on tape l'email admin
{!isAdminEmail && (
    <button onClick={onRegisterClick}>
        Créer un compte employé
    </button>
)}
```

**Logique de connexion**:
- Admin → OTP requis → AdminDashboard
- Employé EN_ATTENTE → Erreur "En attente de validation"
- Employé REJETE → Erreur "Demande refusée"
- Employé VALIDE → Accès direct → EmployeeDashboard

### 3️⃣ **EmployeeRegistration.jsx** - Formulaire 3 étapes

**Étape 1**: Identité (prénom, nom, email, téléphone, adresse)
**Étape 2**: Emploi (poste, contrat, mode règlement, RIB)
**Étape 3**: Sécurité (mot de passe + confirmation)

Envoi vers: `POST /api/employees/register`

Réponse: `{ id, email, statut: "EN_ATTENTE", message: "..." }`

### 4️⃣ **Inscriptions.jsx** - Page de validation (Admin)

C'est la page **clé pour l'admin**:

```javascript
// Charger les employés EN_ATTENTE
GET /api/employees/pending

// Pour chaque employé:
// - Afficher: Nom, Email, Poste, Date inscription
// - Bouton: ✅ Valider  → PUT /api/employees/{id}/valider
// - Bouton: ❌ Refuser  → PUT /api/employees/{id}/refuser

// Après action:
// ✅ Employé passe en VALIDE ou REJETE
// ✅ Employé disparaît de la liste
```

### 5️⃣ **AdminDashboard.jsx** - Tableau de bord admin

- Menu principal avec "📋 Inscriptions" en badge
- Clique sur "Inscriptions" → affiche Inscriptions.jsx
- Les employés EN_ATTENTE sont validés/refusés ici
- **L'admin NE VOIT PAS le lien "Créer un compte employé"**

### 6️⃣ **EmployeeDashboard.jsx** - Tableau de bord employé

Affichage SEULEMENT si:
- ✅ Employé connecté avec role=EMPLOYE
- ✅ Statut=VALIDE

Affiche:
- Bienvenue "✅ Compte actif"
- Stats (Jours travaillés, Congés, Salaire, Bulletins)
- Infos compte (Email, Rôle, Statut)

---

## 🔄 FLUX COMPLET - EXEMPLE

### **Scénario 1: Inscription Employé + Validation Admin + Accès**

```
1. [EMPLOYÉ] Accède à la page d'accueil
   └─ Clique: "Créer un compte employé"
   
2. [EMPLOYÉ] Remplit le formulaire 3 étapes
   ├─ Étape 1: Ali Souissi, ali@email.dz, 98765432, Rue X, Tunis
   ├─ Étape 2: Développeur, CDI, Virement, RIB: 123456
   ├─ Étape 3: MotDePasse: "SecurePass123"
   └─ Envoie: POST /api/employees/register
   
3. [BACKEND] Crée l'employé
   ├─ Hash du mot de passe (BCrypt)
   ├─ Statut: EN_ATTENTE
   ├─ Role: EMPLOYE
   └─ Répond: { id: 5, statut: "EN_ATTENTE", message: "Votre inscription..." }
   
4. [EMPLOYÉ] Voit: "✅ Inscription reçue. Attendez la validation."
   
5. [ADMIN] Se connecte
   ├─ Email: admin@hrflow.local
   ├─ Mot de passe: admin123
   ├─ OTP reçu
   └─ Accède à AdminDashboard
   
6. [ADMIN] Clique: "Inscriptions"
   ├─ Voit: Ali Souissi, ali@email.dz, Développeur, EN_ATTENTE
   ├─ Clique: "✅ Valider"
   └─ PUT /api/employees/5/valider
   
7. [BACKEND] Met à jour
   ├─ Statut: VALIDE
   ├─ ValidatedAt: 2026-06-28
   └─ Répond: { message: "Ali Souissi a été validé..." }
   
8. [ADMIN] Voit: "✅ Ali Souissi a été validé..."
   └─ Ali disparaît de la liste
   
9. [EMPLOYÉ] Se connecte
   ├─ Email: ali@email.dz
   ├─ Mot de passe: SecurePass123
   └─ POST /api/employees/login
   
10. [BACKEND] Vérifie
    ├─ Email existe ✓
    ├─ Mot de passe correct ✓
    ├─ Statut: VALIDE ✓
    └─ Répond: { success: true, role: "EMPLOYE", ... }
    
11. [EMPLOYÉ] Accède à EmployeeDashboard
    ├─ Bienvenue: "Ali Souissi"
    ├─ "✅ Compte actif"
    └─ Voit ses stats et infos
```

### **Scénario 2: Employé EN_ATTENTE essaie de se connecter**

```
1. [EMPLOYÉ] Se connecte
   ├─ Email: ali@email.dz
   ├─ Mot de passe: SecurePass123
   └─ POST /api/employees/login
   
2. [BACKEND] Vérifie
   ├─ Email existe ✓
   ├─ Mot de passe correct ✓
   ├─ Statut: EN_ATTENTE ✗
   └─ Répond: { 
        success: false, 
        message: "⏳ Votre compte est en attente de validation par un administrateur."
      }
   
3. [EMPLOYÉ] Voit: "⏳ Votre compte est en attente..."
   └─ Reste sur la page de connexion
```

### **Scénario 3: Admin refuse un employé**

```
1. [ADMIN] Clique: "❌ Refuser" (Ali)
   └─ Confirmation: "Êtes-vous sûr?"
   
2. [BACKEND] Met à jour
   ├─ Statut: REJETE
   ├─ ValidatedAt: 2026-06-28
   └─ Répond: { message: "La demande de Ali a été refusée." }
   
3. [EMPLOYÉ] Essaie de se connecter
   └─ Répond: { 
        success: false, 
        message: "❌ Votre demande d'inscription a été refusée. Contactez l'administrateur."
      }
```

---

## ✨ POINTS CLÉS DE L'ARCHITECTURE

| Aspect | Détail |
|--------|--------|
| **Inscription** | Autonome par l'employé (formulaire public) |
| **Statut** | EN_ATTENTE → (VALIDE\|REJETE) |
| **Validation** | Admin uniquement via page "Inscriptions" |
| **Connexion Admin** | Email: admin@hrflow.local / Pass: admin123 / OTP requis |
| **Connexion Employé** | Seulement si VALIDE + OTP optionnel |
| **Lien "Créer compte"** | Visible en Home.jsx et Login.jsx (pas chez Admin) |
| **Dashboards** | Admin ≠ Employé (layout, contenu, droits) |
| **Sécurité** | BCrypt pour les mots de passe, Admin en dur |

---

## 🚀 DÉPLOIEMENT

### **Backend (Java/Spring Boot)**

```bash
# Base de données
CREATE TABLE employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prenom VARCHAR(100),
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    poste VARCHAR(100),
    type_contrat VARCHAR(50),
    mode_reglement VARCHAR(50),
    rib VARCHAR(100),
    mot_de_passe VARCHAR(255),
    statut VARCHAR(20),  -- EN_ATTENTE, VALIDE, REJETE
    role VARCHAR(20),    -- ADMIN, EMPLOYE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP
);

# Index
CREATE INDEX idx_email ON employees(email);
CREATE INDEX idx_statut ON employees(statut);
```

### **Frontend (React/Vite)**

```bash
npm install
npm run dev  # http://localhost:5173
```

### **Docker Compose**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/hrflow
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: hrflow
    ports:
      - "3306:3306"
```

---

## 📞 SUPPORT

Pour toute question ou amélioration:
- ✅ Validation des inscriptions via Admin uniquement
- ✅ Emploi du statut pour contrôler l'accès
- ✅ Distinction claire entre Admin et Employé
- ✅ Sécurité des mots de passe (BCrypt)
