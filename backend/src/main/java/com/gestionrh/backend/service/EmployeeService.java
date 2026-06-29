package com.gestionrh.backend.service;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.EmployeeResponseDto;
import com.gestionrh.backend.dto.Loginrequestdto;
import com.gestionrh.backend.dto.LoginResponseDto;
import com.gestionrh.backend.Repository.EmployeeRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;
    private final BCryptPasswordEncoder encoder;

    // ── IDENTIFIANTS ADMIN (stockés en dur) ──────────────────────────────────
    private static final String ADMIN_EMAIL = "admin@hrflow.local";
    private static final String ADMIN_PASSWORD = "admin123";

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
        this.encoder = new BCryptPasswordEncoder();
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 🔐 1. INSCRIPTION EMPLOYÉ (CREATE ACCOUNT - PUBLIC)
    // ════════════════════════════════════════════════════════════════════════════

    public EmployeeResponseDto register(EmployeeRequestDto dto) {
        // Vérifier si l'email existe déjà
        String email = dto.getEmail().trim().toLowerCase();
        if (repo.existsByEmail(email)) {
            throw new RuntimeException("❌ Un compte avec cet e-mail existe déjà.");
        }

        // Créer un nouvel employé
        Employee emp = new Employee();
        emp.setPrenom(dto.getPrenom().trim());
        emp.setNom(dto.getNom().trim());
        emp.setEmail(email);
        emp.setTelephone(dto.getTelephone().trim());
        emp.setAdresse(dto.getAdresse().trim());
        emp.setPoste(dto.getPoste().trim());
        emp.setTypeContrat(dto.getTypeContrat() != null ? dto.getTypeContrat() : "CDI");
        emp.setModeReglement(dto.getModeReglement() != null ? dto.getModeReglement() : "Virement bancaire");
        emp.setRib(dto.getRib().trim());
        emp.setMotDePasse(encoder.encode(dto.getMotDePasse())); // 🔐 Hash BCrypt
        emp.setRole(Employee.Role.EMPLOYE);
        emp.setStatut(Employee.StatutCompte.EN_ATTENTE);

        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ Bienvenue " + saved.getPrenom() + " " + saved.getNom() +
            " ! Votre inscription a été reçue. " +
            "Un administrateur validera votre profil avant d'accéder à la plateforme."
        );
    }

    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (repo.existsByEmail(email)) {
            throw new RuntimeException("❌ Un compte avec cet e-mail existe déjà.");
        }

        Employee emp = new Employee();
        emp.setPrenom(dto.getPrenom().trim());
        emp.setNom(dto.getNom().trim());
        emp.setEmail(email);
        emp.setTelephone(dto.getTelephone() != null ? dto.getTelephone().trim() : "");
        emp.setAdresse(dto.getAdresse() != null ? dto.getAdresse().trim() : "");
        emp.setPoste(dto.getPoste() != null ? dto.getPoste().trim() : "");
        emp.setTypeContrat(dto.getTypeContrat() != null ? dto.getTypeContrat() : "CDI");
        emp.setModeReglement(dto.getModeReglement() != null ? dto.getModeReglement() : "Virement bancaire");
        emp.setRib(dto.getRib() != null ? dto.getRib().trim() : "");
        emp.setMotDePasse(encoder.encode(
            dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()
                ? dto.getMotDePasse().trim()
                : generateTempPassword()
        ));
        emp.setRole(Employee.Role.EMPLOYE);
        emp.setStatut(Employee.StatutCompte.VALIDE);
        emp.setValidatedAt(LocalDateTime.now());

        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ Nouvel employé créé avec succès."
        );
    }

    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto dto) {
        Employee emp = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("❌ Employé non trouvé."));

        String email = dto.getEmail().trim().toLowerCase();
        if (!email.equals(emp.getEmail()) && repo.existsByEmail(email)) {
            throw new RuntimeException("❌ Un autre compte utilise déjà cet e-mail.");
        }

        emp.setPrenom(dto.getPrenom().trim());
        emp.setNom(dto.getNom().trim());
        emp.setEmail(email);
        emp.setTelephone(dto.getTelephone() != null ? dto.getTelephone().trim() : "");
        emp.setAdresse(dto.getAdresse() != null ? dto.getAdresse().trim() : "");
        emp.setPoste(dto.getPoste() != null ? dto.getPoste().trim() : "");
        emp.setTypeContrat(dto.getTypeContrat() != null ? dto.getTypeContrat() : emp.getTypeContrat());
        emp.setModeReglement(dto.getModeReglement() != null ? dto.getModeReglement() : emp.getModeReglement());
        emp.setRib(dto.getRib() != null ? dto.getRib().trim() : emp.getRib());

        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ Les informations de l'employé ont été mises à jour avec succès."
        );
    }

    private String generateTempPassword() {
        return "Temp" + System.currentTimeMillis() % 100000 + "!";
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 🔑 2. CONNEXION UNIFIÉE (LOGIN - ADMIN + EMPLOYÉ)
    // ════════════════════════════════════════════════════════════════════════════

    public LoginResponseDto login(Loginrequestdto dto) {
        String email = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : "";
        String motDePasse = dto.getMotDePasse();

        boolean isDefaultAdminLogin = ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(motDePasse);

        // Fallback local sûr : si l'admin par défaut tente de se connecter et que la ligne n'existe pas encore,
        // on la crée automatiquement avec le bon rôle/statut.
        if (isDefaultAdminLogin) {
            Employee existingAdmin = repo.findByEmail(email).orElse(null);
            if (existingAdmin == null) {
                Employee createdAdmin = new Employee();
                createdAdmin.setPrenom("Admin");
                createdAdmin.setNom("System");
                createdAdmin.setEmail(email);
                createdAdmin.setTelephone("+213500000000");
                createdAdmin.setAdresse("Siège administratif");
                createdAdmin.setPoste("Administrateur");
                createdAdmin.setTypeContrat("CDI");
                createdAdmin.setModeReglement("Virement bancaire");
                createdAdmin.setRib("XXXXXXXXXXXXXX");
                createdAdmin.setMotDePasse(encoder.encode(ADMIN_PASSWORD));
                createdAdmin.setRole(Employee.Role.ADMIN);
                createdAdmin.setStatut(Employee.StatutCompte.VALIDE);
                createdAdmin.setValidatedAt(LocalDateTime.now());
                existingAdmin = repo.save(createdAdmin);
            } else if (existingAdmin.getRole() != Employee.Role.ADMIN || existingAdmin.getStatut() != Employee.StatutCompte.VALIDE) {
                existingAdmin.setRole(Employee.Role.ADMIN);
                existingAdmin.setStatut(Employee.StatutCompte.VALIDE);
                existingAdmin.setValidatedAt(LocalDateTime.now());
                existingAdmin.setMotDePasse(encoder.encode(ADMIN_PASSWORD));
                existingAdmin = repo.save(existingAdmin);
            }

            return new LoginResponseDto(
                true,
                "ADMIN",
                existingAdmin.getPrenom(),
                existingAdmin.getNom(),
                existingAdmin.getEmail(),
                existingAdmin.getStatut().name(),
                "✅ Bienvenue administrateur !",
                existingAdmin.getId()
            );
        }

        // Chercher l'utilisateur en BD (admin OU employé)
        Employee emp = repo.findByEmail(email).orElse(null);

        if (emp == null) {
            return new LoginResponseDto(
                false,
                null,
                null, null, null, null,
                "❌ Aucun compte trouvé avec cet e-mail.",
                null
            );
        }

        // Vérifier le mot de passe (BCrypt)
        if (!encoder.matches(motDePasse, emp.getMotDePasse())) {
            return new LoginResponseDto(
                false,
                null,
                null, null, null, null,
                "❌ Mot de passe incorrect.",
                null
            );
        }

        // ── CAS 1 : CONNEXION ADMINISTRATEUR ─────────────────────────────────
        if (emp.getRole() == Employee.Role.ADMIN) {
            // Admin doit être VALIDE
            if (emp.getStatut() != Employee.StatutCompte.VALIDE) {
                return new LoginResponseDto(
                    false,
                    null,
                    null, null, null, null,
                    "❌ Compte administrateur inactif.",
                    null
                );
            }
            return new LoginResponseDto(
                true,
                "ADMIN",
                emp.getPrenom(),
                emp.getNom(),
                emp.getEmail(),
                emp.getStatut().name(),
                "✅ Bienvenue administrateur !",
                emp.getId()
            );
        }

        // ── CAS 2 : CONNEXION EMPLOYÉ ──────────────────────────────────────
        if (emp.getStatut() == Employee.StatutCompte.EN_ATTENTE) {
            return new LoginResponseDto(
                false,
                null,
                emp.getPrenom(), emp.getNom(), emp.getEmail(),
                emp.getStatut().name(),
                "⏳ Votre compte est en attente de validation par un administrateur.",
                emp.getId()
            );
        }

        if (emp.getStatut() == Employee.StatutCompte.REJETE) {
            return new LoginResponseDto(
                false,
                null,
                emp.getPrenom(), emp.getNom(), emp.getEmail(),
                emp.getStatut().name(),
                "❌ Votre demande d'inscription a été refusée. Contactez l'administrateur.",
                emp.getId()
            );
        }

        // ✅ EMPLOYÉ VALIDÉ → Accès autorisé
        return new LoginResponseDto(
            true,
            "EMPLOYE",
            emp.getPrenom(),
            emp.getNom(),
            emp.getEmail(),
            emp.getStatut().name(),
            "✅ Bienvenue " + emp.getPrenom() + " " + emp.getNom() + " !",
            emp.getId()
        );
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 👨‍💼 3. GESTION ADMINISTRATEUR (VOIR & VALIDER/REFUSER)
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Lister tous les employés
     */
    public List<Employee> getAllEmployees() {
        return repo.findAll();
    }

    /**
     * Lister employés par statut
     */
    public List<Employee> getEmployeesByStatut(Employee.StatutCompte statut) {
        return repo.findByStatut(statut);
    }

    /**
     * Voir les employés EN_ATTENTE (validation)
     */
    public List<Employee> getPendingEmployees() {
        return repo.findByStatut(Employee.StatutCompte.EN_ATTENTE);
    }

    /**
     * Valider un employé (Admin)
     */
    public EmployeeResponseDto validateEmployee(Long id) {
        Employee emp = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("❌ Employé non trouvé."));

        if (emp.getStatut() != Employee.StatutCompte.EN_ATTENTE) {
            throw new RuntimeException("❌ Cet employé a déjà été traité.");
        }

        emp.setStatut(Employee.StatutCompte.VALIDE);
        emp.setValidatedAt(LocalDateTime.now());
        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ " + saved.getPrenom() + " " + saved.getNom() +
            " a été validé(e) avec succès. Il/elle peut maintenant se connecter."
        );
    }

    /**
     * Refuser un employé (Admin)
     */
    public EmployeeResponseDto rejectEmployee(Long id) {
        Employee emp = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("❌ Employé non trouvé."));

        if (emp.getStatut() != Employee.StatutCompte.EN_ATTENTE) {
            throw new RuntimeException("❌ Cet employé a déjà été traité.");
        }

        emp.setStatut(Employee.StatutCompte.REJETE);
        emp.setValidatedAt(LocalDateTime.now());
        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "❌ La demande de " + saved.getPrenom() + " " + saved.getNom() +
            " a été refusée."
        );
    }

    /**
     * Chercher un employé par ID
     */
    public Employee getEmployeeById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("❌ Employé non trouvé."));
    }
    public EmployeeResponseDto resetPasswordByEmail(String email, String nouveauPass) {
        Employee emp = repo.findByEmail(email.trim().toLowerCase())
            .orElseThrow(() -> new RuntimeException("❌ Aucun compte trouvé avec cet e-mail."));

        if (nouveauPass == null || nouveauPass.trim().isEmpty()) {
            throw new RuntimeException("❌ Le nouveau mot de passe ne peut pas être vide.");
        }
        if (nouveauPass.length() < 8) {
            throw new RuntimeException("❌ Le mot de passe doit contenir au moins 8 caractères.");
        }

        emp.setMotDePasse(encoder.encode(nouveauPass));
        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ Mot de passe réinitialisé avec succès."
        );
    }
    // ════════════════════════════════════════════════════════════════════════════════
    // 🔐 CHANGEMENT DE MOT DE PASSE
    // ════════════════════════════════════════════════════════════════════════════════

    public EmployeeResponseDto changePassword(Long id, String ancienPass, String nouveauPass) {
        Employee emp = getEmployeeById(id);

        // Vérifier ancien mot de passe
        if (!encoder.matches(ancienPass, emp.getMotDePasse())) {
            throw new RuntimeException("❌ L'ancien mot de passe est incorrect.");
        }

        // Vérifier que le nouveau n'est pas vide
        if (nouveauPass == null || nouveauPass.trim().isEmpty()) {
            throw new RuntimeException("❌ Le nouveau mot de passe ne peut pas être vide.");
        }

        // Vérifier longueur minimale
        if (nouveauPass.length() < 8) {
            throw new RuntimeException("❌ Le mot de passe doit contenir au moins 8 caractères.");
        }

        // Encoder et sauvegarder
        emp.setMotDePasse(encoder.encode(nouveauPass));
        Employee saved = repo.save(emp);

        return new EmployeeResponseDto(
            saved.getId(),
            saved.getPrenom(),
            saved.getNom(),
            saved.getEmail(),
            saved.getStatut().name(),
            "✅ Mot de passe changé avec succès."
        );
    }
}