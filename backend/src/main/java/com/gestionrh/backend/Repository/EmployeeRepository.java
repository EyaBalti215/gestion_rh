package com.gestionrh.backend.Repository;

import com.gestionrh.backend.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByLogin(String login);
}