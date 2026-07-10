package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Facture;
import com.gestionrh.backend.Entity.Service;
import com.gestionrh.backend.Repository.FactureRepository;
import com.gestionrh.backend.Repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FactureRepository factureRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<Facture>> getAll() {
        try {
            List<Facture> factures = factureRepository.findAllWithService();
            return ResponseEntity.ok(factures);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isPresent()) {
                return ResponseEntity.ok(facture.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getByService(@PathVariable Long serviceId) {
        try {
            List<Facture> factures = factureRepository.findByServiceIdWithService(serviceId);
            return ResponseEntity.ok(factures);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Facture facture) {
        try {
            if (facture.getNumero() == null || facture.getNumero().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le numéro de facture est requis"));
            }
            if (facture.getService() == null || facture.getService().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le service est requis"));
            }
            if (facture.getMontant() == null || facture.getMontant() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le montant doit être supérieur à 0"));
            }
            
            // Vérifier que le service existe
            Optional<Service> service = serviceRepository.findById(facture.getService().getId());
            if (service.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Service non trouvé"));
            }
            
            // Vérifier l'unicité du numéro
            if (factureRepository.findByNumero(facture.getNumero()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Ce numéro de facture existe déjà"));
            }
            
            facture.setService(service.get());
            if (facture.getDate() == null) {
                facture.setDate(LocalDate.now());
            }
            if (facture.getStatut() == null) {
                facture.setStatut("Payée");
            }
            
            Facture savedFacture = factureRepository.save(facture);
            return ResponseEntity.ok(Map.of(
                "message", "Facture créée avec succès",
                "facture", savedFacture
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Facture factureDetails) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Facture existing = facture.get();
            
            if (factureDetails.getNumero() != null && !factureDetails.getNumero().isEmpty()) {
                // Vérifier l'unicité si le numéro change
                Optional<Facture> existingWithNum = factureRepository.findByNumero(factureDetails.getNumero());
                if (existingWithNum.isPresent() && !existingWithNum.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Ce numéro de facture existe déjà"));
                }
                existing.setNumero(factureDetails.getNumero());
            }
            
            if (factureDetails.getService() != null && factureDetails.getService().getId() != null) {
                Optional<Service> service = serviceRepository.findById(factureDetails.getService().getId());
                if (service.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Service non trouvé"));
                }
                existing.setService(service.get());
            }
            
            if (factureDetails.getMontant() != null && factureDetails.getMontant() > 0) {
                existing.setMontant(factureDetails.getMontant());
            }
            
            if (factureDetails.getDate() != null) {
                existing.setDate(factureDetails.getDate());
            }
            
            if (factureDetails.getStatut() != null && !factureDetails.getStatut().isEmpty()) {
                existing.setStatut(factureDetails.getStatut());
            }
            
            if (factureDetails.getDescription() != null) {
                existing.setDescription(factureDetails.getDescription());
            }

            Facture updated = factureRepository.save(existing);
            return ResponseEntity.ok(Map.of(
                "message", "Facture mise à jour avec succès",
                "facture", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            factureRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Facture supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }
}
