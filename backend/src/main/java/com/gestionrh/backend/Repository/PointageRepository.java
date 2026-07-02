package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Pointage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PointageRepository extends JpaRepository<Pointage, Long> {

    @Query("select p from Pointage p join fetch p.employee e where e.id = :employeeId and p.datePointage = :date")
    Optional<Pointage> findByEmployeeIdAndDatePointage(@Param("employeeId") Long employeeId,
                                                       @Param("date") LocalDate date);

    @Query("select p from Pointage p join fetch p.employee e where p.datePointage = :date")
    List<Pointage> findByDatePointage(@Param("date") LocalDate date);

    @Query("select p from Pointage p join fetch p.employee e where e.id = :employeeId order by p.datePointage desc")
    List<Pointage> findByEmployeeIdOrderByDatePointageDesc(@Param("employeeId") Long employeeId);
}