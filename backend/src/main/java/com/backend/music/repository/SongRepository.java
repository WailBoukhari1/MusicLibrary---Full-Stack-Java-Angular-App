package com.backend.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.music.model.Song;

public interface SongRepository extends MongoRepository<Song, String> {

} 