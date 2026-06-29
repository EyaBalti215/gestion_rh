# 📚 INDEX DE NAVIGATION - ARCHITECTURE HRFLOW

## 📂 STRUCTURE DU PROJET

```
gestion-rh/
├── 📄 ARCHITECTURE_COMPLETE.md        ← Lire EN PREMIER
├── 📄 GUIDE_TEST_COMPLET.md           ← Pour tester l'application
├── 📄 RESUME_MODIFICATIONS.md         ← Changements effectués
├── 📄 INDEX_NAVIGATION.md             ← CE FICHIER
│
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/gestionrh/backend/
│       ├── Entity/
│       │   └── Employee.java          ✏️ MODIFIÉ (role, validatedAt)
│       │
│       ├── dto/
│       │   ├── EmployeeRequestDto.java    ✓ Existant
│       │   ├── EmployeeResponseDto.java   ✓ Existant
│       │   ├── Loginrequestdto.java       ✓ Existant
│       │   └── LoginResponseDto.java      ✨ NOUVEAU (réponse login)
│       │
│       ├── service/
│       │   └── EmployeeService.java   ⚡ REFACTORISÉ (register, login, validate, reject)
│       │
│       ├── controller/
│       │   └── EmployeeController.java ⚡ REFACTORISÉ (7 endpoints)
│       │
│       └── SecurityConfig.java        ✓ Confirmé (CORS, CSRF)
│
├── frontend/
│   └── src/components/
│       ├── Home.jsx                   ✓ Page d'accueil
│       ├── Login.jsx                  ✓ Connexion unifiée (admin + employé)
│       ├── EmployeeRegistration.jsx   ✓ Formulaire 3 étapes
│       ├── Inscriptions.jsx           ⚡ REFACTORISÉ (validation admin)
│       ├── AdminDashboard.jsx         ✓ Dashboard admin
│       └── EmployeeDashboard.jsx      ✓ Dashboard employé
│
├── docker/
│   └── mysql-init/
│       └── init_hrflow.sql            ✨ NOUVEAU (schéma DB + test data)
│
└── docker-compose.yml                 ✓ Existant
```

---

## 🚀 DÉMARRAGE RAPIDE

### **1️⃣ Lancer l'application**

```bash
cd gestion-rh/
docker-compose up --build --force-recreate
```

**URLs d'accès:**
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:8080
- 📊 MySQL: localhost:3306

### **2️⃣ Premier test**

**Option A: Créer un employé et le valider**

```bash
1. Frontend → Accueil
2. Cliquer "Créer un compte employé"
3. Remplir le formulaire et s'inscrire
4. Se connecter avec admin@hrflow.local / admin123
5. OTP: N'importe quel code à 6 chiffres
6. Menu → "Inscriptions"
7. Clicker "✅ Valider"
8. Se déconnecter et se reconnecter avec le nouvel employé
```

**Option B: Utiliser les données de test**

```bash
1. Accueil → Se connecter
2. Email: admin@hrflow.local / admin123
3. OTP: Tout code à 6 chiffres
4. Menu → "Inscriptions"
5. Vous verrez Ali Souissi (EN_ATTENTE)
6. Valider ou refuser
```

---

## 📖 DOCUMENTATION

### **Pour comprendre l'architecture**

1. 📄 **[ARCHITECTURE_COMPLETE.md](#)** (LIRE EN PREMIER)
   - Vue d'ensemble complète
   - Codes source des entities, DTOs, services, controllers
   - Flux utilisateur avec exemples
   - Architecture frontend
   - Points clés de sécurité

2. 📄 **[GUIDE_TEST_COMPLET.md](#)**
   - Tous les endpoints API
   - 5 flux de test complets
   - Données de test
   - Erreurs courantes
   - Commandes Docker

3. 📄 **[RESUME_MODIFICATIONS.md](#)**
   - Changements apportés au projet
   - Avant/Après
   - Points clés de sécurité
   - Prochaines étapes optionnelles

---

## 🔑 IDENTIFIANTS DE TEST

### **ADMIN**

```
Email: admin@hrflow.local
Pass:  admin123
OTP:   N'importe quel code à 6 chiffres
```

### **EMPLOYÉS (préchargés en BDD)**

```
1. Ali Souissi
   Email:  ali.souissi@example.com
   Pass:   testpass123
   Statut: EN_ATTENTE (à valider par admin)

2. Fatima Ben Ahmed
   Email:  fatima.ahmed@example.com
   Pass:   testpass123
   Statut: VALIDE (peut se connecter)

3. Mohamed Khalil
   Email:  mohamed.khalil@example.com
   Pass:   testpass123
   Statut: REJETE (ne peut pas se connecter)
```

---

## 🎯 FLUX PRINCIPAL

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. EMPLOYÉ CRÉE UN COMPTE (EmployeeRegistration.jsx)            │
│    └─ POST /api/employees/register                              │
│       └─ Crée employé en BDD avec statut EN_ATTENTE             │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. EMPLOYÉ ATTEND VALIDATION                                     │
│    └─ Essaie de se connecter → ERREUR "En attente de validation"│
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. ADMIN VALIDE/REFUSE (Inscriptions.jsx)                       │
│    ├─ ✅ Valider → PUT /api/employees/{id}/valider              │
│    │   └─ statut: EN_ATTENTE → VALIDE                           │
│    └─ ❌ Refuser → PUT /api/employees/{id}/refuser              │
│        └─ statut: EN_ATTENTE → REJETE                           │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. EMPLOYÉ VALIDÉ SE CONNECTE (Login.jsx)                       │
│    └─ POST /api/employees/login                                 │
│       └─ success=true → EmployeeDashboard                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. EMPLOYÉ ACCÈDE À SA PLATEFORME (EmployeeDashboard.jsx)      │
│    └─ Affiche "✅ Compte actif"                                 │
│    └─ Stats et infos personnelles                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 ENDPOINTS API ESSENTIELS

| Méthode | Endpoint | Description | Exemple |
|---------|----------|-------------|---------|
| `POST` | `/api/employees/register` | Créer un compte employé | curl -X POST -H "Content-Type: application/json" -d '{"email":"...","prenom":"..."}' http://localhost:8080/api/employees/register |
| `POST` | `/api/employees/login` | Connexion (admin + employé) | curl -X POST -H "Content-Type: application/json" -d '{"email":"ali@example.com","motDePasse":"testpass123"}' http://localhost:8080/api/employees/login |
| `GET` | `/api/employees/pending` | Lister employés EN_ATTENTE | curl http://localhost:8080/api/employees/pending |
| `PUT` | `/api/employees/{id}/valider` | Valider un employé | curl -X PUT http://localhost:8080/api/employees/1/valider |
| `PUT` | `/api/employees/{id}/refuser` | Refuser un employé | curl -X PUT http://localhost:8080/api/employees/1/refuser |

---

## ✨ FONCTIONNALITÉS PRINCIPALES

✅ **Inscription autonome** - Les employés créent leurs propres comptes
✅ **Validation admin** - Admin approuve ou refuse les inscriptions
✅ **Statuts** - EN_ATTENTE, VALIDE, REJETE
✅ **Sécurité** - BCrypt pour mots de passe, OTP pour admin
✅ **Dashboards distincts** - Admin dashboard ≠ Employee dashboard
✅ **Connexion unifiée** - Admin et employé utilisent le même formulaire
✅ **Messages clairs** - Statuts et erreurs bien expliqués
✅ **Base de données** - MySQL avec schéma adapté
✅ **Docker compose** - Déploiement facile avec docker-compose

---

## 🔍 FICHIERS CLÉS À CONNAÎTRE

### **Backend (Java)**

| Fichier | Rôle | Statut |
|---------|------|--------|
| `Entity/Employee.java` | Modèle employé | ✏️ Modifié |
| `service/EmployeeService.java` | Logique métier | ⚡ Refactorisé |
| `controller/EmployeeController.java` | Endpoints API | ⚡ Refactorisé |
| `dto/LoginResponseDto.java` | Réponse login | ✨ Nouveau |

### **Frontend (React)**

| Fichier | Rôle | Statut |
|---------|------|--------|
| `Login.jsx` | Page de connexion | ✓ Confirmé |
| `EmployeeRegistration.jsx` | Formulaire inscription | ✓ Confirmé |
| `Inscriptions.jsx` | Validation admin | ⚡ Amélioré |
| `AdminDashboard.jsx` | Dashboard admin | ✓ Confirmé |
| `EmployeeDashboard.jsx` | Dashboard employé | ✓ Confirmé |

### **Base de données**

| Fichier | Rôle |
|---------|------|
| `init_hrflow.sql` | Schéma DB + données test |

---

## 🐛 DÉPANNAGE

### **Le backend ne démarre pas**

```bash
# Vérifier les erreurs
docker-compose logs backend

# Reconstruire
docker-compose down
docker-compose up --build --force-recreate
```

### **CORS error**

```bash
# Vérifier que SecurityConfig.java autorise localhost:5173
# et que les endpoints sont marqués permitAll()
docker-compose logs backend | grep -i cors
```

### **Base de données vide**

```bash
# Vérifier que init_hrflow.sql s'est exécuté
docker exec gestion-rh-mysql-1 mysql -u root -proot hrflow -e "SELECT * FROM employees;"
```

### **Impossible de se connecter**

```bash
# Vérifier les credentials
# Admin: admin@hrflow.local / admin123
# Test: ali.souissi@example.com / testpass123
# Vérifier le statut en BDD
```

---

## 📞 AIDE RAPIDE

**Quelle page pour faire quoi?**

| Je veux... | Aller à... | Clicker sur... |
|----------|----------|----------|
| Créer un compte | Home.jsx | "Créer un compte" |
| Me connecter | Login.jsx | "Se connecter" |
| Valider des employés | AdminDashboard.jsx | "Inscriptions" |
| Voir mon tableau de bord | EmployeeDashboard.jsx | (auto après login) |
| Comprendre l'architecture | ARCHITECTURE_COMPLETE.md | Lire EN PREMIER |
| Tester l'application | GUIDE_TEST_COMPLET.md | Lire les scénarios |

---

## 🎓 APPRENTISSAGE

**Voulez-vous comprendre...**

1. **Comment fonctionne l'inscription?**
   - Voir: `EmployeeService.register()`
   - Voir: `POST /api/employees/register`
   - Voir: `EmployeeRegistration.jsx`

2. **Comment fonctionne la connexion?**
   - Voir: `EmployeeService.login()`
   - Voir: `POST /api/employees/login`
   - Voir: `Login.jsx`

3. **Comment fonctionnent les statuts?**
   - Voir: `Entity/Employee.java` (enum StatutCompte)
   - Voir: `EmployeeService.validateEmployee()`
   - Voir: `EmployeeService.rejectEmployee()`
   - Voir: `Inscriptions.jsx`

4. **Comment fonctionne la sécurité?**
   - Voir: `SecurityConfig.java` (CORS, CSRF)
   - Voir: `EmployeeService` (BCrypt)
   - Voir: `Login.jsx` (OTP)

---

## ✅ CHECKLIST AVANT PRODUCTION

- [ ] Changer le mot de passe admin (actuellement "admin123")
- [ ] Configurer un vrai service OTP (SMS ou Email)
- [ ] Ajouter JWT pour authentication stateless
- [ ] Implémenter les emails de notification
- [ ] Ajouter les logs de sécurité
- [ ] Configurer HTTPS
- [ ] Augmenter les timeouts de session
- [ ] Ajouter rate limiting
- [ ] Tester avec de vrais emails
- [ ] Backup automatique de la BDD

---

## 📚 RESSOURCES SUPPLÉMENTAIRES

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- MySQL Documentation: https://dev.mysql.com/doc/
- Docker Documentation: https://docs.docker.com/
- BCrypt Documentation: https://github.com/spring-projects/spring-security

---

**🎉 Bienvenue dans HRFlow! 🎉**

Commencez par lire **ARCHITECTURE_COMPLETE.md** pour comprendre le système complet.

Ensuite, utilisez **GUIDE_TEST_COMPLET.md** pour tester chaque fonctionnalité.

Enfin, consultez **RESUME_MODIFICATIONS.md** pour voir les changements spécifiques.

**Bon développement! 🚀**
