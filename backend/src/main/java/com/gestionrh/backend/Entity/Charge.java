package com.gestionrh.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "charges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Charge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String designation;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fournisseur_id", nullable = false)
    private Fournisseur fournisseur;
    
    @Column(nullable = false)
    private Double montant;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private String statut; // "Payée", "En attente"
    
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDate.now();
        }
        if (date == null) {
            date = LocalDate.now();
        }
        if (statut == null) {
            statut = "En attente";
        }
    }
}
