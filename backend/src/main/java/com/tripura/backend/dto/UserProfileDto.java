package com.tripura.backend.dto;

import java.util.List;

public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean hasActivePlan;
    private String planName;
    private String validUntil;
    private List<Integer> unlockedDays;
    private String whatsappCommunityUrl;
    private List<Long> unlockedBookIds;

    public UserProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isHasActivePlan() { return hasActivePlan; }
    public void setHasActivePlan(boolean hasActivePlan) { this.hasActivePlan = hasActivePlan; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }

    public List<Integer> getUnlockedDays() { return unlockedDays; }
    public void setUnlockedDays(List<Integer> unlockedDays) { this.unlockedDays = unlockedDays; }

    public String getWhatsappCommunityUrl() { return whatsappCommunityUrl; }
    public void setWhatsappCommunityUrl(String whatsappCommunityUrl) { this.whatsappCommunityUrl = whatsappCommunityUrl; }

    public List<Long> getUnlockedBookIds() { return unlockedBookIds; }
    public void setUnlockedBookIds(List<Long> unlockedBookIds) { this.unlockedBookIds = unlockedBookIds; }
}
