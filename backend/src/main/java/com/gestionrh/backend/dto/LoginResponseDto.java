package com.gestionrh.backend.dto;

public class LoginResponseDto {
    private boolean success;
    private String role;           // "ADMIN" ou "EMPLOYE"
    private String prenom;
    private String nom;
    private String email;
    private String statut;         // "EN_ATTENTE", "VALIDE", "REJETE"
    private String message;
    private Long id;

    // ── Constructeurs ────────────────────────────────────────────────────────
    
    public LoginResponseDto() {}

    public LoginResponseDto(boolean success, String role, String prenom, String nom, 
                           String email, String statut, String message, Long id) {
        this.success = success;
        this.role = role;
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.statut = statut;
        this.message = message;
        this.id = id;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
