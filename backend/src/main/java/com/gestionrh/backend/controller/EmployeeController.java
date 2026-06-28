package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.EmployeeResponseDto;
import com.gestionrh.backend.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
 
    private final EmployeeService employeeService;
 
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
 
    /** POST /api/employees/register — Inscription publique */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody EmployeeRequestDto dto) {
        try {
            EmployeeResponseDto response = employeeService.registerEmployee(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
 
    /** GET /api/employees — Tous les employés (admin) */
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }
 
    /** GET /api/employees/pending — Employés EN_ATTENTE */
    @GetMapping("/pending")
    public ResponseEntity<List<Employee>> getPendingEmployees() {
        return ResponseEntity.ok(employeeService.getByStatut(Employee.StatutCompte.EN_ATTENTE));
    }
 
    /** PUT /api/employees/{id}/valider — Approuver → VALIDE */
    @PutMapping("/{id}/valider")
    public ResponseEntity<?> valider(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(employeeService.updateStatut(id, Employee.StatutCompte.VALIDE));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
 
    /** PUT /api/employees/{id}/refuser — Rejeter → REJETE */
    @PutMapping("/{id}/refuser")
    public ResponseEntity<?> refuser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(employeeService.updateStatut(id, Employee.StatutCompte.REJETE));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}