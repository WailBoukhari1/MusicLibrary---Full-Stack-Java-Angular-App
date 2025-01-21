package com.backend.music.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.music.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 