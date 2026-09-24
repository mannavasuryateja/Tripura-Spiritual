package com.tripura.backend.security;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitingService rateLimitingService;

    public RateLimitFilter(RateLimitingService rateLimitingService) {
        this.rateLimitingService = rateLimitingService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);

        if (path.startsWith("/api/auth/send-otp") || path.startsWith("/api/auth/verify-otp")) {
            Bucket bucket = rateLimitingService.resolveOtpBucket(clientIp);
            if (!bucket.tryConsume(1)) {
                sendRateLimitErrorResponse(response, "Too many OTP verification attempts. Please wait 60 seconds before trying again.");
                return;
            }
        } else if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/signup")) {
            Bucket bucket = rateLimitingService.resolveLoginBucket(clientIp);
            if (!bucket.tryConsume(1)) {
                sendRateLimitErrorResponse(response, "Too many authentication requests. Please slow down and try again shortly.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendRateLimitErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String jsonPayload = String.format(
                "{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                message, java.time.Instant.now()
        );
        response.getWriter().write(jsonPayload);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
