package com.backend.music.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.music.exception.TokenRefreshException;
import com.backend.music.model.RefreshToken;
import com.backend.music.repository.RefreshTokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    
    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;
    
    private final RefreshTokenRepository refreshTokenRepository;
    private final HttpServletRequest request;
    
    @Transactional
    public RefreshToken createRefreshToken(String userId) {
        // Optionally limit active refresh tokens per user
        List<RefreshToken> existingTokens = refreshTokenRepository.findByUserId(userId);
        if (existingTokens.size() >= 5) {
            // Remove oldest token if limit reached
            refreshTokenRepository.delete(existingTokens.get(0));
        }
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setIssuedAt(Instant.now());
        refreshToken.setUserAgent(request.getHeader("User-Agent"));
        refreshToken.setIpAddress(getClientIp());
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional
    public RefreshToken verifyAndRefresh(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new TokenRefreshException("Refresh token not found"));
            
        if (refreshToken.isRevoked()) {
            // Revoke all tokens for this user as security measure
            refreshTokenRepository.revokeAllUserTokens(refreshToken.getUserId());
            throw new TokenRefreshException("Refresh token was revoked");
        }
        
        if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new TokenRefreshException("Refresh token was expired");
        }
        
        // Update token details
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setUserAgent(request.getHeader("User-Agent"));
        refreshToken.setIpAddress(getClientIp());
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new TokenRefreshException("Refresh token not found"));
        
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }
    
    private String getClientIp() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken save(RefreshToken token) {
        return refreshTokenRepository.save(token);
    }

    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
} 