package com.thurudichoi.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final byte[] secret;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
    }

    public String createToken(String username) {
        long exp = Instant.now().plusMillis(expirationMs).getEpochSecond();
        String body = base64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}")
                + "."
                + base64("{\"sub\":\"" + username + "\",\"exp\":" + exp + "}");
        return body + "." + sign(body);
    }

    public Optional<String> readUsername(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return Optional.empty();
        }
        String body = parts[0] + "." + parts[1];
        if (!MessageDigest.isEqual(sign(body).getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            return Optional.empty();
        }
        String json = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        long exp = readNumber(json, "exp");
        if (exp < Instant.now().getEpochSecond()) {
            return Optional.empty();
        }
        String subject = readString(json, "sub");
        if (subject == null || subject.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(subject);
    }

    private String sign(String body) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Không ký được token", ex);
        }
    }

    private static String base64(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String readString(String json, String field) {
        String key = "\"" + field + "\":\"";
        int start = json.indexOf(key);
        if (start < 0) {
            return null;
        }
        int from = start + key.length();
        int end = json.indexOf('"', from);
        if (end < 0) {
            return null;
        }
        return json.substring(from, end);
    }

    private static long readNumber(String json, String field) {
        String key = "\"" + field + "\":";
        int start = json.indexOf(key);
        if (start < 0) {
            return 0;
        }
        int from = start + key.length();
        int end = from;
        while (end < json.length() && Character.isDigit(json.charAt(end))) {
            end++;
        }
        if (end == from) {
            return 0;
        }
        return Long.parseLong(json.substring(from, end));
    }
}
