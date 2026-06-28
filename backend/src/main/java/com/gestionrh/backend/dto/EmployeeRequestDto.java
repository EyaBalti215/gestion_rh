package com.gestionrh.backend.dto;

public class EmployeeRequestDto {
 
    private String prenom;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String poste;
    private String typeContrat;
    private String modeReglement;
    private String rib;
    private String motDePasse;
 
    // ── Getters & Setters ──────────────────────────────────────────────────────
 
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
}