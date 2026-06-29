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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository repo;

    @InjectMocks
    private EmployeeService service;

    @Test
    void loginShouldAllowHardcodedAdminWhenNoAdminRowExists() {
        when(repo.findByEmail("admin@hrflow.local")).thenReturn(Optional.empty());

        Loginrequestdto dto = new Loginrequestdto();
        dto.setEmail("admin@hrflow.local");
        dto.setMotDePasse("admin123");

        LoginResponseDto response = service.login(dto);

        assertTrue(response.isSuccess());
        assertEquals("ADMIN", response.getRole());
        assertEquals("✅ Bienvenue administrateur !", response.getMessage());
        verify(repo).save(any(Employee.class));
    }
}
