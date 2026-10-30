package com.thurudichoi.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invitation_response")
public class InvitationResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invitation_id", nullable = false, unique = true)
    private Invitation invitation;

    @Column(name = "refuse_count", nullable = false)
    private int refuseCount;

    @Column(length = 500)
    private String note;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LetterMode mode = LetterMode.STANDARD;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseDetail> details = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public Invitation getInvitation() {
        return invitation;
    }

    public void setInvitation(Invitation invitation) {
        this.invitation = invitation;
    }

    public int getRefuseCount() {
        return refuseCount;
    }

    public void setRefuseCount(int refuseCount) {
        this.refuseCount = refuseCount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LetterMode getMode() {
        return mode;
    }

    public void setMode(LetterMode mode) {
        this.mode = mode;
    }

    public List<ResponseDetail> getDetails() {
        return details;
    }
}
