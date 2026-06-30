package com.gestionrh.backend.dto;

import com.gestionrh.backend.Entity.CongeType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CongeRequestDto {

    @NotNull(message = "Le type de congé est obligatoire")
    private CongeType type;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    private String motif;

    public CongeType getType() { return type; }
    public void setType(CongeType type) { this.type = type; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
}