package com.gestionrh.backend.dto;

/**
 * DTO utilisé quand l'utilisateur modifie ses informations de profil.
 * On ne permet volontairement PAS de changer l'email, le rôle ou le poste ici
 * (ces champs restent gérés par l'admin via EmployeeController).
 */
public class ProfileUpdateDto {

    private String telephone;
    private String adresse;

    public ProfileUpdateDto() {
    }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
}
