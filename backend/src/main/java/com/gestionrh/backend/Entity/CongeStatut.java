package com.gestionrh.backend.Entity;

public enum CongeStatut {
    EN_ATTENTE("En attente"),
    APPROUVE("Approuvé"),
    REFUSE("Refusé");

    private final String label;
    CongeStatut(String label) { this.label = label; }
    public String getLabel() { return label; }
}