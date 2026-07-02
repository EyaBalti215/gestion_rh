package com.gestionrh.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "pointage", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "date_pointage"})
})
public class Pointage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "date_pointage", nullable = false)
    private LocalDate datePointage;

    @Column(name = "heure_entree")
    private LocalTime heureEntree;

    @Column(name = "heure_sortie")
    private LocalTime heureSortie;

    @Enumerated(EnumType.STRING)
    private PointageStatut statut;

    public Pointage() {}

    // ---- Getters / Setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getDatePointage() { return datePointage; }
    public void setDatePointage(LocalDate datePointage) { this.datePointage = datePointage; }

    public LocalTime getHeureEntree() { return heureEntree; }
    public void setHeureEntree(LocalTime heureEntree) { this.heureEntree = heureEntree; }

    public LocalTime getHeureSortie() { return heureSortie; }
    public void setHeureSortie(LocalTime heureSortie) { this.heureSortie = heureSortie; }

    public PointageStatut getStatut() { return statut; }
    public void setStatut(PointageStatut statut) { this.statut = statut; }
}