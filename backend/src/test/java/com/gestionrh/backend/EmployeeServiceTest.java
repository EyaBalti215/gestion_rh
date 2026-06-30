package com.gestionrh.backend;

import com.gestionrh.backend.Entity.Employee;
import com.gestionrh.backend.Repository.EmployeeRepository;
import com.gestionrh.backend.dto.LoginResponseDto;
import com.gestionrh.backend.dto.Loginrequestdto;
import com.gestionrh.backend.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository repo;

    @Mock
    private JavaMailSender mailSender; // nécessaire car @Autowired dans EmployeeService

    @InjectMocks
    private EmployeeService service;

    @Test
    void loginShouldAllowHardcodedAdminWhenNoAdminRowExists() {
        // Aucun admin en base
        when(repo.findByEmail("admin@hrflow.local")).thenReturn(Optional.empty());
        when(repo.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Loginrequestdto dto = new Loginrequestdto();
        dto.setEmail("admin@hrflow.local");
        dto.setMotDePasse("admin123");

        LoginResponseDto response = service.login(dto);

        assertTrue(response.isSuccess());
        assertEquals("ADMIN", response.getRole());
        assertEquals("✅ Bienvenue administrateur !", response.getMessage());
        verify(repo).save(any(Employee.class));
    }

    @Test
    void loginShouldFailForUnknownEmail() {
        when(repo.findByEmail("inconnu@test.com")).thenReturn(Optional.empty());

        Loginrequestdto dto = new Loginrequestdto();
        dto.setEmail("inconnu@test.com");
        dto.setMotDePasse("motdepasse");

        LoginResponseDto response = service.login(dto);

        assertFalse(response.isSuccess());
        assertEquals("Aucun compte trouvé pour cet email.", response.getMessage());
    }

    @Test
    void loginShouldFailForPendingEmployee() {
        Employee emp = new Employee();
        emp.setEmail("employe@test.com");
        emp.setStatut("EN_ATTENTE");
        emp.setPassword("$2a$10$hashedpassword");

        when(repo.findByEmail("employe@test.com")).thenReturn(Optional.of(emp));

        Loginrequestdto dto = new Loginrequestdto();
        dto.setEmail("employe@test.com");
        dto.setMotDePasse("motdepasse");

        LoginResponseDto response = service.login(dto);

        assertFalse(response.isSuccess());
        assertEquals("Votre compte est en attente de validation.", response.getMessage());
    }
}