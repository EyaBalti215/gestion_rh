package com.gestionrh.backend.dto;

import com.gestionrh.backend.Entity.PointageStatut;
import java.time.LocalDate;
import java.time.LocalTime;

public class PointageResponseDto {

    private Long id;
    private Long employeeId;
    private String nom;
    private String prenom;
    private LocalDate datePointage;
    private LocalTime heureEntree;
    private LocalTime heureSortie;
    private Double totalHeures;
    private PointageStatut statut;

    public PointageResponseDto() {}

    public PointageResponseDto(Long id, Long employeeId, String nom, String prenom,
                                LocalDate datePointage, LocalTime heureEntree,
                                LocalTime heureSortie, Double totalHeures, PointageStatut statut) {
        this.id = id;
        this.employeeId = employeeId;
        this.nom = nom;
        this.prenom = prenom;
        this.datePointage = datePointage;
        this.heureEntree = heureEntree;
        this.heureSortie = heureSortie;
        this.totalHeures = totalHeures;
        this.statut = statut;
    }

    // ---- Getters / Setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public LocalDate getDatePointage() { return datePointage; }
    public void setDatePointage(LocalDate datePointage) { this.datePointage = datePointage; }
    public LocalTime getHeureEntree() { return heureEntree; }
    public void setHeureEntree(LocalTime heureEntree) { this.heureEntree = heureEntree; }
    public LocalTime getHeureSortie() { return heureSortie; }
    public void setHeureSortie(LocalTime heureSortie) { this.heureSortie = heureSortie; }
    public Double getTotalHeures() { return totalHeures; }
    public void setTotalHeures(Double totalHeures) { this.totalHeures = totalHeures; }
    public PointageStatut getStatut() { return statut; }
    public void setStatut(PointageStatut statut) { this.statut = statut; }
}