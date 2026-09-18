package com.tripura.backend.dto;

import com.tripura.backend.model.Enrollment;
import jakarta.validation.constraints.NotNull;

public class EnrollmentRequestDto {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotNull(message = "Enrollment type is required")
    private Enrollment.EnrollmentType type;

    public EnrollmentRequestDto() {}

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Enrollment.EnrollmentType getType() { return type; }
    public void setType(Enrollment.EnrollmentType type) { this.type = type; }
}
