package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Conge;
import com.gestionrh.backend.Entity.CongeStatut;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CongeRepository extends JpaRepository<Conge, Long> {
    @EntityGraph(attributePaths = "employee")
    List<Conge> findByEmployeeIdOrderByDateCreationDesc(Long employeeId);

    @EntityGraph(attributePaths = "employee")
    List<Conge> findByEmployeeIdAndStatutOrderByDateCreationDesc(Long employeeId, CongeStatut statut);

    @EntityGraph(attributePaths = "employee")
    List<Conge> findAllByOrderByDateCreationDesc();

    List<Conge> findByStatutOrderByDateCreationDesc(CongeStatut statut);
}