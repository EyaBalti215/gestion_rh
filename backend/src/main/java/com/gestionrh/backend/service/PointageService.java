package com.gestionrh.backend.service;

import com.gestionrh.backend.Entity.*;
import com.gestionrh.backend.Repository.CongeRepository;
import com.gestionrh.backend.Repository.EmployeeRepository;
import com.gestionrh.backend.Repository.PointageRepository;
import com.gestionrh.backend.dto.PointageResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointageService {

    private final PointageRepository pointageRepository;
    private final EmployeeRepository employeeRepository;
    private final CongeRepository congeRepository;

    public PointageService(PointageRepository pointageRepository,
                            EmployeeRepository employeeRepository,
                            CongeRepository congeRepository) {
        this.pointageRepository = pointageRepository;
        this.employeeRepository = employeeRepository;
        this.congeRepository = congeRepository;
    }

    // ----- Employé clique sur "Enregistrer mon Entrée" -----
    public PointageResponseDto pointerEntree(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        LocalDate today = LocalDate.now();

        Optional<Pointage> existant = pointageRepository
                .findByEmployeeIdAndDatePointage(employeeId, today);

        if (existant.isPresent()) {
            throw new RuntimeException("Vous avez déjà pointé votre entrée aujourd'hui.");
        }

        Pointage pointage = new Pointage();
        pointage.setEmployee(employee);
        pointage.setDatePointage(today);
        pointage.setHeureEntree(LocalTime.now());
        pointage.setStatut(PointageStatut.EN_COURS);

        Pointage saved = pointageRepository.save(pointage);
        return toDto(saved);
    }

    // ----- Employé clique sur "Enregistrer ma Sortie" -----
    public PointageResponseDto pointerSortie(Long employeeId) {
        LocalDate today = LocalDate.now();

        Pointage pointage = pointageRepository
                .findByEmployeeIdAndDatePointage(employeeId, today)
                .orElseThrow(() -> new RuntimeException("Vous n'avez pas encore pointé votre entrée."));

        if (pointage.getHeureSortie() != null) {
            throw new RuntimeException("Vous avez déjà pointé votre sortie aujourd'hui.");
        }

        pointage.setHeureSortie(LocalTime.now());
        pointage.setStatut(PointageStatut.PRESENT);

        Pointage saved = pointageRepository.save(pointage);
        return toDto(saved);
    }

    // ----- Etat du pointage du jour pour un employé (pour afficher le bouton correct) -----
    public PointageResponseDto getPointageDuJour(Long employeeId) {
        LocalDate today = LocalDate.now();
        return pointageRepository.findByEmployeeIdAndDatePointage(employeeId, today)
                .map(this::toDto)
                .orElse(null); // pas encore pointé
    }

    // ----- Historique d'un employé -----
    public List<PointageResponseDto> getHistoriqueEmploye(Long employeeId) {
        return pointageRepository.findByEmployeeIdOrderByDatePointageDesc(employeeId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ----- Vue Admin : registre complet d'une date pour TOUS les employés -----
    public List<PointageResponseDto> getRegistreDuJour(LocalDate date) {
        List<Employee> employees = employeeRepository.findAll();

        return employees.stream().map(emp -> {
            Optional<Pointage> pointageOpt = pointageRepository
                    .findByEmployeeIdAndDatePointage(emp.getId(), date);

            if (pointageOpt.isPresent()) {
                return toDto(pointageOpt.get());
            }

            // Aucun pointage trouvé : est-il en congé ce jour-là ?
            boolean enConge = congeRepository.findAll().stream().anyMatch(c ->
                    c.getEmployee().getId().equals(emp.getId())
                    && c.getStatut() == CongeStatut.APPROUVE
                    && !date.isBefore(c.getDateDebut())
                    && !date.isAfter(c.getDateFin())
            );

            PointageStatut statut = enConge ? PointageStatut.CONGE : PointageStatut.ABSENT;

            return new PointageResponseDto(
                    null, emp.getId(), emp.getNom(), emp.getPrenom(),
                    date, null, null, null, statut
            );
        }).collect(Collectors.toList());
    }

    // ----- Conversion Entity -> DTO avec calcul du total d'heures -----
    private PointageResponseDto toDto(Pointage p) {
        Double total = null;
        if (p.getHeureEntree() != null && p.getHeureSortie() != null) {
            Duration d = Duration.between(p.getHeureEntree(), p.getHeureSortie());
            total = Math.round((d.toMinutes() / 60.0) * 100.0) / 100.0; // ex: 9.55h
        }

        return new PointageResponseDto(
                p.getId(), p.getEmployee().getId(),
                p.getEmployee().getNom(), p.getEmployee().getPrenom(),
                p.getDatePointage(), p.getHeureEntree(), p.getHeureSortie(),
                total, p.getStatut()
        );
    }
}