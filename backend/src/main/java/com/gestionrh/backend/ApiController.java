package com.gestionrh.backend;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final JdbcTemplate jdbcTemplate;

    public ApiController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of("status", "UP", "message", "Backend API is running");
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/db")
    public Map<String, Object> databaseStatus() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM app_ping", Integer.class);
        return Map.of("status", "UP", "rows", count);
    }
}
