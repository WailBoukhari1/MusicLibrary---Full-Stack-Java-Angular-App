package com.backend.music.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "refresh_tokens")
public class RefreshToken {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String token;
    
    @Indexed
    private String userId;
    
    @Indexed(expireAfterSeconds = 86400) // Auto-expire after 24 hours
    private Instant expiryDate;
    
    private String userAgent;
    private String ipAddress;
    private boolean revoked;
    private Instant issuedAt;
} 