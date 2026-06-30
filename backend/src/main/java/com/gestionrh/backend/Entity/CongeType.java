package com.gestionrh.backend.Entity;

public enum CongeType {
    CONGE_ANNUEL("Congé annuel"),
    CONGE_MALADIE("Congé maladie"),
    AUTORISATION_EXCEPTIONNELLE("Autorisation exceptionnelle");

    private final String label;
    CongeType(String label) { this.label = label; }
    public String getLabel() { return label; }
}