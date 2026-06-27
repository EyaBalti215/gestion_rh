package com.gestionrh.backend.service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
 
@Service
public class Emailservice {
     @Autowired
    private JavaMailSender mailSender;
 
    public void sendOtpEmail(String toEmail, String otpCode) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
 
        helper.setFrom("hrflow@demo.local");
        helper.setTo(toEmail);
        helper.setSubject("HRFlow — Votre code de vérification");
 
        String htmlBody = """
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 32px;">🏢</div>
                    <h1 style="color: #6d28d9; font-size: 24px; margin: 8px 0;">HRFlow</h1>
                </div>
 
                <h2 style="color: #1e293b; font-size: 20px;">Réinitialisation de mot de passe</h2>
                <p style="color: #64748b; line-height: 1.6;">
                    Vous avez demandé la réinitialisation de votre mot de passe.
                    Voici votre code de vérification à 6 chiffres :
                </p>
 
                <div style="background: #f5f3ff; border: 2px solid #6d28d9; border-radius: 12px;
                            text-align: center; padding: 24px; margin: 24px 0;">
                    <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #6d28d9;">
                        %s
                    </span>
                </div>
 
                <p style="color: #94a3b8; font-size: 14px;">
                    Ce code expire dans <strong>5 minutes</strong>.
                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.
                </p>
 
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #cbd5e1; font-size: 12px; text-align: center;">
                    HRFlow © 2026 — Système de gestion RH
                </p>
            </div>
            """.formatted(otpCode);
 
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }
}

