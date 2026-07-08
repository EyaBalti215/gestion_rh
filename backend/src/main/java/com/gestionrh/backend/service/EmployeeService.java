package com.gestionrh.backend.service;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.Repository.EmployeeRepository;
import com.gestionrh.backend.dto.ChangePasswordDto;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.LoginResponseDto;
import com.gestionrh.backend.dto.Loginrequestdto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ── CRUD ──────────────────────────────────────────────────────

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(EmployeeRequestDto dto) {
        if (dto.getLogin() == null || dto.getLogin().isBlank()) {
            throw new IllegalArgumentException("Le login est obligatoire.");
        }
        if (employeeRepository.existsByLogin(dto.getLogin())) {
            throw new IllegalArgumentException("Ce login est déjà utilisé.");
        }
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        String rawPassword = dto.getMotDePasse();
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generatePassword();
        }

        Employee emp = new Employee();
        mapDtoToEmployee(dto, emp);
        emp.setPassword(passwordEncoder.encode(rawPassword));
        emp.setStatut("EN_ATTENTE");

        Employee saved = employeeRepository.save(emp);
        sendCredentialsEmail(saved.getEmail(), saved.getPrenom(), saved.getLogin(), rawPassword);

        return saved;
    }

    public Employee updateEmployee(Long id, EmployeeRequestDto dto) {
        Employee emp = employeeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employé introuvable."));

        if (dto.getLogin() != null && !dto.getLogin().equals(emp.getLogin())) {
            if (employeeRepository.existsByLogin(dto.getLogin())) {
                throw new IllegalArgumentException("Ce login est déjà utilisé.");
            }
        }

        mapDtoToEmployee(dto, emp);
        return employeeRepository.save(emp);
    }

    public Employee changePassword(ChangePasswordDto dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("L'ID de l'employé est requis.");
        }
        Employee emp = employeeRepository.findById(dto.getId())
            .orElseThrow(() -> new IllegalArgumentException("Employé introuvable."));

        if (dto.getAncienMotDePasse() == null || dto.getAncienMotDePasse().isBlank() ||
            dto.getNouveauMotDePasse() == null || dto.getNouveauMotDePasse().isBlank()) {
            throw new IllegalArgumentException("Les deux mots de passe sont requis.");
        }

        if (!passwordEncoder.matches(dto.getAncienMotDePasse(), emp.getPassword())) {
            throw new IllegalArgumentException("L'ancien mot de passe est incorrect.");
        }

        if (dto.getAncienMotDePasse().equals(dto.getNouveauMotDePasse())) {
            throw new IllegalArgumentException("Le nouveau mot de passe doit être différent de l'ancien.");
        }

        emp.setPassword(passwordEncoder.encode(dto.getNouveauMotDePasse()));
        return employeeRepository.save(emp);
    }

    public Employee valider(Long id) {
        Employee emp = employeeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employé introuvable."));
        emp.setStatut("VALIDE");
        return employeeRepository.save(emp);
    }

    public Employee refuser(Long id) {
        Employee emp = employeeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employé introuvable."));
        emp.setStatut("REJETE");
        return employeeRepository.save(emp);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employé introuvable.");
        }
        employeeRepository.deleteById(id);
    }

    // ── LOGIN ─────────────────────────────────────────────────────

    /**
     * Connexion par email + mot de passe.
     * Gère le compte admin hardcodé si aucun admin n'existe en base.
     */
    public LoginResponseDto login(Loginrequestdto dto) {
        final String ADMIN_EMAIL = "admin@hrflow.local";
        final String ADMIN_PASSWORD = "admin123";

        // Cas admin hardcodé
        if (ADMIN_EMAIL.equals(dto.getEmail())) {
            Optional<Employee> existing = employeeRepository.findByEmail(ADMIN_EMAIL);

            if (existing.isEmpty()) {
                // Créer l'admin en base automatiquement
                Employee admin = new Employee();
                admin.setPrenom("Admin");
                admin.setNom("System");
                admin.setEmail(ADMIN_EMAIL);
                admin.setLogin("admin");
                admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                admin.setStatut("VALIDE");
                admin.setPoste("Administrateur");
                admin.setTypeContrat("CDI");
                Employee savedAdmin = employeeRepository.save(admin);

                LoginResponseDto response = new LoginResponseDto();
                response.setSuccess(true);
                response.setRole("ADMIN");
                response.setMessage("✅ Bienvenue administrateur !");
                response.setPrenom(savedAdmin.getPrenom());
                response.setNom(savedAdmin.getNom());
                response.setEmail(savedAdmin.getEmail());
                response.setEmployeeId(savedAdmin.getId());
                return response;
            }

            Employee admin = existing.get();
            boolean passwordMatches = admin.getPassword() != null && passwordEncoder.matches(dto.getMotDePasse(), admin.getPassword());
            if (passwordMatches || ADMIN_PASSWORD.equals(dto.getMotDePasse())) {
                if (admin.getPassword() == null || !passwordEncoder.matches(ADMIN_PASSWORD, admin.getPassword())) {
                    admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                    employeeRepository.save(admin);
                }

                LoginResponseDto response = new LoginResponseDto();
                response.setSuccess(true);
                response.setRole("ADMIN");
                response.setMessage("✅ Bienvenue administrateur !");
                response.setPrenom(admin.getPrenom());
                response.setNom(admin.getNom());
                response.setEmail(admin.getEmail());
                response.setEmployeeId(admin.getId());
                return response;
            } else {
                LoginResponseDto response = new LoginResponseDto();
                response.setSuccess(false);
                response.setMessage("Mot de passe incorrect.");
                return response;
            }
        }

        // Connexion employé standard
        Optional<Employee> empOpt = employeeRepository.findByEmail(dto.getEmail());

        if (empOpt.isEmpty()) {
            LoginResponseDto response = new LoginResponseDto();
            response.setSuccess(false);
            response.setMessage("Aucun compte trouvé pour cet email.");
            return response;
        }

        Employee emp = empOpt.get();

        if (!"VALIDE".equals(emp.getStatut())) {
            LoginResponseDto response = new LoginResponseDto();
            response.setSuccess(false);
            response.setMessage("Votre compte est en attente de validation.");
            return response;
        }

        if (!passwordEncoder.matches(dto.getMotDePasse(), emp.getPassword())) {
            LoginResponseDto response = new LoginResponseDto();
            response.setSuccess(false);
            response.setMessage("Mot de passe incorrect.");
            return response;
        }

        LoginResponseDto response = new LoginResponseDto();
        response.setSuccess(true);
        response.setRole("EMPLOYE");
        response.setMessage("✅ Connexion réussie.");
        response.setEmployeeId(emp.getId());
        response.setPrenom(emp.getPrenom());
        response.setNom(emp.getNom());
        response.setEmail(emp.getEmail());
        return response;
    }

    // ── RESET PASSWORD ────────────────────────────────────────────

    /**
     * Réinitialise le mot de passe d'un employé identifié par email.
     */
    public void resetPasswordByEmail(String email, String nouveauMotDePasse) {
        Employee emp = employeeRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Aucun compte trouvé pour l'email : " + email));

        emp.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        employeeRepository.save(emp);
    }

    // ── Helpers ───────────────────────────────────────────────────

    private void mapDtoToEmployee(EmployeeRequestDto dto, Employee emp) {
        emp.setPrenom(dto.getPrenom());
        emp.setNom(dto.getNom());
        emp.setEmail(dto.getEmail());
        emp.setTelephone(dto.getTelephone());
        emp.setAdresse(dto.getAdresse());
        emp.setPoste(dto.getPoste());
        emp.setTypeContrat(dto.getTypeContrat());
        emp.setModeReglement(dto.getModeReglement());
        emp.setRib(dto.getRib());
        if (dto.getLogin() != null && !dto.getLogin().isBlank()) {
            emp.setLogin(dto.getLogin());
        }
    }

    private String generatePassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    private void sendCredentialsEmail(String to, String prenom, String login, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("🔐 Vos accès à la plateforme RH");
            message.setText(
                "Bonjour " + prenom + ",\n\n" +
                "Votre compte a été créé sur la plateforme de gestion RH.\n\n" +
                "Vos identifiants de connexion :\n" +
                "  Login        : " + login + "\n" +
                "  Mot de passe : " + password + "\n\n" +
                "Veuillez vous connecter et modifier votre mot de passe dès que possible.\n\n" +
                "Cordialement,\nL'équipe RH"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("⚠️ Échec envoi email à " + to + " : " + e.getMessage());
        }
    }
}