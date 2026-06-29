package com.gestionrh.backend.service;
import org.springframework.stereotype.Service;
 
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
 
@Service
public class Otpservice {
    // Stockage en mémoire : email -> {code, expiration}
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> verifiedOtpStore = new ConcurrentHashMap<>();
 
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
 
    public String generateOtp(String email) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        String code = sb.toString();
 
        // Interdire 000000 (utilisé pour la démo comme code invalide)
        if (code.equals("000000")) {
            code = "123456";
        }
 
        otpStore.put(email.toLowerCase(), new OtpEntry(code, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)));
        return code;
    }
 
    public boolean validateOtp(String email, String code) {
        String key = email.toLowerCase();
        OtpEntry entry = otpStore.get(key);
        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiration())) {
            otpStore.remove(key);
            return false;
        }
        boolean valid = entry.code().equals(code);
        if (valid) {
            otpStore.remove(key);
            verifiedOtpStore.put(key, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        }
        return valid;
    }

    public boolean isEmailOtpVerified(String email) {
        String key = email.toLowerCase();
        LocalDateTime expiration = verifiedOtpStore.get(key);
        if (expiration == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(expiration)) {
            verifiedOtpStore.remove(key);
            return false;
        }
        return true;
    }

    public void consumeVerifiedEmail(String email) {
        verifiedOtpStore.remove(email.toLowerCase());
    }

    private record OtpEntry(String code, LocalDateTime expiration) {}
}

