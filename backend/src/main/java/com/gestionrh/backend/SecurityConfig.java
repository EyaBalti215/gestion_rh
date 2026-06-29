package com.gestionrh.backend;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ❌ désactiver CSRF pour API REST
            .csrf(AbstractHttpConfigurer::disable)

            // ✅ activer CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 🔐 règles d’accès (mode local simple pour l’application RH)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/api/employees/register",
                    "/api/employees/login",
                    "/api/employees/change-password",
                    "/api/employees",
                    "/api/employees/pending",
                    "/api/employees/*/valider",
                    "/api/employees/*/refuser",
                    "/api/home/**",
                    "/api/password-reset/**",
                    "/api/password/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // ✅ CONFIG CORS GLOBAL
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔥 FRONTEND VITE
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        // si tu utilises JWT plus tard
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}