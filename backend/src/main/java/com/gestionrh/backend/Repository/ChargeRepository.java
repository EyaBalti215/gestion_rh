package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Charge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChargeRepository extends JpaRepository<Charge, Long> {
    List<Charge> findByFournisseurId(Long fournisseurId);
    List<Charge> findByStatut(String statut);
    List<Charge> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);
    List<Charge> findByFournisseurIdOrderByDateDesc(Long fournisseurId);
}
