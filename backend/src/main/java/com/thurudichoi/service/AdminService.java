package com.thurudichoi.service;

import com.thurudichoi.config.JwtService;
import com.thurudichoi.dto.ApiDtos.AnswerView;
import com.thurudichoi.dto.ApiDtos.ChoiceAdminView;
import com.thurudichoi.dto.ApiDtos.ChoiceRequest;
import com.thurudichoi.dto.ApiDtos.ChoiceUpdateRequest;
import com.thurudichoi.dto.ApiDtos.CreateInvitationRequest;
import com.thurudichoi.dto.ApiDtos.InvitationView;
import com.thurudichoi.dto.ApiDtos.LoginRequest;
import com.thurudichoi.dto.ApiDtos.LoginResponse;
import com.thurudichoi.dto.ApiDtos.ResponseView;
import com.thurudichoi.dto.ApiDtos.SetPinRequest;
import com.thurudichoi.dto.ApiDtos.StepSummary;
import com.thurudichoi.dto.ApiDtos.ThemeRequest;
import com.thurudichoi.entity.AdminUser;
import com.thurudichoi.entity.Choice;
import com.thurudichoi.entity.ChoiceScope;
import com.thurudichoi.entity.Invitation;
import com.thurudichoi.entity.InvitationResponse;
import com.thurudichoi.entity.ResponseDetail;
import com.thurudichoi.entity.Season;
import com.thurudichoi.entity.Step;
import com.thurudichoi.repository.AdminUserRepository;
import com.thurudichoi.repository.ChoiceRepository;
import com.thurudichoi.repository.InvitationRepository;
import com.thurudichoi.repository.InvitationResponseRepository;
import com.thurudichoi.repository.StepRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AdminService {

    private static final String ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

    private final AdminUserRepository adminUserRepository;
    private final StepRepository stepRepository;
    private final ChoiceRepository choiceRepository;
    private final InvitationRepository invitationRepository;
    private final InvitationResponseRepository responseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PinService pinService;
    private final SecureRandom random = new SecureRandom();

    public AdminService(
            AdminUserRepository adminUserRepository,
            StepRepository stepRepository,
            ChoiceRepository choiceRepository,
            InvitationRepository invitationRepository,
            InvitationResponseRepository responseRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PinService pinService) {
        this.adminUserRepository = adminUserRepository;
        this.stepRepository = stepRepository;
        this.choiceRepository = choiceRepository;
        this.invitationRepository = invitationRepository;
        this.responseRepository = responseRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.pinService = pinService;
    }

    public LoginResponse login(LoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tài khoản hoặc mật khẩu"));
        if (!passwordEncoder.matches(request.password(), admin.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tài khoản hoặc mật khẩu");
        }
        return new LoginResponse(jwtService.createToken(admin.getUsername()), admin.getUsername());
    }

    @Transactional(readOnly = true)
    public List<StepSummary> steps() {
        return stepRepository.findAllByOrderByStepOrderAsc().stream()
                .map(step -> new StepSummary(step.getId(), step.getCode(), step.getName(), step.getQuestion(), step.getStepOrder()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChoiceAdminView> choices(Long stepId) {
        requireStep(stepId);
        return choiceRepository.findByStepIdOrderByIdAsc(stepId).stream().map(this::toChoiceView).toList();
    }

    public ChoiceAdminView createChoice(ChoiceRequest request) {
        Step step = requireStep(request.stepId());
        Choice choice = new Choice();
        choice.setStep(step);
        choice.setLabel(request.label().trim());
        choice.setImageUrl(cleanImage(request.imageUrl()));
        choice.setScope(parseScope(request.scope(), ChoiceScope.BOTH));
        choice.setActive(true);
        return toChoiceView(choiceRepository.save(choice));
    }

    public ChoiceAdminView updateChoice(Long id, ChoiceUpdateRequest request) {
        Choice choice = requireChoice(id);
        choice.setLabel(request.label().trim());
        choice.setImageUrl(cleanImage(request.imageUrl()));
        if (request.scope() != null && !request.scope().isBlank()) {
            choice.setScope(parseScope(request.scope(), null));
        }
        return toChoiceView(choice);
    }

    public ChoiceAdminView toggleChoice(Long id) {
        Choice choice = requireChoice(id);
        choice.setActive(!choice.isActive());
        return toChoiceView(choice);
    }

    public void deleteChoice(Long id) {
        Choice choice = requireChoice(id);
        try {
            choiceRepository.delete(choice);
            choiceRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Lựa chọn đã có trong một thư trả lời. Hãy tắt thay vì xóa.");
        }
    }

    public InvitationView createInvitation(CreateInvitationRequest request, String username) {
        AdminUser admin = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bạn cần đăng nhập"));
        Invitation invitation = new Invitation();
        invitation.setAdmin(admin);
        invitation.setCode(newCode());
        String title = request.title() == null ? null : request.title().trim();
        invitation.setTitle(title == null || title.isEmpty() ? null : title);
        invitation.setReceiver(request.receiver().trim());
        invitation.setThemeSeason(parseSeason(request.themeSeason()));
        String revealedPin = null;
        if (request.pin() != null && !request.pin().isBlank()) {
            if (!request.pin().matches("\\d{4}")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã cần đúng 4 số");
            }
            pinService.assign(invitation, request.pin());
            revealedPin = request.pin();
        }
        return toInvitationView(invitationRepository.save(invitation), revealedPin);
    }

    public InvitationView setPin(Long id, SetPinRequest request) {
        Invitation invitation = requireInvitation(id);
        String pin;
        if (request != null && Boolean.TRUE.equals(request.generate())) {
            pin = pinService.randomPin();
        } else if (request != null && request.pin() != null && request.pin().matches("\\d{4}")) {
            pin = request.pin();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã cần đúng 4 số");
        }
        pinService.assign(invitation, pin);
        return toInvitationView(invitation, pin);
    }

    public InvitationView clearPin(Long id) {
        Invitation invitation = requireInvitation(id);
        pinService.clear(invitation);
        return toInvitationView(invitation, null);
    }

    public InvitationView unlockPin(Long id) {
        Invitation invitation = requireInvitation(id);
        pinService.unlock(invitation);
        return toInvitationView(invitation, null);
    }

    public InvitationView updateTheme(Long id, ThemeRequest request) {
        Invitation invitation = requireInvitation(id);
        invitation.setThemeSeason(parseSeason(request == null ? null : request.themeSeason()));
        return toInvitationView(invitation, null);
    }

    @Transactional(readOnly = true)
    public List<InvitationView> invitations() {
        return invitationRepository.findAllWithResponse().stream().map(invitation -> toInvitationView(invitation, null)).toList();
    }

    @Transactional(readOnly = true)
    public List<ResponseView> responses() {
        return responseRepository.findAllDetailed().stream()
                .sorted(Comparator.comparing(InvitationResponse::getId).reversed())
                .map(this::toResponseView)
                .toList();
    }

    private InvitationView toInvitationView(Invitation invitation, String revealedPin) {
        InvitationResponse response = invitation.getResponse();
        boolean locked = invitation.getPinLockedUntil() != null && invitation.getPinLockedUntil().isAfter(LocalDateTime.now());
        return new InvitationView(
                invitation.getId(),
                invitation.getCode(),
                invitation.getTitle(),
                invitation.getReceiver(),
                invitation.getThemeSeason() == null ? null : invitation.getThemeSeason().name().toLowerCase(),
                invitation.getPinHash() != null,
                locked,
                revealedPin,
                invitation.getCreatedAt(),
                response == null ? 0 : response.getRefuseCount(),
                response == null ? null : response.getSubmittedAt(),
                response != null && response.getSubmittedAt() != null,
                response != null,
                response == null || response.getMode() == null ? null : response.getMode().name());
    }

    private ResponseView toResponseView(InvitationResponse response) {
        Invitation invitation = response.getInvitation();
        List<AnswerView> answers = response.getDetails().stream()
                .sorted(Comparator.comparingInt(detail -> detail.getStep().getStepOrder()))
                .map(this::toAnswer)
                .toList();
        return new ResponseView(
                response.getId(),
                invitation.getId(),
                invitation.getReceiver(),
                invitation.getCode(),
                invitation.getTitle(),
                response.getRefuseCount(),
                response.getNote(),
                response.getSubmittedAt(),
                response.getSubmittedAt() != null,
                response.getMode() == null ? "STANDARD" : response.getMode().name(),
                answers);
    }

    private AnswerView toAnswer(ResponseDetail detail) {
        return new AnswerView(
                detail.getStep().getCode(),
                detail.getStep().getName(),
                detail.getChoice().getId(),
                detail.getChoice().getLabel());
    }

    private ChoiceAdminView toChoiceView(Choice choice) {
        return new ChoiceAdminView(
                choice.getId(),
                choice.getStep().getId(),
                choice.getLabel(),
                choice.getImageUrl(),
                choice.isActive(),
                choice.getScope() == null ? ChoiceScope.BOTH.name() : choice.getScope().name());
    }

    private Step requireStep(Long stepId) {
        return stepRepository.findById(stepId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bước"));
    }

    private Invitation requireInvitation(Long id) {
        return invitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bức thư"));
    }

    private ChoiceScope parseScope(String raw, ChoiceScope fallback) {
        if (raw == null || raw.isBlank()) {
            if (fallback == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chọn phạm vi hợp lệ");
            }
            return fallback;
        }
        try {
            return ChoiceScope.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chọn phạm vi hợp lệ");
        }
    }

    private Season parseSeason(String raw) {
        if (raw == null || raw.isBlank() || "default".equalsIgnoreCase(raw)) {
            return null;
        }
        try {
            return Season.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chọn một mùa");
        }
    }

    private Choice requireChoice(Long id) {
        return choiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lựa chọn"));
    }

    private String newCode() {
        for (int attempt = 0; attempt < 8; attempt++) {
            StringBuilder code = new StringBuilder(12);
            for (int i = 0; i < 12; i++) {
                code.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            }
            if (!invitationRepository.existsByCode(code.toString())) {
                return code.toString();
            }
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không tạo được mã thư");
    }

    private static String cleanImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }
        return imageUrl.trim();
    }
}
