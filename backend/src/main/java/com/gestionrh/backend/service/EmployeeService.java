package com.gestionrh.backend.service;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.Repository.EmployeeRepository;
import com.gestionrh.backend.dto.EmployeeRequestDto;
import com.gestionrh.backend.dto.EmployeeResponseDto;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
 
import java.util.List;
 
@Service
public class EmployeeService {
 
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;
 
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder    = new BCryptPasswordEncoder();
    }
 
    // ── Inscription ──────────────────────────────────────────────────────────
 
    public EmployeeResponseDto registerEmployee(EmployeeRequestDto dto) {
 
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Un compte avec cet e-mail existe déjà.");
        }
 
        Employee emp = new Employee();
        emp.setPrenom(dto.getPrenom());
        emp.setNom(dto.getNom());
        emp.setEmail(dto.getEmail());
        emp.setTelephone(dto.getTelephone());
        emp.setAdresse(dto.getAdresse());
        emp.setPoste(dto.getPoste());
        emp.setTypeContrat(dto.getTypeContrat());
        emp.setModeReglement(dto.getModeReglement());
        emp.setRib(dto.getRib());
        emp.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse())); // 🔐 BCrypt
        emp.setStatut(Employee.StatutCompte.EN_ATTENTE);
 
        Employee saved = employeeRepository.save(emp);
        return toResponse(saved,
            "Bienvenue " + saved.getPrenom() + " " + saved.getNom() +
            " ! Votre demande a été soumise. Vous devez attendre la validation " +
            "de l'administrateur pour accéder à votre plateforme."
        );
    }
 
    // ── Lister ──────────────────────────────────────────────────────────────
 
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
 
    public List<Employee> getByStatut(Employee.StatutCompte statut) {
        return employeeRepository.findByStatut(statut);
    }
 
    // ── Valider / Refuser ────────────────────────────────────────────────────
 
    public EmployeeResponseDto updateStatut(Long id, Employee.StatutCompte newStatut) {
        Employee emp = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employé introuvable."));
 
        emp.setStatut(newStatut);
        Employee saved = employeeRepository.save(emp);
 
        String msg = newStatut == Employee.StatutCompte.VALIDE
            ? "Le compte de " + saved.getPrenom() + " " + saved.getNom() + " a été validé."
            : "Le compte de " + saved.getPrenom() + " " + saved.getNom() + " a été refusé.";
 
        return toResponse(saved, msg);
    }
 
    // ── Helper ───────────────────────────────────────────────────────────────
 
    private EmployeeResponseDto toResponse(Employee e, String message) {
        return new EmployeeResponseDto(
            e.getId(), e.getPrenom(), e.getNom(),
            e.getEmail(), e.getStatut().name(), message
        );
    }
}