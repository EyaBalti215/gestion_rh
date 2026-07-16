package com.gestionrh.backend.dto;

import java.time.LocalDate;

/**
 * DTO renvoyé au frontend pour afficher le profil (Admin ou Employé).
 * Adaptez les champs à ceux réellement présents dans votre entité Employee.java
 */
public class ProfileResponseDto {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String poste;
    private String departement;
    private String role;
    private LocalDate dateEmbauche;
    private String photoUrl;

    public ProfileResponseDto() {
    }

    public ProfileResponseDto(Long id, String nom, String prenom, String email, String telephone,
                               String adresse, String poste, String departement, String role,
                               LocalDate dateEmbauche, String photoUrl) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.adresse = adresse;
        this.poste = poste;
        this.departement = departement;
        this.role = role;
        this.dateEmbauche = dateEmbauche;
        this.photoUrl = photoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDate getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
