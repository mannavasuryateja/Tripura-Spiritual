package com.tripura.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> otpBuckets = new ConcurrentHashMap<>();

    @Value("${app.rate-limiting.login-capacity:10}")
    private long loginCapacity;

    @Value("${app.rate-limiting.login-refill-tokens:10}")
    private long loginRefillTokens;

    @Value("${app.rate-limiting.login-refill-duration-seconds:60}")
    private long loginRefillDurationSeconds;

    @Value("${app.rate-limiting.otp-capacity:5}")
    private long otpCapacity;

    @Value("${app.rate-limiting.otp-refill-tokens:5}")
    private long otpRefillTokens;

    @Value("${app.rate-limiting.otp-refill-duration-seconds:60}")
    private long otpRefillDurationSeconds;

    public Bucket resolveLoginBucket(String clientIp) {
        return loginBuckets.computeIfAbsent(clientIp, k -> createNewLoginBucket());
    }

    public Bucket resolveOtpBucket(String clientIp) {
        return otpBuckets.computeIfAbsent(clientIp, k -> createNewOtpBucket());
    }

    private Bucket createNewLoginBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(loginCapacity)
                .refillGreedy(loginRefillTokens, Duration.ofSeconds(loginRefillDurationSeconds))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createNewOtpBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(otpCapacity)
                .refillGreedy(otpRefillTokens, Duration.ofSeconds(otpRefillDurationSeconds))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }
}
