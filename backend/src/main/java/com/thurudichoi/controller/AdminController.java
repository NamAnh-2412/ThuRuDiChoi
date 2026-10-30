package com.thurudichoi.controller;

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
import com.thurudichoi.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return adminService.login(request);
    }

    @GetMapping("/steps")
    public List<StepSummary> steps() {
        return adminService.steps();
    }

    @GetMapping("/steps/{stepId}/choices")
    public List<ChoiceAdminView> choices(@PathVariable Long stepId) {
        return adminService.choices(stepId);
    }

    @PostMapping("/choices")
    public ChoiceAdminView createChoice(@Valid @RequestBody ChoiceRequest request) {
        return adminService.createChoice(request);
    }

    @PutMapping("/choices/{id}")
    public ChoiceAdminView updateChoice(@PathVariable Long id, @Valid @RequestBody ChoiceUpdateRequest request) {
        return adminService.updateChoice(id, request);
    }

    @PatchMapping("/choices/{id}/toggle")
    public ChoiceAdminView toggleChoice(@PathVariable Long id) {
        return adminService.toggleChoice(id);
    }

    @DeleteMapping("/choices/{id}")
    public Map<String, String> deleteChoice(@PathVariable Long id) {
        adminService.deleteChoice(id);
        return Map.of("message", "Đã xóa lựa chọn");
    }

    @PostMapping("/invitations")
    public InvitationView createInvitation(@Valid @RequestBody CreateInvitationRequest request, Authentication authentication) {
        return adminService.createInvitation(request, authentication.getName());
    }

    @GetMapping("/invitations")
    public List<InvitationView> invitations() {
        return adminService.invitations();
    }

    @GetMapping("/responses")
    public List<ResponseView> responses() {
        return adminService.responses();
    }

    @PostMapping("/invitations/{id}/pin")
    public InvitationView setPin(@PathVariable Long id, @RequestBody(required = false) SetPinRequest request) {
        return adminService.setPin(id, request);
    }

    @DeleteMapping("/invitations/{id}/pin")
    public InvitationView clearPin(@PathVariable Long id) {
        return adminService.clearPin(id);
    }

    @PostMapping("/invitations/{id}/pin/unlock")
    public InvitationView unlockPin(@PathVariable Long id) {
        return adminService.unlockPin(id);
    }

    @PatchMapping("/invitations/{id}/theme")
    public InvitationView updateTheme(@PathVariable Long id, @RequestBody(required = false) ThemeRequest request) {
        return adminService.updateTheme(id, request);
    }
}
