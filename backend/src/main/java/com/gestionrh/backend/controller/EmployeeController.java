package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.dto.ChangePasswordDto;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.Loginrequestdto;
import com.gestionrh.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getAll() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return employeeService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmployeeRequestDto dto) {
        try {
            Employee emp = employeeService.createEmployee(dto);
            return ResponseEntity.ok(Map.of(
                "message", "Employé créé avec succès. Les identifiants ont été envoyés par email.",
                "employee", emp
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur inattendue."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody EmployeeRequestDto dto) {
        return create(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Loginrequestdto dto) {
        try {
            return ResponseEntity.ok(employeeService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur inattendue."));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto dto) {
        try {
            Employee emp = employeeService.changePassword(dto);
            return ResponseEntity.ok(Map.of(
                "message", "Mot de passe changé avec succès.",
                "employee", emp
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur inattendue."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EmployeeRequestDto dto) {
        try {
            Employee emp = employeeService.updateEmployee(id, dto);
            return ResponseEntity.ok(Map.of(
                "message", "Employé mis à jour avec succès.",
                "employee", emp
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur inattendue."));
        }
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> valider(@PathVariable Long id) {
        try {
            Employee emp = employeeService.valider(id);
            return ResponseEntity.ok(Map.of("message", "Inscription validée.", "employee", emp));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/refuser")
    public ResponseEntity<?> refuser(@PathVariable Long id) {
        try {
            Employee emp = employeeService.refuser(id);
            return ResponseEntity.ok(Map.of("message", "Inscription refusée.", "employee", emp));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(Map.of("message", "Employé supprimé."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}