package com.thurudichoi.web;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> status(ResponseStatusException ex) {
        String message = ex.getReason() == null ? "Có lỗi xảy ra" : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage() == null ? "Dữ liệu chưa hợp lệ" : error.getDefaultMessage())
                .orElse("Dữ liệu chưa hợp lệ");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
