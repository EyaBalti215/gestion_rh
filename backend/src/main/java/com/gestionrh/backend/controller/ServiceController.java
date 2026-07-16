package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Service;
import com.gestionrh.backend.Repository.ServiceRepository;
import com.gestionrh.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Service>> getAll() {
        try {
            List<Service> services = serviceRepository.findAll();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            Optional<Service> service = serviceRepository.findById(id);
            if (service.isPresent()) {
                return ResponseEntity.ok(service.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Service service) {
        try {
            if (service.getNom() == null || service.getNom().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le nom du service est requis"));
            }
            if (service.getType() == null || service.getType().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le type du service est requis"));
            }
            if (service.getPrix() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le prix du service est requis"));
            }

            if (service.getPeriodicite() == null || service.getPeriodicite().isBlank()) {
                service.setPeriodicite("Mensuel");
            }
            if (service.getStatut() == null || service.getStatut().isBlank()) {
                service.setStatut("Actif");
            }

            Service savedService = serviceRepository.save(service);
            notificationService.createNotification(
                    "Nouveau service",
                    "Service " + savedService.getNom() + " a été ajouté.",
                    "services"
            );
            return ResponseEntity.ok(Map.of(
                "message", "Service créé avec succès",
                "service", savedService
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Service serviceDetails) {
        try {
            Optional<Service> service = serviceRepository.findById(id);
            if (service.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Service existing = service.get();
            if (serviceDetails.getNom() != null) existing.setNom(serviceDetails.getNom());
            if (serviceDetails.getType() != null) existing.setType(serviceDetails.getType());
            if (serviceDetails.getPrix() != null) existing.setPrix(serviceDetails.getPrix());
            if (serviceDetails.getPeriodicite() != null) existing.setPeriodicite(serviceDetails.getPeriodicite());
            if (serviceDetails.getDateRenouvellement() != null) existing.setDateRenouvellement(serviceDetails.getDateRenouvellement());
            if (serviceDetails.getStatut() != null) existing.setStatut(serviceDetails.getStatut());

            Service updated = serviceRepository.save(existing);
            notificationService.createNotification(
                    "Service modifié",
                    "Service " + updated.getNom() + " a été modifié.",
                    "services"
            );
            return ResponseEntity.ok(Map.of(
                "message", "Service mis à jour avec succès",
                "service", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Optional<Service> service = serviceRepository.findById(id);
            if (service.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String serviceName = service.get().getNom();
            serviceRepository.deleteById(id);
            notificationService.createNotification(
                    "Service supprimé",
                    "Service " + serviceName + " a été supprimé.",
                    "services"
            );
            return ResponseEntity.ok(Map.of("message", "Service supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Service>> getByStatut(@PathVariable String statut) {
        try {
            List<Service> services = serviceRepository.findByStatut(statut);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
