package com.thurudichoi.config;

import com.thurudichoi.entity.AdminUser;
import com.thurudichoi.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public DataSeeder(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        AdminUser admin = adminUserRepository.findByUsername(username).orElseGet(() -> {
            AdminUser created = new AdminUser();
            created.setUsername(username);
            return created;
        });
        if (admin.getPasswordHash() == null || !passwordEncoder.matches(password, admin.getPasswordHash())) {
            admin.setPasswordHash(passwordEncoder.encode(password));
            adminUserRepository.save(admin);
        }
    }
}
