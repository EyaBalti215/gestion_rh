# 🚀 GUIDE DE TEST COMPLET - ARCHITECTURE HRFLOW

## 📋 TABLE DES MATIÈRES

1. [Endpoints API](#endpoints-api)
2. [Flux de test](#flux-de-test)
3. [Données de test](#données-de-test)
4. [Erreurs courantes](#erreurs-courantes)
5. [Commandes Docker](#commandes-docker)

---

## 🔌 ENDPOINTS API

### **AUTHENTIFICATION (Public)**

```bash
# 1️⃣ INSCRIPTION EMPLOYÉ
POST /api/employees/register
Content-Type: application/json

{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "telephone": "98765432",
  "adresse": "Rue de la Paix, Tunis",
  "poste": "Développeur",
  "typeContrat": "CDI",
  "modeReglement": "Virement bancaire",
  "rib": "TN5910000123456789456789",
  "motDePasse": "SecurePass123!"
}

Réponse (200 OK):
{
  "id": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "statut": "EN_ATTENTE",
  "message": "✅ Bienvenue Jean Dupont ! Votre inscription a été reçue..."
}
```

```bash
# 2️⃣ CONNEXION (LOGIN)
POST /api/employees/login
Content-Type: application/json

{
  "email": "jean.dupont@example.com",
  "motDePasse": "SecurePass123!"
}

# CAS 1 : Employé EN_ATTENTE
Réponse (200 OK):
{
  "success": false,
  "message": "⏳ Votre compte est en attente de validation par un administrateur."
}

# CAS 2 : Employé VALIDE
Réponse (200 OK):
{
  "success": true,
  "role": "EMPLOYE",
  "id": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "statut": "VALIDE",
  "message": "✅ Bienvenue Jean Dupont !"
}

# CAS 3 : ADMIN
POST /api/employees/login
{
  "email": "admin@hrflow.local",
  "motDePasse": "admin123"
}

Réponse (200 OK):
{
  "success": true,
  "role": "ADMIN",
  "prenom": "Admin",
  "nom": "System",
  "email": "admin@hrflow.local",
  "statut": "VALIDE",
  "message": "✅ Bienvenue administrateur !",
  "id": 0
}
```

### **GESTION ADMIN (Public mais pour Admin)**

```bash
# 3️⃣ LISTER EMPLOYÉS EN_ATTENTE (pour Admin)
GET /api/employees/pending

Réponse (200 OK):
[
  {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com",
    "telephone": "98765432",
    "adresse": "Rue de la Paix, Tunis",
    "poste": "Développeur",
    "typeContrat": "CDI",
    "modeReglement": "Virement bancaire",
    "rib": "TN5910000123456789456789",
    "statut": "EN_ATTENTE",
    "role": "EMPLOYE",
    "createdAt": "2026-06-28T10:30:00"
  }
]
```

```bash
# 4️⃣ VALIDER UN EMPLOYÉ (Admin)
PUT /api/employees/1/valider
Content-Type: application/json

Réponse (200 OK):
{
  "id": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "statut": "VALIDE",
  "message": "✅ Jean Dupont a été validé(e) avec succès. Il/elle peut maintenant se connecter."
}

# Base de données mise à jour:
# statut = 'VALIDE'
# validated_at = NOW()
```

```bash
# 5️⃣ REFUSER UN EMPLOYÉ (Admin)
PUT /api/employees/1/refuser
Content-Type: application/json

Réponse (200 OK):
{
  "id": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "statut": "REJETE",
  "message": "❌ La demande de Jean Dupont a été refusée."
}

# Base de données mise à jour:
# statut = 'REJETE'
# validated_at = NOW()
```

```bash
# 6️⃣ VOIR TOUS LES EMPLOYÉS (Admin)
GET /api/employees

Réponse (200 OK):
[
  { "id": 1, "prenom": "Jean", "nom": "Dupont", "email": "jean.dupont@example.com", "statut": "VALIDE", ... },
  { "id": 2, "prenom": "Marie", "nom": "Martin", "email": "marie.martin@example.com", "statut": "EN_ATTENTE", ... },
  { "id": 3, "prenom": "Pierre", "nom": "Bernard", "email": "pierre.bernard@example.com", "statut": "REJETE", ... }
]
```

---

## 🧪 FLUX DE TEST COMPLET

### **TEST 1 : Inscription d'un employé**

```bash
1️⃣ Frontend: Aller sur Home.jsx
   → Cliquer "Créer un compte employé"
   
2️⃣ Frontend: Affiche EmployeeRegistration.jsx
   → Remplir les 3 étapes
   → Cliquer "S'inscrire"
   
3️⃣ Backend: POST /api/employees/register
   → Vérifier que l'email n'existe pas
   → Hasher le mot de passe (BCrypt)
   → Créer en BDD avec statut=EN_ATTENTE
   
4️⃣ Frontend: Message de succès
   ✅ "Votre inscription a été reçue. Attendez la validation..."
```

### **TEST 2 : Connexion employé EN_ATTENTE**

```bash
1️⃣ Frontend: Login.jsx
   → Saisir email et mot de passe
   → Cliquer "Se connecter"
   
2️⃣ Backend: POST /api/employees/login
   → Trouver l'employé par email
   → Vérifier le mot de passe (BCrypt match)
   → Vérifier le statut: EN_ATTENTE
   
3️⃣ Backend: Répondre
   { "success": false, "message": "⏳ En attente de validation..." }
   
4️⃣ Frontend: Afficher l'erreur
   ❌ "Votre compte est en attente de validation par un administrateur."
```

### **TEST 3 : Admin valide l'employé**

```bash
1️⃣ Admin se connecte
   → Email: admin@hrflow.local
   → Pass: admin123
   → OTP (n'importe quel code à 6 chiffres)
   
2️⃣ Admin accède à AdminDashboard
   → Menu sidebar → "Inscriptions"
   
3️⃣ AdminDashboard affiche Inscriptions.jsx
   → Liste des employés EN_ATTENTE
   → Jean Dupont, jean.dupont@example.com, Développeur
   
4️⃣ Admin clique "✅ Valider"
   → PUT /api/employees/1/valider
   
5️⃣ Backend:
   → Mettre à jour statut = VALIDE
   → Mettre à jour validated_at = NOW()
   → Répondre: { message: "Jean Dupont a été validé..." }
   
6️⃣ Frontend: Message de succès
   ✅ "Jean Dupont a été validé(e) avec succès."
   → Jean disparaît de la liste
```

### **TEST 4 : Employé validé se connecte**

```bash
1️⃣ Frontend: Login.jsx
   → Saisir email et mot de passe
   → Cliquer "Se connecter"
   
2️⃣ Backend: POST /api/employees/login
   → Trouver l'employé par email
   → Vérifier le mot de passe (BCrypt match)
   → Vérifier le statut: VALIDE ✓
   
3️⃣ Backend: Répondre
   { "success": true, "role": "EMPLOYE", id: 1, ... }
   
4️⃣ Frontend: Rediriger vers EmployeeDashboard
   → Afficher le tableau de bord employé
   → "Bienvenue Jean Dupont"
   → "✅ Compte actif"
```

### **TEST 5 : Admin refuse un employé**

```bash
1️⃣ Admin accède à Inscriptions.jsx
   → Liste des EN_ATTENTE
   
2️⃣ Admin clique "❌ Refuser" (autre employé)
   → Confirmation: "Êtes-vous sûr?"
   → Cliquer "Oui"
   
3️⃣ Backend: PUT /api/employees/2/refuser
   → Mettre à jour statut = REJETE
   → Mettre à jour validated_at = NOW()
   
4️⃣ Frontend: Message de succès
   ✅ "La demande de [Employé] a été refusée."
   → L'employé disparaît de la liste
   
5️⃣ Employé essaie de se connecter
   → Backend retourne: success=false
   → Message: "❌ Votre demande d'inscription a été refusée. Contactez l'administrateur."
```

---

## 📊 DONNÉES DE TEST

### **ADMIN**

```
Email: admin@hrflow.local
Pass:  admin123
Note:  Stocké en dur dans EmployeeService (pas en BDD)
```

### **EMPLOYÉS DE TEST (en BDD)**

#### 1️⃣ Ali Souissi - EN_ATTENTE

```
Email:     ali.souissi@example.com
Pass:      testpass123
Statut:    EN_ATTENTE
Poste:     Développeur Senior
Action:    Admin doit valider ou refuser
```

#### 2️⃣ Fatima Ben Ahmed - VALIDE

```
Email:     fatima.ahmed@example.com
Pass:      testpass123
Statut:    VALIDE
Poste:     Responsable RH
Action:    Peut se connecter directement
```

#### 3️⃣ Mohamed Khalil - REJETE

```
Email:     mohamed.khalil@example.com
Pass:      testpass123
Statut:    REJETE
Poste:     Comptable
Action:    Verra une erreur à la connexion
```

### **À CRÉER VOUS-MÊME VIA FORMULAIRE**

```
1. Frontend: Home.jsx → "Créer un compte"
2. Remplir le formulaire 3 étapes
3. Email et mot de passe à votre choix
4. Employé créé en BDD avec statut EN_ATTENTE
5. Admin valide/refuse depuis Inscriptions.jsx
```

---

## ⚠️ ERREURS COURANTES

### **Erreur 1 : "Email already exists"**

```
Cause: Email utilisé 2 fois
Solution: Utiliser un email différent à chaque inscription

Test: 
- Première inscription: jean@example.com ✓
- Deuxième inscription: jean@example.com ✗ (erreur)
```

### **Erreur 2 : "Password incorrect"**

```
Cause: Mot de passe incorrect ou BCrypt ne matche pas
Solution: Vérifier la saisie du mot de passe

Backend: encoder.matches(inputPassword, storedHashedPassword)
```

### **Erreur 3 : "User not found"**

```
Cause: Email n'existe pas en BDD
Solution: Vérifier l'email ou créer le compte d'abord

Test: 
- Inscription: john@example.com ✓
- Connexion: paul@example.com ✗ (erreur: User not found)
```

### **Erreur 4 : "Account is pending validation"**

```
Cause: Employé EN_ATTENTE essaie de se connecter (c'est normal)
Solution: Admin doit le valider d'abord

Workflow:
1. Employé s'inscrit (EN_ATTENTE)
2. Employé essaie de se connecter → ERREUR (normal)
3. Admin valide (VALIDE)
4. Employé se connecte → OK
```

### **Erreur 5 : "Application has been rejected"**

```
Cause: Employé REJETE essaie de se connecter
Solution: Admin doit expliquer pourquoi

Message: "Votre demande d'inscription a été refusée. Contactez l'administrateur."
```

### **Erreur 6 : CORS error**

```
Cause: Frontend (localhost:5173) appelle Backend (localhost:8080)
Solution: Vérifier SecurityConfig.java

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    ...
}
```

### **Erreur 7 : 404 Not Found**

```
Cause: Mauvais endpoint ou typo d'URL
Solution: Vérifier les endpoints

Corrects:
POST   /api/employees/register
POST   /api/employees/login
GET    /api/employees/pending
PUT    /api/employees/{id}/valider
PUT    /api/employees/{id}/refuser
```

---

## 🐳 COMMANDES DOCKER

### **Démarrer l'application complète**

```bash
# Depuis le dossier gestion-rh/
docker-compose up --build --force-recreate

# Logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### **URL d'accès**

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8080
MySQL:     localhost:3306
```

### **Accéder à la BDD MySQL**

```bash
# Via Docker
docker exec -it gestion-rh-mysql-1 mysql -u root -p hrflow
# (Password: root)

# Requêtes utiles:
SELECT * FROM employees;
SELECT * FROM employees WHERE statut = 'EN_ATTENTE';
UPDATE employees SET statut = 'VALIDE' WHERE id = 1;
```

### **Redémarrer les services**

```bash
# Restart tout
docker-compose restart

# Restart seulement le backend
docker-compose restart backend

# Rebuild et restart
docker-compose up --build
```

---

## ✅ CHECKLIST DE FONCTIONNEMENT

- [ ] Home.jsx affiche "Créer un compte" et "Se connecter"
- [ ] EmployeeRegistration.jsx 3 étapes fonctionnent
- [ ] Inscription crée un employé EN_ATTENTE en BDD
- [ ] Login.jsx masque "Créer un compte" si email=admin
- [ ] Admin se connecte avec admin@hrflow.local
- [ ] Inscriptions.jsx affiche les employés EN_ATTENTE
- [ ] "✅ Valider" passe l'employé en VALIDE
- [ ] "❌ Refuser" passe l'employé en REJETE
- [ ] Employé EN_ATTENTE voit l'erreur à la connexion
- [ ] Employé VALIDE se connecte et voit EmployeeDashboard
- [ ] Employé REJETE voit l'erreur à la connexion
- [ ] AdminDashboard affiche "Inscriptions" dans le menu

---

**🎉 L'architecture est complète et fonctionnelle !**
