package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    List<Fournisseur> findByStatut(String statut);
    List<Fournisseur> findByType(String type);
    Optional<Fournisseur> findByEmail(String email);
    Optional<Fournisseur> findByNom(String nom);
}
