package com.thurudichoi.controller;

import com.thurudichoi.dto.ApiDtos.InviteView;
import com.thurudichoi.dto.ApiDtos.PinLockedView;
import com.thurudichoi.dto.ApiDtos.PinRequest;
import com.thurudichoi.dto.ApiDtos.PinResultView;
import com.thurudichoi.dto.ApiDtos.RefuseView;
import com.thurudichoi.dto.ApiDtos.StepView;
import com.thurudichoi.dto.ApiDtos.SubmitRequest;
import com.thurudichoi.service.InviteService;
import com.thurudichoi.service.PinService;
import com.thurudichoi.service.PinService.PinOutcome;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invite")
public class InviteController {

    private final InviteService inviteService;
    private final PinService pinService;

    public InviteController(InviteService inviteService, PinService pinService) {
        this.inviteService = inviteService;
        this.pinService = pinService;
    }

    @GetMapping("/{code}")
    public InviteView get(@PathVariable String code) {
        return inviteService.get(code);
    }

    @PostMapping("/{code}/verify-pin")
    public ResponseEntity<?> verifyPin(
            @PathVariable String code,
            @Valid @RequestBody PinRequest request,
            HttpServletRequest httpRequest) {
        PinOutcome outcome = pinService.verify(code, request.pin(), clientIp(httpRequest));
        if (outcome.locked()) {
            long minutes = Math.max(1, (outcome.retryAfterSeconds() + 59) / 60);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new PinLockedView("Mã đang nghỉ ngơi. Thử lại sau " + minutes + " phút nha.", outcome.retryAfterSeconds()));
        }
        return ResponseEntity.ok(new PinResultView(outcome.mode(), outcome.specialToken()));
    }

    @GetMapping("/{code}/steps")
    public List<StepView> steps(
            @PathVariable String code,
            @RequestParam(defaultValue = "STANDARD") String mode,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return inviteService.steps(code, mode, authorization);
    }

    @PostMapping("/{code}/refuse")
    public RefuseView refuse(@PathVariable String code) {
        return inviteService.refuse(code);
    }

    @PostMapping("/{code}/submit")
    public InviteView submit(
            @PathVariable String code,
            @Valid @RequestBody SubmitRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return inviteService.submit(code, request, authorization);
    }

    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
