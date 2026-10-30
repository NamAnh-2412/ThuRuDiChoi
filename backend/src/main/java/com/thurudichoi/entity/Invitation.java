package com.thurudichoi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitation")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminUser admin;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(length = 150)
    private String title;

    @Column(length = 100)
    private String receiver;

    @Enumerated(EnumType.STRING)
    @Column(name = "theme_season", length = 20)
    private Season themeSeason;

    @Column(name = "pin_hash", length = 100)
    private String pinHash;

    @Column(name = "pin_updated_at")
    private LocalDateTime pinUpdatedAt;

    @Column(name = "pin_failed_count", nullable = false)
    private int pinFailedCount;

    @Column(name = "pin_locked_until")
    private LocalDateTime pinLockedUntil;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "invitation", fetch = FetchType.LAZY)
    private InvitationResponse response;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public AdminUser getAdmin() {
        return admin;
    }

    public void setAdmin(AdminUser admin) {
        this.admin = admin;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public Season getThemeSeason() {
        return themeSeason;
    }

    public void setThemeSeason(Season themeSeason) {
        this.themeSeason = themeSeason;
    }

    public String getPinHash() {
        return pinHash;
    }

    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
    }

    public LocalDateTime getPinUpdatedAt() {
        return pinUpdatedAt;
    }

    public void setPinUpdatedAt(LocalDateTime pinUpdatedAt) {
        this.pinUpdatedAt = pinUpdatedAt;
    }

    public int getPinFailedCount() {
        return pinFailedCount;
    }

    public void setPinFailedCount(int pinFailedCount) {
        this.pinFailedCount = pinFailedCount;
    }

    public LocalDateTime getPinLockedUntil() {
        return pinLockedUntil;
    }

    public void setPinLockedUntil(LocalDateTime pinLockedUntil) {
        this.pinLockedUntil = pinLockedUntil;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public InvitationResponse getResponse() {
        return response;
    }
}
