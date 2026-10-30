package com.thurudichoi.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.thurudichoi.config.SpecialTokenService;
import com.thurudichoi.entity.Invitation;
import com.thurudichoi.repository.InvitationRepository;
import com.thurudichoi.repository.PinAttemptLogRepository;
import com.thurudichoi.service.PinService.PinOutcome;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class PinServiceTest {

    @Mock
    private InvitationRepository invitationRepository;

    @Mock
    private PinAttemptLogRepository logRepository;

    @Mock
    private SpecialTokenService specialTokenService;

    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private PinService pinService;
    private Invitation invitation;

    @BeforeEach
    void setUp() {
        pinService = new PinService(
                invitationRepository, logRepository, specialTokenService, encoder, "pepper", 5, 15, 20);
        invitation = new Invitation();
        invitation.setCode("abcd1234wxyz");
        pinService.assign(invitation, "1234");
        when(invitationRepository.findByCode("abcd1234wxyz")).thenReturn(Optional.of(invitation));
        when(logRepository.countByIpAddressAndCreatedAtAfter(any(), any())).thenReturn(0L);
    }

    @Test
    void wrongPinOpensStandardLetterUntilTheFifthMissLocksIt() {
        for (int attempt = 1; attempt <= 4; attempt++) {
            PinOutcome outcome = pinService.verify("abcd1234wxyz", "0000", "127.0.0.1");
            assertEquals("STANDARD", outcome.mode());
            assertNull(outcome.retryAfterSeconds());
        }
        assertNull(invitation.getPinLockedUntil());

        PinOutcome fifth = pinService.verify("abcd1234wxyz", "0000", "127.0.0.1");
        assertEquals("STANDARD", fifth.mode());
        assertNotNull(invitation.getPinLockedUntil());

        PinOutcome duringLock = pinService.verify("abcd1234wxyz", "1234", "127.0.0.1");
        assertTrue(duringLock.locked());
        assertTrue(duringLock.retryAfterSeconds() > 0);
    }

    @Test
    void matchingPinReturnsSpecialTokenAndClearsFailures() {
        invitation.setPinFailedCount(3);
        when(specialTokenService.create(invitation)).thenReturn("special-token");

        PinOutcome outcome = pinService.verify("abcd1234wxyz", "1234", "127.0.0.1");

        assertEquals("SPECIAL", outcome.mode());
        assertEquals("special-token", outcome.specialToken());
        assertEquals(0, invitation.getPinFailedCount());
        assertNull(invitation.getPinLockedUntil());
    }

    @Test
    void letterWithoutPinStaysStandard() {
        invitation.setPinHash(null);

        PinOutcome outcome = pinService.verify("abcd1234wxyz", "1234", "127.0.0.1");

        assertEquals("STANDARD", outcome.mode());
        assertNull(outcome.specialToken());
    }
}
