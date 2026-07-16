package com.gestionrh.backend.controller;

import com.gestionrh.backend.Entity.Facture;
import com.gestionrh.backend.Entity.Service;
import com.gestionrh.backend.Repository.FactureRepository;
import com.gestionrh.backend.Repository.ServiceRepository;
import com.gestionrh.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FactureRepository factureRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private NotificationService notificationService;

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

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> create(
            @RequestParam("numero") String numero,
            @RequestParam("serviceId") Long serviceId,
            @RequestParam("montant") Double montant,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "statut", required = false) String statut,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) {
        try {
            if (numero == null || numero.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le numéro de facture est requis"));
            }
            if (serviceId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le service est requis"));
            }
            if (montant == null || montant <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le montant doit être supérieur à 0"));
            }

            Optional<Service> service = serviceRepository.findById(serviceId);
            if (service.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Service non trouvé"));
            }

            if (factureRepository.findByNumero(numero).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Ce numéro de facture existe déjà"));
            }

            Facture facture = new Facture();
            facture.setNumero(numero);
            facture.setService(service.get());
            facture.setMontant(montant);
            facture.setDate(date == null || date.isBlank() ? LocalDate.now() : LocalDate.parse(date));
            facture.setStatut(statut == null || statut.isBlank() ? "Payée" : statut);
            facture.setDescription(description);

            String fileName = null;
            if (pdfFile != null && !pdfFile.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/uploads/factures";
                Files.createDirectories(Paths.get(uploadDir));
                fileName = "facture-" + System.currentTimeMillis() + "-" + pdfFile.getOriginalFilename();
                Path destination = Paths.get(uploadDir, fileName);
                Files.copy(pdfFile.getInputStream(), destination);
            } else {
                fileName = generatePdfForFacture(facture);
            }
            facture.setPdfPath(fileName);

            Facture savedFacture = factureRepository.save(facture);
            notificationService.createNotification(
                    "Nouvelle facture",
                    "Facture " + savedFacture.getNumero() + " a été ajoutée.",
                    "factures"
            );
            return ResponseEntity.ok(Map.of(
                "message", "Facture créée avec succès",
                "facture", savedFacture
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur d'upload du PDF"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestParam(value = "numero", required = false) String numero,
                                     @RequestParam(value = "serviceId", required = false) Long serviceId,
                                     @RequestParam(value = "montant", required = false) Double montant,
                                     @RequestParam(value = "date", required = false) String date,
                                     @RequestParam(value = "statut", required = false) String statut,
                                     @RequestParam(value = "description", required = false) String description,
                                     @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Facture existing = facture.get();

            if (numero != null && !numero.isBlank()) {
                Optional<Facture> existingWithNum = factureRepository.findByNumero(numero);
                if (existingWithNum.isPresent() && !existingWithNum.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Ce numéro de facture existe déjà"));
                }
                existing.setNumero(numero);
            }

            if (serviceId != null) {
                Optional<Service> service = serviceRepository.findById(serviceId);
                if (service.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Service non trouvé"));
                }
                existing.setService(service.get());
            }

            if (montant != null && montant > 0) {
                existing.setMontant(montant);
            }

            if (date != null && !date.isBlank()) {
                existing.setDate(LocalDate.parse(date));
            }

            if (statut != null && !statut.isBlank()) {
                existing.setStatut(statut);
            }

            if (description != null) {
                existing.setDescription(description);
            }

            if (pdfFile != null && !pdfFile.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/uploads/factures";
                Files.createDirectories(Paths.get(uploadDir));
                String fileName = "facture-" + System.currentTimeMillis() + "-" + pdfFile.getOriginalFilename();
                Path destination = Paths.get(uploadDir, fileName);
                Files.copy(pdfFile.getInputStream(), destination);
                existing.setPdfPath(fileName);
            } else {
                existing.setPdfPath(generatePdfForFacture(existing));
            }

            Facture updated = factureRepository.save(existing);
            notificationService.createNotification(
                    "Facture modifiée",
                    "Facture " + updated.getNumero() + " a été modifiée.",
                    "factures"
            );
            return ResponseEntity.ok(Map.of(
                "message", "Facture mise à jour avec succès",
                "facture", updated
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur d'upload du PDF"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isEmpty() || facture.get().getPdfPath() == null || facture.get().getPdfPath().isBlank()) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(System.getProperty("user.dir"), "uploads", "factures", facture.get().getPdfPath());
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    private String generatePdfForFacture(Facture facture) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/factures";
        Files.createDirectories(Paths.get(uploadDir));
        String fileName = "facture-" + System.currentTimeMillis() + "-generated.pdf";
        Path destination = Paths.get(uploadDir, fileName);

        try (OutputStream outputStream = Files.newOutputStream(destination)) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();
            document.add(new Paragraph("Facture"));
            document.add(new Paragraph("Numéro : " + facture.getNumero()));
            document.add(new Paragraph("Service : " + (facture.getService() != null ? facture.getService().getNom() : "N/A")));
            document.add(new Paragraph("Montant : " + (facture.getMontant() != null ? facture.getMontant().toString() + " TND" : "N/A")));
            document.add(new Paragraph("Date : " + (facture.getDate() != null ? facture.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "N/A")));
            document.add(new Paragraph("Statut : " + (facture.getStatut() != null ? facture.getStatut() : "N/A")));
            document.add(new Paragraph("Description : " + (facture.getDescription() != null ? facture.getDescription() : "")));
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Échec de génération du PDF", e);
        }

        return fileName;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Optional<Facture> facture = factureRepository.findById(id);
            if (facture.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String numero = facture.get().getNumero();
            factureRepository.deleteById(id);
            notificationService.createNotification(
                    "Facture supprimée",
                    "Facture " + numero + " a été supprimée.",
                    "factures"
            );
            return ResponseEntity.ok(Map.of("message", "Facture supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur serveur"));
        }
    }
}
