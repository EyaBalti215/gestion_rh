package com.gestionrh.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private String periodicite; // Mensuel, Annuel, Trimestriel, Semestriel

    @Column(name = "date_renouvellement")
    private LocalDate dateRenouvellement;

    @Column(nullable = false)
    private String statut = "Actif"; // Actif, Inactif

    public Service() {}

    public Service(String nom, String type, Double prix, String periodicite, LocalDate dateRenouvellement, String statut) {
        this.nom = nom;
        this.type = type;
        this.prix = prix;
        this.periodicite = periodicite;
        this.dateRenouvellement = dateRenouvellement;
        this.statut = statut;
    }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    public String getPeriodicite() { return periodicite; }
    public void setPeriodicite(String periodicite) { this.periodicite = periodicite; }

    public LocalDate getDateRenouvellement() { return dateRenouvellement; }
    public void setDateRenouvellement(LocalDate dateRenouvellement) { this.dateRenouvellement = dateRenouvellement; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
