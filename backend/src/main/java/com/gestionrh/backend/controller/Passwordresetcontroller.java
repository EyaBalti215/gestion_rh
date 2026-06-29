package com.gestionrh.backend.controller;

import com.gestionrh.backend.service.Emailservice;
import com.gestionrh.backend.service.EmployeeService;
import com.gestionrh.backend.service.Otpservice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
public class Passwordresetcontroller {

    private static final Logger log = LoggerFactory.getLogger(Passwordresetcontroller.class);

    @Autowired
    private Otpservice otpService;

    @Autowired
    private Emailservice emailService;

    @Autowired
    private EmployeeService employeeService;

    // ── Preflight CORS OPTIONS ────────────────────────────────────
    @RequestMapping(value = "/send-otp", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptionsSendOtp() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/verify-otp", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptionsVerifyOtp() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/reset-password", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptionsResetPassword() {
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/password/send-otp
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "L'adresse e-mail est requise."));
        }

        try {
            String code = otpService.generateOtp(email);
            emailService.sendOtpEmail(email, code);
            log.info("✅ OTP envoyé à {} : {}", email, code);
            return ResponseEntity.ok(Map.of("success", true, "message", "Code envoyé à " + email));
        } catch (Exception e) {
            log.error("❌ Erreur envoi OTP : {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Erreur lors de l'envoi de l'e-mail : " + e.getMessage()));
        }
    }

    /**
     * POST /api/password/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code  = body.get("code");

        if (email == null || code == null || email.isBlank() || code.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "E-mail et code requis."));
        }

        boolean valid = otpService.validateOtp(email, code);

        if (valid) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Code valide."));
        } else {
            return ResponseEntity.ok(Map.of("success", false, "message", "Code invalide ou expiré."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String nouveauMotDePasse = body.get("nouveauMotDePasse");

        if (email == null || email.isBlank() || nouveauMotDePasse == null || nouveauMotDePasse.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "E-mail et nouveau mot de passe requis."));
        }

        if (!otpService.isEmailOtpVerified(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Code OTP non vérifié ou expiré."));
        }

        try {
            employeeService.resetPasswordByEmail(email, nouveauMotDePasse);
            otpService.consumeVerifiedEmail(email);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mot de passe réinitialisé avec succès."));
        } catch (RuntimeException e) {
            log.error("❌ Erreur reset mot de passe : {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            log.error("❌ Erreur reset mot de passe : {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Erreur lors de la réinitialisation du mot de passe."));
        }
    }
}
