package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByStatut(String statut);
    List<Service> findByType(String type);
}
