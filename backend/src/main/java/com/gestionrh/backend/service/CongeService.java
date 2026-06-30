package com.gestionrh.backend.service;

import com.gestionrh.backend.Repository.CongeRepository;
import com.gestionrh.backend.Repository.EmployeeRepository;
import com.gestionrh.backend.dto.CongeRequestDto;
import com.gestionrh.backend.dto.CongeResponseDto;
import com.gestionrh.backend.Entity.Conge;
import com.gestionrh.backend.Entity.CongeStatut;
import com.gestionrh.backend.Entity.Employee;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CongeService {

    private final CongeRepository congeRepository;
    private final EmployeeRepository employeeRepository;

    public CongeService(CongeRepository congeRepository, EmployeeRepository employeeRepository) {
        this.congeRepository = congeRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public CongeResponseDto createConge(Long employeeId, CongeRequestDto requestDto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (requestDto.getDateFin().isBefore(requestDto.getDateDebut())) {
            throw new RuntimeException("La date de fin doit être après la date de début");
        }

        int duree = (int) ChronoUnit.DAYS.between(requestDto.getDateDebut(), requestDto.getDateFin()) + 1;

        Conge conge = new Conge();
        conge.setEmployee(employee);
        conge.setType(requestDto.getType());
        conge.setDateDebut(requestDto.getDateDebut());
        conge.setDateFin(requestDto.getDateFin());
        conge.setDuree(duree);
        conge.setMotif(requestDto.getMotif());
        conge.setStatut(CongeStatut.EN_ATTENTE);

        Conge saved = congeRepository.save(conge);
        return CongeResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<CongeResponseDto> getCongesByEmployee(Long employeeId) {
        return congeRepository.findByEmployeeIdOrderByDateCreationDesc(employeeId)
                .stream().map(CongeResponseDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CongeResponseDto> getAllConges() {
        return congeRepository.findAllByOrderByDateCreationDesc()
                .stream().map(CongeResponseDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public CongeResponseDto approveConge(Long congeId, String commentaire) {
        Conge conge = congeRepository.findById(congeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));
        conge.setStatut(CongeStatut.APPROUVE);
        conge.setCommentaireAdmin(commentaire);
        conge.setDateTraitement(LocalDateTime.now());
        return CongeResponseDto.fromEntity(congeRepository.save(conge));
    }

    @Transactional
    public CongeResponseDto rejectConge(Long congeId, String commentaire) {
        Conge conge = congeRepository.findById(congeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));
        conge.setStatut(CongeStatut.REFUSE);
        conge.setCommentaireAdmin(commentaire);
        conge.setDateTraitement(LocalDateTime.now());
        return CongeResponseDto.fromEntity(congeRepository.save(conge));
    }
}