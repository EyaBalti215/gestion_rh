package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.dto.ProfileResponseDto;
import com.gestionrh.backend.dto.ProfileUpdateDto;
import com.gestionrh.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class Profilecontroller {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam(required = true) String email) {
        try {
            Employee employee = employeeService.findByEmail(email);
            return ResponseEntity.ok(mapToDto(employee));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Profil introuvable pour l'email fourni.");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestParam(required = true) String email,
                                           @RequestBody ProfileUpdateDto dto) {
        try {
            Employee updated = employeeService.updateProfile(email, dto);
            return ResponseEntity.ok(mapToDto(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Impossible de mettre à jour le profil.");
        }
    }

    private ProfileResponseDto mapToDto(Employee employee) {
        return new ProfileResponseDto(
            employee.getId(),
            employee.getNom(),
            employee.getPrenom(),
            employee.getEmail(),
            employee.getTelephone(),
            employee.getAdresse(),
            employee.getPoste(),
            employee.getDepartement(),
            employee.getRole(),
            employee.getDateEmbauche(),
            employee.getPhotoUrl()
        );
    }
}
