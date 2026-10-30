package com.thurudichoi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record ChoiceView(Long id, String label, String imageUrl) {
    }

    public record StepView(
            Long id,
            String code,
            String name,
            String question,
            int stepOrder,
            List<ChoiceView> choices) {
    }

    public record AnswerView(String stepCode, String stepName, Long choiceId, String choiceLabel) {
    }

    public record InviteView(
            String code,
            String title,
            String receiver,
            String themeSeason,
            boolean hasPin,
            boolean submitted,
            int refuseCount,
            String note,
            String mode,
            List<AnswerView> answers,
            List<StepView> steps) {
    }

    public record PinRequest(
            @NotBlank(message = "Nhập đủ 4 số")
            @Pattern(regexp = "\\d{4}", message = "Mã gồm đúng 4 số") String pin) {
    }

    public record PinResultView(String mode, String specialToken) {
    }

    public record PinLockedView(String message, long retryAfterSeconds) {
    }

    public record RefuseView(int refuseCount) {
    }

    public record AnswerRequest(
            @NotBlank(message = "Thiếu bước chọn") String stepCode,
            @NotNull(message = "Thiếu lựa chọn") Long choiceId) {
    }

    public record SubmitRequest(
            @Size(max = 500, message = "Lời nhắn tối đa 500 ký tự") String note,
            @NotNull(message = "Chưa chọn đủ các bước")
            @Size(min = 4, max = 4, message = "Cần chọn đủ bốn bước")
            List<@Valid AnswerRequest> answers) {
    }

    public record LoginRequest(
            @NotBlank(message = "Nhập tài khoản") String username,
            @NotBlank(message = "Nhập mật khẩu") String password) {
    }

    public record LoginResponse(String token, String username) {
    }

    public record StepSummary(Long id, String code, String name, String question, int stepOrder) {
    }

    public record ChoiceAdminView(Long id, Long stepId, String label, String imageUrl, boolean active, String scope) {
    }

    public record ChoiceRequest(
            @NotNull(message = "Thiếu bước") Long stepId,
            @NotBlank(message = "Nhập tên lựa chọn") @Size(max = 150) String label,
            @Size(max = 255) String imageUrl,
            String scope) {
    }

    public record ChoiceUpdateRequest(
            @NotBlank(message = "Nhập tên lựa chọn") @Size(max = 150) String label,
            @Size(max = 255) String imageUrl,
            String scope) {
    }

    public record CreateInvitationRequest(
            @Size(max = 150) String title,
            @NotBlank(message = "Nhập tên người nhận") @Size(max = 100) String receiver,
            String themeSeason,
            String pin) {
    }

    public record SetPinRequest(String pin, Boolean generate) {
    }

    public record ThemeRequest(String themeSeason) {
    }

    public record InvitationView(
            Long id,
            String code,
            String title,
            String receiver,
            String themeSeason,
            boolean hasPin,
            boolean pinLocked,
            String revealedPin,
            LocalDateTime createdAt,
            int refuseCount,
            LocalDateTime submittedAt,
            boolean submitted,
            boolean opened,
            String mode) {
    }

    public record ResponseView(
            Long id,
            Long invitationId,
            String receiver,
            String code,
            String title,
            int refuseCount,
            String note,
            LocalDateTime submittedAt,
            boolean submitted,
            String mode,
            List<AnswerView> answers) {
    }
}
