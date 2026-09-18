package com.tripura.backend.dto;

public class AuthResponseDto {

    private String token;
    private Long userId;
    private String name;
    private String phone;
    private String role;
    private Boolean hasActivePlan;
    private String planName;

    public AuthResponseDto() {}

    public static AuthResponseDtoBuilder builder() {
        return new AuthResponseDtoBuilder();
    }

    public static class AuthResponseDtoBuilder {
        private String token;
        private Long userId;
        private String name;
        private String phone;
        private String role;
        private Boolean hasActivePlan;
        private String planName;

        public AuthResponseDtoBuilder token(String token) { this.token = token; return this; }
        public AuthResponseDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseDtoBuilder name(String name) { this.name = name; return this; }
        public AuthResponseDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public AuthResponseDtoBuilder role(String role) { this.role = role; return this; }
        public AuthResponseDtoBuilder hasActivePlan(Boolean hasActivePlan) { this.hasActivePlan = hasActivePlan; return this; }
        public AuthResponseDtoBuilder planName(String planName) { this.planName = planName; return this; }

        public AuthResponseDto build() {
            AuthResponseDto a = new AuthResponseDto();
            a.token = this.token;
            a.userId = this.userId;
            a.name = this.name;
            a.phone = this.phone;
            a.role = this.role;
            a.hasActivePlan = this.hasActivePlan;
            a.planName = this.planName;
            return a;
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getHasActivePlan() { return hasActivePlan; }
    public void setHasActivePlan(Boolean hasActivePlan) { this.hasActivePlan = hasActivePlan; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
}
