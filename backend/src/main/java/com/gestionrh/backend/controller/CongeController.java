package com.gestionrh.backend.controller;

import com.gestionrh.backend.dto.Apiresponsedto;
import com.gestionrh.backend.dto.CongeDecisionDto;
import com.gestionrh.backend.dto.CongeRequestDto;
import com.gestionrh.backend.dto.CongeResponseDto;
import com.gestionrh.backend.service.CongeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conges")
@CrossOrigin(origins = "*")
public class CongeController {

    private final CongeService congeService;

    public CongeController(CongeService congeService) {
        this.congeService = congeService;
    }

    // Employé : créer une demande de congé
    @PostMapping("/employee/{employeeId}")
    public ResponseEntity<?> createConge(@PathVariable Long employeeId,
                                          @Valid @RequestBody CongeRequestDto requestDto) {
        try {
            CongeResponseDto conge = congeService.createConge(employeeId, requestDto);
            return ResponseEntity.ok(conge);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Apiresponsedto(false, e.getMessage()));
        }
    }

    // Employé : voir ses propres congés
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<CongeResponseDto>> getCongesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getCongesByEmployee(employeeId));
    }

    // Admin : voir toutes les demandes
    @GetMapping
    public ResponseEntity<List<CongeResponseDto>> getAllConges() {
        return ResponseEntity.ok(congeService.getAllConges());
    }

    // Admin : approuver
    @PutMapping("/{congeId}/approve")
    public ResponseEntity<?> approveConge(@PathVariable Long congeId,
                                           @RequestBody(required = false) CongeDecisionDto decision) {
        try {
            String commentaire = decision != null ? decision.getCommentaire() : null;
            return ResponseEntity.ok(congeService.approveConge(congeId, commentaire));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Apiresponsedto(false, e.getMessage()));
        }
    }

    // Admin : refuser
    @PutMapping("/{congeId}/reject")
    public ResponseEntity<?> rejectConge(@PathVariable Long congeId,
                                          @RequestBody(required = false) CongeDecisionDto decision) {
        try {
            String commentaire = decision != null ? decision.getCommentaire() : null;
            return ResponseEntity.ok(congeService.rejectConge(congeId, commentaire));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new Apiresponsedto(false, e.getMessage()));
        }
    }
}