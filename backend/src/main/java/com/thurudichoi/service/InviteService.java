package com.thurudichoi.service;

import com.thurudichoi.config.SpecialTokenService;
import com.thurudichoi.config.SpecialTokenService.SpecialGrant;
import com.thurudichoi.dto.ApiDtos.AnswerRequest;
import com.thurudichoi.dto.ApiDtos.AnswerView;
import com.thurudichoi.dto.ApiDtos.ChoiceView;
import com.thurudichoi.dto.ApiDtos.InviteView;
import com.thurudichoi.dto.ApiDtos.RefuseView;
import com.thurudichoi.dto.ApiDtos.StepView;
import com.thurudichoi.dto.ApiDtos.SubmitRequest;
import com.thurudichoi.entity.Choice;
import com.thurudichoi.entity.ChoiceScope;
import com.thurudichoi.entity.Invitation;
import com.thurudichoi.entity.InvitationResponse;
import com.thurudichoi.entity.LetterMode;
import com.thurudichoi.entity.ResponseDetail;
import com.thurudichoi.entity.Step;
import com.thurudichoi.repository.ChoiceRepository;
import com.thurudichoi.repository.InvitationRepository;
import com.thurudichoi.repository.InvitationResponseRepository;
import com.thurudichoi.repository.StepRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class InviteService {

    private static final Set<ChoiceScope> STANDARD_SCOPES = EnumSet.of(ChoiceScope.STANDARD, ChoiceScope.BOTH);
    private static final Set<ChoiceScope> SPECIAL_SCOPES = EnumSet.of(ChoiceScope.SPECIAL, ChoiceScope.BOTH);

    private final InvitationRepository invitationRepository;
    private final InvitationResponseRepository responseRepository;
    private final StepRepository stepRepository;
    private final ChoiceRepository choiceRepository;
    private final SpecialTokenService specialTokenService;

    public InviteService(
            InvitationRepository invitationRepository,
            InvitationResponseRepository responseRepository,
            StepRepository stepRepository,
            ChoiceRepository choiceRepository,
            SpecialTokenService specialTokenService) {
        this.invitationRepository = invitationRepository;
        this.responseRepository = responseRepository;
        this.stepRepository = stepRepository;
        this.choiceRepository = choiceRepository;
        this.specialTokenService = specialTokenService;
    }

    @Transactional(readOnly = true)
    public InviteView get(String code) {
        Invitation invitation = findInvitation(code);
        InvitationResponse response = responseRepository.findByInvitationId(invitation.getId()).orElse(null);
        return toView(invitation, response);
    }

    public RefuseView refuse(String code) {
        Invitation invitation = findInvitation(code);
        InvitationResponse response = responseRepository.findByInvitationId(invitation.getId()).orElse(null);
        if (response != null && response.getSubmittedAt() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Thư này đã được trả lời rồi");
        }
        if (response == null) {
            response = new InvitationResponse();
            response.setInvitation(invitation);
            response.setRefuseCount(1);
        } else {
            response.setRefuseCount(response.getRefuseCount() + 1);
        }
        responseRepository.save(response);
        return new RefuseView(response.getRefuseCount());
    }

    @Transactional(readOnly = true)
    public List<StepView> steps(String code, String mode, String authorization) {
        Invitation invitation = findInvitation(code);
        boolean special = "SPECIAL".equalsIgnoreCase(mode);
        if (special) {
            requireSpecialAccess(invitation, authorization);
        }
        return stepViews(special ? SPECIAL_SCOPES : STANDARD_SCOPES);
    }

    public InviteView submit(String code, SubmitRequest request, String authorization) {
        Invitation invitation = findInvitation(code);
        InvitationResponse response = responseRepository.findByInvitationId(invitation.getId()).orElseGet(() -> {
            InvitationResponse created = new InvitationResponse();
            created.setInvitation(invitation);
            return created;
        });
        if (response.getSubmittedAt() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Thư này đã được trả lời rồi");
        }

        LetterMode letterMode = resolveMode(invitation, authorization);
        List<Step> steps = stepRepository.findAllByOrderByStepOrderAsc();
        Map<String, Step> stepsByCode = steps.stream().collect(Collectors.toMap(Step::getCode, Function.identity()));
        HashSet<String> seen = new HashSet<>();
        List<ResponseDetail> details = new ArrayList<>();
        for (AnswerRequest answer : request.answers()) {
            Step step = stepsByCode.get(answer.stepCode());
            if (step == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Có bước không tồn tại");
            }
            if (!seen.add(step.getCode())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mỗi bước chỉ chọn một lần");
            }
            Choice choice = choiceRepository.findById(answer.choiceId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lựa chọn không còn tồn tại"));
            if (!choice.isActive() || !choice.getStep().getId().equals(step.getId()) || !scopeAllowed(choice, letterMode)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lựa chọn không thuộc bước này");
            }
            ResponseDetail detail = new ResponseDetail();
            detail.setResponse(response);
            detail.setStep(step);
            detail.setChoice(choice);
            details.add(detail);
        }
        if (seen.size() != steps.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần chọn đủ các bước");
        }

        String note = request.note() == null ? null : request.note().trim();
        response.setNote(note == null || note.isEmpty() ? null : note);
        response.setMode(letterMode);
        response.setSubmittedAt(LocalDateTime.now());
        response.getDetails().clear();
        response.getDetails().addAll(details);
        responseRepository.save(response);
        return toView(invitation, response);
    }

    private InviteView toView(Invitation invitation, InvitationResponse response) {
        boolean submitted = response != null && response.getSubmittedAt() != null;
        List<AnswerView> answers = new ArrayList<>();
        if (response != null) {
            answers = response.getDetails().stream()
                    .sorted(Comparator.comparingInt(detail -> detail.getStep().getStepOrder()))
                    .map(detail -> new AnswerView(
                            detail.getStep().getCode(),
                            detail.getStep().getName(),
                            detail.getChoice().getId(),
                            detail.getChoice().getLabel()))
                    .toList();
        }
        return new InviteView(
                invitation.getCode(),
                invitation.getTitle(),
                invitation.getReceiver(),
                seasonName(invitation),
                invitation.getPinHash() != null,
                submitted,
                response == null ? 0 : response.getRefuseCount(),
                response == null ? null : response.getNote(),
                response == null || response.getMode() == null ? null : response.getMode().name(),
                answers,
                stepViews(STANDARD_SCOPES));
    }

    private List<StepView> stepViews(Set<ChoiceScope> scopes) {
        return stepRepository.findAllByOrderByStepOrderAsc().stream()
                .map(step -> new StepView(
                        step.getId(),
                        step.getCode(),
                        step.getName(),
                        step.getQuestion(),
                        step.getStepOrder(),
                        choiceRepository.findByStepIdAndActiveTrueAndScopeInOrderByIdAsc(step.getId(), scopes).stream()
                                .map(choice -> new ChoiceView(choice.getId(), choice.getLabel(), choice.getImageUrl()))
                                .toList()))
                .toList();
    }

    private LetterMode resolveMode(Invitation invitation, String authorization) {
        Optional<SpecialGrant> grant = specialTokenService.read(authorization);
        if (grant.isEmpty()) {
            return LetterMode.STANDARD;
        }
        if (!grant.get().code().equals(invitation.getCode()) || !specialTokenService.stillValid(invitation, grant.get())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Phiên đặc biệt đã hết hạn");
        }
        return LetterMode.SPECIAL;
    }

    private void requireSpecialAccess(Invitation invitation, String authorization) {
        SpecialGrant grant = specialTokenService.read(authorization)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Cần mở khóa thư đặc biệt"));
        if (!grant.code().equals(invitation.getCode()) || !specialTokenService.stillValid(invitation, grant)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Phiên đặc biệt đã hết hạn");
        }
    }

    private boolean scopeAllowed(Choice choice, LetterMode mode) {
        ChoiceScope scope = choice.getScope() == null ? ChoiceScope.BOTH : choice.getScope();
        if (scope == ChoiceScope.BOTH) {
            return true;
        }
        return mode == LetterMode.SPECIAL ? scope == ChoiceScope.SPECIAL : scope == ChoiceScope.STANDARD;
    }

    private String seasonName(Invitation invitation) {
        return invitation.getThemeSeason() == null ? null : invitation.getThemeSeason().name().toLowerCase();
    }

    private Invitation findInvitation(String code) {
        return invitationRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bức thư này"));
    }
}
