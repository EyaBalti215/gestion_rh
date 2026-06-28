package com.gestionrh.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ✅ CORS activé
            .cors(cors -> {})

            // ❌ CSRF désactivé (API REST)
            .csrf(csrf -> csrf.disable())

            // 🔓 Autorisations API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/employees/register",
                    "/api/employees",
                    "/api/employees/pending",
                    "/api/employees/*/valider",
                    "/api/employees/*/refuser",
                    "/api/home/**",
                    "/api/password-reset/**",
                    "/api/password/**"
                ).permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }

    // ✅ CONFIG CORS POUR REACT
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Frontend React (Vite)
        config.setAllowedOrigins(List.of(
            "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}