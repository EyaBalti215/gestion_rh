package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Charge;
import com.gestionrh.backend.Entity.Fournisseur;
import com.gestionrh.backend.Repository.ChargeRepository;
import com.gestionrh.backend.Repository.FournisseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/charges")
@CrossOrigin(origins = "*")
public class ChargeController {
    
    @Autowired
    private ChargeRepository chargeRepository;
    
    @Autowired
    private FournisseurRepository fournisseurRepository;
    
    // GET all charges
    @GetMapping
    public ResponseEntity<?> getAllCharges() {
        try {
            List<Charge> charges = chargeRepository.findAll();
            return ResponseEntity.ok(charges);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du chargement des charges"));
        }
    }
    
    // GET charge by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getChargeById(@PathVariable Long id) {
        try {
            Optional<Charge> charge = chargeRepository.findById(id);
            return charge.isPresent() 
                ? ResponseEntity.ok(charge.get())
                : ResponseEntity.status(404).body(Map.of("error", "Charge non trouvée"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du chargement"));
        }
    }
    
    // GET charges by fournisseur
    @GetMapping("/fournisseur/{fournisseurId}")
    public ResponseEntity<?> getChargesByFournisseur(@PathVariable Long fournisseurId) {
        try {
            List<Charge> charges = chargeRepository.findByFournisseurIdOrderByDateDesc(fournisseurId);
            return ResponseEntity.ok(charges);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du chargement"));
        }
    }
    
    // GET charges by statut
    @GetMapping("/statut/{statut}")
    public ResponseEntity<?> getChargesByStatut(@PathVariable String statut) {
        try {
            List<Charge> charges = chargeRepository.findByStatut(statut);
            return ResponseEntity.ok(charges);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du chargement"));
        }
    }
    
    // POST - Create charge
    @PostMapping
    public ResponseEntity<?> createCharge(@RequestBody Map<String, Object> body) {
        try {
            String designation = (String) body.get("designation");
            Long fournisseurId = ((Number) body.get("fournisseurId")).longValue();
            Double montant = ((Number) body.get("montant")).doubleValue();
            String statut = (String) body.getOrDefault("statut", "En attente");
            
            // Validations
            if (designation == null || designation.trim().isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "La désignation est obligatoire"));
            }
            
            if (!fournisseurRepository.existsById(fournisseurId)) {
                return ResponseEntity.status(400).body(Map.of("error", "Le fournisseur n'existe pas"));
            }
            
            if (montant == null || montant <= 0) {
                return ResponseEntity.status(400).body(Map.of("error", "Le montant doit être supérieur à 0"));
            }
            
            Fournisseur fournisseur = fournisseurRepository.findById(fournisseurId).get();
            
            Charge charge = new Charge();
            charge.setDesignation(designation);
            charge.setFournisseur(fournisseur);
            charge.setMontant(montant);
            charge.setStatut(statut);
            charge.setDate(LocalDate.now());
            
            Charge saved = chargeRepository.save(charge);
            return ResponseEntity.ok(saved);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
    
    // PUT - Update charge
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCharge(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Optional<Charge> chargeOpt = chargeRepository.findById(id);
            
            if (!chargeOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("error", "Charge non trouvée"));
            }
            
            Charge charge = chargeOpt.get();
            
            if (body.containsKey("designation") && body.get("designation") != null) {
                charge.setDesignation((String) body.get("designation"));
            }
            
            if (body.containsKey("montant") && body.get("montant") != null) {
                Double montant = ((Number) body.get("montant")).doubleValue();
                if (montant <= 0) {
                    return ResponseEntity.status(400).body(Map.of("error", "Le montant doit être supérieur à 0"));
                }
                charge.setMontant(montant);
            }
            
            if (body.containsKey("statut") && body.get("statut") != null) {
                charge.setStatut((String) body.get("statut"));
            }
            
            if (body.containsKey("date") && body.get("date") != null) {
                charge.setDate(LocalDate.parse((String) body.get("date")));
            }
            
            Charge updated = chargeRepository.save(charge);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
    
    // DELETE charge
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCharge(@PathVariable Long id) {
        try {
            if (!chargeRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("error", "Charge non trouvée"));
            }
            
            chargeRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Charge supprimée"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la suppression"));
        }
    }
}
