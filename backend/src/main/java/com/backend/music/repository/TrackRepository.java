package com.backend.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.backend.music.model.Track;

@Repository
public interface TrackRepository extends MongoRepository<Track, String> {
} 