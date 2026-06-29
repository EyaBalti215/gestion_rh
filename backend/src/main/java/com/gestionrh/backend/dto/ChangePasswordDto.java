package com.gestionrh.backend.dto;

public class ChangePasswordDto {
    private Long id;
    private String ancienMotDePasse;
    private String nouveauMotDePasse;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAncienMotDePasse() { return ancienMotDePasse; }
    public void setAncienMotDePasse(String ancienMotDePasse) { this.ancienMotDePasse = ancienMotDePasse; }

    public String getNouveauMotDePasse() { return nouveauMotDePasse; }
    public void setNouveauMotDePasse(String nouveauMotDePasse) { this.nouveauMotDePasse = nouveauMotDePasse; }
}
