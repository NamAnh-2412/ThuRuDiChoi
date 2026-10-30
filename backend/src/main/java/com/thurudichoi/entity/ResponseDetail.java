package com.thurudichoi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "response_detail")
public class ResponseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "response_id", nullable = false)
    private InvitationResponse response;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private Step step;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "choice_id", nullable = false)
    private Choice choice;

    public Long getId() {
        return id;
    }

    public InvitationResponse getResponse() {
        return response;
    }

    public void setResponse(InvitationResponse response) {
        this.response = response;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }
}
