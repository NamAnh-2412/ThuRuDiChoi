package com.thurudichoi.config;

import com.thurudichoi.entity.Invitation;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SpecialTokenService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final byte[] secret;
    private final long ttlMinutes;

    public SpecialTokenService(
            @Value("${app.special-token.secret}") String secret,
            @Value("${app.special-token.ttl-minutes}") long ttlMinutes) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.ttlMinutes = ttlMinutes;
    }

    public String create(Invitation invitation) {
        long exp = Instant.now().plusSeconds(ttlMinutes * 60).getEpochSecond();
        long pinEpoch = epoch(invitation.getPinUpdatedAt());
        String body = base64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}")
                + "."
                + base64("{\"sub\":\"" + invitation.getCode()
                        + "\",\"aud\":\"special\",\"mode\":\"SPECIAL\",\"pin\":" + pinEpoch
                        + ",\"exp\":" + exp + "}");
        return body + "." + sign(body);
    }

    public Optional<SpecialGrant> read(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return Optional.empty();
        }
        String token = authorization.startsWith("Bearer ") ? authorization.substring(7).trim() : authorization.trim();
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return Optional.empty();
        }
        String body = parts[0] + "." + parts[1];
        if (!MessageDigest.isEqual(sign(body).getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            return Optional.empty();
        }
        String json = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        if (!"special".equals(readString(json, "aud")) || !"SPECIAL".equals(readString(json, "mode"))) {
            return Optional.empty();
        }
        long exp = readNumber(json, "exp");
        if (exp < Instant.now().getEpochSecond()) {
            return Optional.empty();
        }
        String code = readString(json, "sub");
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(new SpecialGrant(code, readNumber(json, "pin")));
    }

    public boolean stillValid(Invitation invitation, SpecialGrant grant) {
        return invitation.getPinHash() != null
                && invitation.getPinUpdatedAt() != null
                && epoch(invitation.getPinUpdatedAt()) == grant.pinEpoch();
    }

    public record SpecialGrant(String code, long pinEpoch) {
    }

    static long epoch(LocalDateTime value) {
        if (value == null) {
            return 0;
        }
        return value.atZone(ZONE).toEpochSecond();
    }

    private String sign(String body) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Không ký được token đặc biệt", ex);
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
