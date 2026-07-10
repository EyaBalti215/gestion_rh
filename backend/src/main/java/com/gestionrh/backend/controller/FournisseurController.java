package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Fournisseur;
import com.gestionrh.backend.Repository.FournisseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fournisseurs")
@CrossOrigin(origins = "*")
public class FournisseurController {

    @Autowired
    private FournisseurRepository fournisseurRepository;

    @GetMapping
    public ResponseEntity<List<Fournisseur>> getAll() {
        try {
            List<Fournisseur> fournisseurs = fournisseurRepository.findAll();
            return ResponseEntity.ok(fournisseurs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            Optional<Fournisseur> fournisseur = fournisseurRepository.findById(id);
            if (fournisseur.isPresent()) {
                return ResponseEntity.ok(fournisseur.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Fournisseur fournisseur) {
        try {
            if (fournisseur.getNom() == null || fournisseur.getNom().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le nom du fournisseur est requis"));
            }
            if (fournisseur.getType() == null || fournisseur.getType().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le type du fournisseur est requis"));
            }

            Fournisseur savedFournisseur = fournisseurRepository.save(fournisseur);
            return ResponseEntity.ok(Map.of(
                "message", "Fournisseur créé avec succès",
                "fournisseur", savedFournisseur
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Fournisseur fournisseurDetails) {
        try {
            Optional<Fournisseur> fournisseur = fournisseurRepository.findById(id);
            if (fournisseur.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Fournisseur existing = fournisseur.get();
            if (fournisseurDetails.getNom() != null) existing.setNom(fournisseurDetails.getNom());
            if (fournisseurDetails.getType() != null) existing.setType(fournisseurDetails.getType());
            if (fournisseurDetails.getEmail() != null) existing.setEmail(fournisseurDetails.getEmail());
            if (fournisseurDetails.getTelephone() != null) existing.setTelephone(fournisseurDetails.getTelephone());
            if (fournisseurDetails.getAdresse() != null) existing.setAdresse(fournisseurDetails.getAdresse());
            if (fournisseurDetails.getStatut() != null) existing.setStatut(fournisseurDetails.getStatut());

            Fournisseur updated = fournisseurRepository.save(existing);
            return ResponseEntity.ok(Map.of(
                "message", "Fournisseur mis à jour avec succès",
                "fournisseur", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Optional<Fournisseur> fournisseur = fournisseurRepository.findById(id);
            if (fournisseur.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            fournisseurRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Fournisseur supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Fournisseur>> getByStatut(@PathVariable String statut) {
        try {
            List<Fournisseur> fournisseurs = fournisseurRepository.findByStatut(statut);
            return ResponseEntity.ok(fournisseurs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Fournisseur>> getByType(@PathVariable String type) {
        try {
            List<Fournisseur> fournisseurs = fournisseurRepository.findByType(type);
            return ResponseEntity.ok(fournisseurs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
