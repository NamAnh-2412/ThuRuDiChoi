package com.thurudichoi.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.thurudichoi.config.SpecialTokenService.SpecialGrant;
import com.thurudichoi.entity.Invitation;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class SpecialTokenServiceTest {

    @Test
    void tokenIsBoundToThePinMoment() {
        SpecialTokenService tokens = new SpecialTokenService("special-token-test-secret", 120);
        Invitation invitation = new Invitation();
        invitation.setCode("abcd1234wxyz");
        invitation.setPinHash("hash");
        invitation.setPinUpdatedAt(LocalDateTime.of(2026, 1, 2, 3, 4, 5));

        String token = tokens.create(invitation);
        SpecialGrant grant = tokens.read("Bearer " + token).orElseThrow();

        assertEquals("abcd1234wxyz", grant.code());
        assertTrue(tokens.stillValid(invitation, grant));

        invitation.setPinUpdatedAt(invitation.getPinUpdatedAt().plusSeconds(1));
        assertFalse(tokens.stillValid(invitation, grant));
        invitation.setPinHash(null);
        invitation.setPinUpdatedAt(LocalDateTime.of(2026, 1, 2, 3, 4, 5));
        assertFalse(tokens.stillValid(invitation, grant));
    }
}
