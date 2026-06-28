package com.gestionrh.backend.dto;

public class EmployeeResponseDto {
 
    private Long id;
    private String prenom;
    private String nom;
    private String email;
    private String statut;
    private String message;
 
    public EmployeeResponseDto() {}
 
    public EmployeeResponseDto(Long id, String prenom, String nom, String email,
                                String statut, String message) {
        this.id = id;
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.statut = statut;
        this.message = message;
    }
 
    // ── Getters & Setters ──────────────────────────────────────────────────────
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
 
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
 
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
 
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
 
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
 
