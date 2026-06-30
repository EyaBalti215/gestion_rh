package com.gestionrh.backend.dto;

import com.gestionrh.backend.Entity.Conge;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CongeResponseDto {

    private Long id;
    private Long employeeId;
    private String employeeNom;
    private String type;
    private String typeLabel;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer duree;
    private String statut;
    private String statutLabel;
    private String motif;
    private String commentaireAdmin;
    private LocalDateTime dateCreation;
    private LocalDateTime dateTraitement;

    public static CongeResponseDto fromEntity(Conge conge) {
        CongeResponseDto dto = new CongeResponseDto();
        dto.id = conge.getId();
        dto.employeeId = conge.getEmployee().getId();
        dto.employeeNom = conge.getEmployee().getNom() + " " + conge.getEmployee().getPrenom();
        dto.type = conge.getType().name();
        dto.typeLabel = conge.getType().getLabel();
        dto.dateDebut = conge.getDateDebut();
        dto.dateFin = conge.getDateFin();
        dto.duree = conge.getDuree();
        dto.statut = conge.getStatut().name();
        dto.statutLabel = conge.getStatut().getLabel();
        dto.motif = conge.getMotif();
        dto.commentaireAdmin = conge.getCommentaireAdmin();
        dto.dateCreation = conge.getDateCreation();
        dto.dateTraitement = conge.getDateTraitement();
        return dto;
    }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeNom() { return employeeNom; }
    public void setEmployeeNom(String employeeNom) { this.employeeNom = employeeNom; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTypeLabel() { return typeLabel; }
    public void setTypeLabel(String typeLabel) { this.typeLabel = typeLabel; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public Integer getDuree() { return duree; }
    public void setDuree(Integer duree) { this.duree = duree; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getStatutLabel() { return statutLabel; }
    public void setStatutLabel(String statutLabel) { this.statutLabel = statutLabel; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getCommentaireAdmin() { return commentaireAdmin; }
    public void setCommentaireAdmin(String commentaireAdmin) { this.commentaireAdmin = commentaireAdmin; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public LocalDateTime getDateTraitement() { return dateTraitement; }
    public void setDateTraitement(LocalDateTime dateTraitement) { this.dateTraitement = dateTraitement; }
}