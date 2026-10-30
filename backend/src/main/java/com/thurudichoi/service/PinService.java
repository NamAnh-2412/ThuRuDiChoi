package com.thurudichoi.service;

import com.thurudichoi.config.SpecialTokenService;
import com.thurudichoi.entity.Invitation;
import com.thurudichoi.entity.PinAttemptLog;
import com.thurudichoi.repository.InvitationRepository;
import com.thurudichoi.repository.PinAttemptLogRepository;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PinService {

    private final InvitationRepository invitationRepository;
    private final PinAttemptLogRepository logRepository;
    private final SpecialTokenService specialTokenService;
    private final PasswordEncoder passwordEncoder;
    private final String pepper;
    private final int maxFailedAttempts;
    private final int lockMinutes;
    private final int maxAttemptsPerIp;
    private final SecureRandom random = new SecureRandom();

    public PinService(
            InvitationRepository invitationRepository,
            PinAttemptLogRepository logRepository,
            SpecialTokenService specialTokenService,
            PasswordEncoder passwordEncoder,
            @Value("${app.pin.pepper}") String pepper,
            @Value("${app.pin.max-failed-attempts}") int maxFailedAttempts,
            @Value("${app.pin.lock-minutes}") int lockMinutes,
            @Value("${app.pin.max-attempts-per-ip}") int maxAttemptsPerIp) {
        this.invitationRepository = invitationRepository;
        this.logRepository = logRepository;
        this.specialTokenService = specialTokenService;
        this.passwordEncoder = passwordEncoder;
        this.pepper = pepper;
        this.maxFailedAttempts = maxFailedAttempts;
        this.lockMinutes = lockMinutes;
        this.maxAttemptsPerIp = maxAttemptsPerIp;
    }

    public String randomPin() {
        return String.format("%04d", random.nextInt(10000));
    }

    public void assign(Invitation invitation, String pin) {
        invitation.setPinHash(passwordEncoder.encode(peppered(pin)));
        invitation.setPinUpdatedAt(LocalDateTime.now());
        invitation.setPinFailedCount(0);
        invitation.setPinLockedUntil(null);
    }

    public void clear(Invitation invitation) {
        invitation.setPinHash(null);
        invitation.setPinUpdatedAt(LocalDateTime.now());
        invitation.setPinFailedCount(0);
        invitation.setPinLockedUntil(null);
    }

    public void unlock(Invitation invitation) {
        invitation.setPinFailedCount(0);
        invitation.setPinLockedUntil(null);
    }

    public PinOutcome verify(String code, String pin, String ipAddress) {
        LocalDateTime now = LocalDateTime.now();
        if (ipAddress != null && logRepository.countByIpAddressAndCreatedAtAfter(ipAddress, now.minusHours(1)) >= maxAttemptsPerIp) {
            return PinOutcome.locked(retryAfterIpLimit(ipAddress, now), false);
        }

        Optional<Invitation> found = invitationRepository.findByCode(code);
        if (found.isEmpty() || found.get().getPinHash() == null) {
            log(found.map(Invitation::getId).orElse(null), ipAddress, false, now);
            return PinOutcome.standard();
        }

        Invitation invitation = found.get();
        if (invitation.getPinLockedUntil() != null && invitation.getPinLockedUntil().isAfter(now)) {
            log(invitation.getId(), ipAddress, false, now);
            long seconds = Math.max(1, Duration.between(now, invitation.getPinLockedUntil()).getSeconds());
            return PinOutcome.locked(seconds, false);
        }

        boolean matched = pin != null && pin.matches("\\d{4}") && passwordEncoder.matches(peppered(pin), invitation.getPinHash());
        log(invitation.getId(), ipAddress, matched, now);
        if (matched) {
            invitation.setPinFailedCount(0);
            invitation.setPinLockedUntil(null);
            return PinOutcome.special(specialTokenService.create(invitation));
        }

        int fails = invitation.getPinFailedCount() + 1;
        invitation.setPinFailedCount(fails);
        if (fails >= maxFailedAttempts) {
            invitation.setPinLockedUntil(now.plusMinutes(lockMinutes));
        }
        return PinOutcome.standard();
    }

    private long retryAfterIpLimit(String ipAddress, LocalDateTime now) {
        return logRepository.oldestCreatedAt(ipAddress, now.minusHours(1))
                .map(oldest -> Math.max(1, Duration.between(now, oldest.plusHours(1)).getSeconds()))
                .orElse(3600L);
    }

    private void log(Long invitationId, String ipAddress, boolean matched, LocalDateTime now) {
        PinAttemptLog entry = new PinAttemptLog();
        entry.setInvitationId(invitationId);
        entry.setIpAddress(ipAddress);
        entry.setMatched(matched);
        entry.setCreatedAt(now);
        logRepository.save(entry);
    }

    private String peppered(String pin) {
        return pepper + ":" + pin;
    }

    public record PinOutcome(String mode, String specialToken, Long retryAfterSeconds) {

        static PinOutcome standard() {
            return new PinOutcome("STANDARD", null, null);
        }

        static PinOutcome special(String token) {
            return new PinOutcome("SPECIAL", token, null);
        }

        static PinOutcome locked(long retryAfterSeconds, boolean unused) {
            return new PinOutcome(null, null, retryAfterSeconds);
        }

        public boolean locked() {
            return retryAfterSeconds != null;
        }
    }
}
