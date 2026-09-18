package com.tripura.backend.dto;

public class StreamTokenResponseDto {

    private Long recordingId;
    private String bunnyVideoId;
    private String embedUrl;
    private String hlsStreamUrl;
    private Long expiresTimestamp;
    private String token;

    public StreamTokenResponseDto() {}

    public static StreamTokenResponseDtoBuilder builder() {
        return new StreamTokenResponseDtoBuilder();
    }

    public static class StreamTokenResponseDtoBuilder {
        private Long recordingId;
        private String bunnyVideoId;
        private String embedUrl;
        private String hlsStreamUrl;
        private Long expiresTimestamp;
        private String token;

        public StreamTokenResponseDtoBuilder recordingId(Long recordingId) { this.recordingId = recordingId; return this; }
        public StreamTokenResponseDtoBuilder bunnyVideoId(String bunnyVideoId) { this.bunnyVideoId = bunnyVideoId; return this; }
        public StreamTokenResponseDtoBuilder embedUrl(String embedUrl) { this.embedUrl = embedUrl; return this; }
        public StreamTokenResponseDtoBuilder hlsStreamUrl(String hlsStreamUrl) { this.hlsStreamUrl = hlsStreamUrl; return this; }
        public StreamTokenResponseDtoBuilder expiresTimestamp(Long expiresTimestamp) { this.expiresTimestamp = expiresTimestamp; return this; }
        public StreamTokenResponseDtoBuilder token(String token) { this.token = token; return this; }

        public StreamTokenResponseDto build() {
            StreamTokenResponseDto s = new StreamTokenResponseDto();
            s.recordingId = this.recordingId;
            s.bunnyVideoId = this.bunnyVideoId;
            s.embedUrl = this.embedUrl;
            s.hlsStreamUrl = this.hlsStreamUrl;
            s.expiresTimestamp = this.expiresTimestamp;
            s.token = this.token;
            return s;
        }
    }

    public Long getRecordingId() { return recordingId; }
    public void setRecordingId(Long recordingId) { this.recordingId = recordingId; }

    public String getBunnyVideoId() { return bunnyVideoId; }
    public void setBunnyVideoId(String bunnyVideoId) { this.bunnyVideoId = bunnyVideoId; }

    public String getEmbedUrl() { return embedUrl; }
    public void setEmbedUrl(String embedUrl) { this.embedUrl = embedUrl; }

    public String getHlsStreamUrl() { return hlsStreamUrl; }
    public void setHlsStreamUrl(String hlsStreamUrl) { this.hlsStreamUrl = hlsStreamUrl; }

    public Long getExpiresTimestamp() { return expiresTimestamp; }
    public void setExpiresTimestamp(Long expiresTimestamp) { this.expiresTimestamp = expiresTimestamp; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
