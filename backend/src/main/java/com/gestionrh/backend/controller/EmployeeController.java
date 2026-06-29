package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.EmployeeResponseDto;
import com.gestionrh.backend.dto.Loginrequestdto;
import com.gestionrh.backend.dto.LoginResponseDto;
import com.gestionrh.backend.dto.ChangePasswordDto;
import com.gestionrh.backend.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 🆕 PUBLIC : INSCRIPTION EMPLOYÉ
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * POST /api/employees/register
     * ✅ Inscription d'un NOUVEL employé (formulaire public employé)
     * → Créer un compte → EN_ATTENTE → Attendre validation admin
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody EmployeeRequestDto dto) {
        try {
            EmployeeResponseDto response = service.register(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 🔑 PUBLIC : CONNEXION (LOGIN)
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * POST /api/employees/login
     * ✅ Connexion unifiée ADMIN + EMPLOYÉ
     * Admin → OTP required
     * Employé → Seulement si VALIDE
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody Loginrequestdto dto) {
        LoginResponseDto response = service.login(dto);
        return ResponseEntity.ok(response);
    }

    // ════════════════════════════════════════════════════════════════════════════
    // 👨‍💼 ADMIN : GESTION DES EMPLOYÉS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * GET /api/employees
     * Liste TOUS les employés (pour admin)
     */
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = service.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    /**
     * POST /api/employees
     * Créer un nouvel employé depuis l'administration
     */
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeRequestDto dto) {
        try {
            EmployeeResponseDto response = service.createEmployee(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    /**
     * PUT /api/employees/{id}
     * Mettre à jour un employé existant depuis l'administration
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequestDto dto) {
        try {
            EmployeeResponseDto response = service.updateEmployee(id, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    /**
     * GET /api/employees/pending
     * Liste employés EN ATTENTE DE VALIDATION (pour admin)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Employee>> getPendingEmployees() {
        List<Employee> pending = service.getPendingEmployees();
        return ResponseEntity.ok(pending);
    }

    /**
     * GET /api/employees/{id}
     * Détails d'un employé
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            Employee employee = service.getEmployeeById(id);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PUT /api/employees/{id}/valider
     * ✅ ADMIN valide un employé → EN_ATTENTE ➜ VALIDE
     * → L'employé peut maintenant se connecter
     */
    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validateEmployee(@PathVariable Long id) {
        try {
            EmployeeResponseDto response = service.validateEmployee(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    /**
     * PUT /api/employees/{id}/refuser
     * ❌ ADMIN rejette un employé → EN_ATTENTE ➜ REJETE
     * → L'employé reçoit un message d'erreur
     */
    @PutMapping("/{id}/refuser")
    public ResponseEntity<?> rejectEmployee(@PathVariable Long id) {
        try {
            EmployeeResponseDto response = service.rejectEmployee(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    // ════════════════════════════════════════════════════════════════════════════════
    // 🔐 CHANGEMENT DE MOT DE PASSE
    // ════════════════════════════════════════════════════════════════════════════════

    /**
     * PUT /api/employees/change-password
     * 🔐 Changer le mot de passe (ADMIN + EMPLOYÉ)
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto dto) {
        try {
            if (dto.getId() == null || dto.getId() <= 0) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "error", "ID utilisateur manquant.")
                );
            }
            EmployeeResponseDto response = service.changePassword(
                dto.getId(),
                dto.getAncienMotDePasse(),
                dto.getNouveauMotDePasse()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                Map.of("success", false, "error", e.getMessage())
            );
        }
    }
}