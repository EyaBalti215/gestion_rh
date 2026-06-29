package com.gestionrh.backend.Repository;
import com.gestionrh.backend.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Employee> findByStatut(Employee.StatutCompte statut); // ← nouveau
}