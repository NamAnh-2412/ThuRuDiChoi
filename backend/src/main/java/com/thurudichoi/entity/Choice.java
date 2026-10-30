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
import jakarta.persistence.Table;

@Entity
@Table(name = "choice")
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private Step step;

    @Column(nullable = false, length = 150)
    private String label;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChoiceScope scope = ChoiceScope.BOTH;

    public Long getId() {
        return id;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public ChoiceScope getScope() {
        return scope;
    }

    public void setScope(ChoiceScope scope) {
        this.scope = scope;
    }
}
