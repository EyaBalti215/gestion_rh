package com.gestionrh.backend.controller;

import com.gestionrh.backend.dto.Apiresponsedto;
import com.gestionrh.backend.dto.PointageResponseDto;
import com.gestionrh.backend.service.PointageService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pointage")
@CrossOrigin
public class PointageController {

    private final PointageService pointageService;

    public PointageController(PointageService pointageService) {
        this.pointageService = pointageService;
    }

    // Employé : pointer l'entrée
    @PostMapping("/entree/{employeeId}")
    public PointageResponseDto pointerEntree(@PathVariable Long employeeId) {
        return pointageService.pointerEntree(employeeId);
    }

    // Employé : pointer la sortie
    @PostMapping("/sortie/{employeeId}")
    public PointageResponseDto pointerSortie(@PathVariable Long employeeId) {
        return pointageService.pointerSortie(employeeId);
    }

    // Employé : état du jour (pour savoir quel bouton afficher au chargement de la page)
    @GetMapping("/aujourdhui/{employeeId}")
    public PointageResponseDto getAujourdhui(@PathVariable Long employeeId) {
        return pointageService.getPointageDuJour(employeeId);
    }

    // Employé : historique
    @GetMapping("/historique/{employeeId}")
    public List<PointageResponseDto> getHistorique(@PathVariable Long employeeId) {
        return pointageService.getHistoriqueEmploye(employeeId);
    }

    // Admin : registre du jour (ou d'une date précise ?date=2026-06-24)
    @GetMapping("/registre")
    public List<PointageResponseDto> getRegistre(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate d = (date != null) ? date : LocalDate.now();
        return pointageService.getRegistreDuJour(d);
    }
}