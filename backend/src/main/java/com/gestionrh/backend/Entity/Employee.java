package com.gestionrh.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String prenom;
    private String nom;

    @Column(unique = true)
    private String email;

    private String telephone;
    private String adresse;
    private String poste;
    private String typeContrat;
    private String modeReglement;
    private String rib;

    @JsonIgnore                      // ← ne jamais renvoyer le hash au frontend
    @Column(name = "mot_de_passe")
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private StatutCompte statut = StatutCompte.EN_ATTENTE;

    @Enumerated(EnumType.STRING)
    private Role role = Role.EMPLOYE;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime validatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum StatutCompte { EN_ATTENTE, VALIDE, REJETE }
    public enum Role { ADMIN, EMPLOYE }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public String getTypeContrat() { return typeContrat; }
    public void setTypeContrat(String typeContrat) { this.typeContrat = typeContrat; }

    public String getModeReglement() { return modeReglement; }
    public void setModeReglement(String modeReglement) { this.modeReglement = modeReglement; }

    public String getRib() { return rib; }
    public void setRib(String rib) { this.rib = rib; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public StatutCompte getStatut() { return statut; }
    public void setStatut(StatutCompte statut) { this.statut = statut; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getValidatedAt() { return validatedAt; }
    public void setValidatedAt(LocalDateTime validatedAt) { this.validatedAt = validatedAt; }
}