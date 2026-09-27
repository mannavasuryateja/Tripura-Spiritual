package com.tripura.backend.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Role-Based Access Control (RBAC) Enum for Tripura Spiritual Platform.
 * Defines roles and their associated granular permissions.
 */
public enum Role {

    ROLE_SEEKER(Set.of(
            "ORIENTATION:WATCH",
            "BOOKS:PREVIEW",
            "PROFILE:MANAGE"
    )),

    ROLE_ENROLLED(Set.of(
            "ORIENTATION:WATCH",
            "BOOKS:PREVIEW",
            "PROFILE:MANAGE",
            "RECORDING:STREAM",
            "COMMUNITY:ACCESS"
    )),

    ROLE_ADMIN(Set.of(
            "ORIENTATION:WATCH",
            "BOOKS:PREVIEW",
            "PROFILE:MANAGE",
            "RECORDING:STREAM",
            "COMMUNITY:ACCESS",
            "MENTOR:VIEW_SCHEDULE",
            "MENTOR:UPDATE_NOTES",
            "MENTOR:CONFIRM_BOOKING",
            "ADMIN:MANAGE_USERS",
            "ADMIN:OVERRIDE_DAYS",
            "ADMIN:INGEST_ZOOM",
            "ADMIN:RECONCILE"
    ));

    private final Set<String> permissions;

    Role(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    /**
     * Returns a list of Spring Security GrantedAuthorities containing both
     * the role itself (e.g., "ROLE_ADMIN") and all assigned permissions (e.g., "ADMIN:MANAGE_USERS").
     */
    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toCollection(ArrayList::new));

        authorities.add(new SimpleGrantedAuthority(this.name()));
        return authorities;
    }

    public static Role fromString(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return ROLE_SEEKER;
        }
        String formatted = roleStr.toUpperCase().trim();
        if (!formatted.startsWith("ROLE_")) {
            formatted = "ROLE_" + formatted;
        }
        try {
            return Role.valueOf(formatted);
        } catch (IllegalArgumentException e) {
            return ROLE_SEEKER;
        }
    }
}
