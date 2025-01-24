package com.backend.music.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.music.model.RefreshToken;

@Repository
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findByUserId(String userId);
    
    @Query(value = "{ 'userId': ?0 }", fields = "{ 'revoked': true }")
    void revokeAllUserTokens(String userId);
    
    void deleteByUserId(String userId);

    void deleteByToken(String token);
} 