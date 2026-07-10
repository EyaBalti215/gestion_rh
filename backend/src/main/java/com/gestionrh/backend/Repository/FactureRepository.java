package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    
    Optional<Facture> findByNumero(String numero);
    
    List<Facture> findByServiceId(Long serviceId);
    
    List<Facture> findByStatut(String statut);
    
    List<Facture> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);
    
    @Query("select f from Facture f join fetch f.service s order by f.date desc")
    List<Facture> findAllWithService();
    
    @Query("select f from Facture f join fetch f.service s where s.id = :serviceId")
    List<Facture> findByServiceIdWithService(@Param("serviceId") Long serviceId);
}
