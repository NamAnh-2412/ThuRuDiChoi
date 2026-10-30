package com.thurudichoi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UploadController {

    private final Path uploadDir;

    public UploadController(@Value("${app.upload.dir:uploads}") String dir) {
        this.uploadDir = Path.of(dir).toAbsolutePath().normalize();
    }

    @PostMapping(value = "/api/admin/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hãy chọn một ảnh");
        }
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String extension = extensionFor(contentType);
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF");
        }
        Files.createDirectories(uploadDir);
        String filename = UUID.randomUUID() + extension;
        Path target = uploadDir.resolve(filename).normalize();
        if (!target.startsWith(uploadDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên ảnh không hợp lệ");
        }
        file.transferTo(target);
        return Map.of("url", "/api/uploads/" + filename);
    }

    @GetMapping("/api/uploads/{filename}")
    public ResponseEntity<Resource> read(@PathVariable String filename) throws IOException {
        if (!filename.matches("[a-zA-Z0-9._-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy ảnh");
        }
        Path target = uploadDir.resolve(filename).normalize();
        if (!target.startsWith(uploadDir) || !Files.isRegularFile(target)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh");
        }
        String probed = Files.probeContentType(target);
        MediaType mediaType = probed == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(probed);
        return ResponseEntity.ok().contentType(mediaType).body(new FileSystemResource(target));
    }

    private static String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> null;
        };
    }
}
