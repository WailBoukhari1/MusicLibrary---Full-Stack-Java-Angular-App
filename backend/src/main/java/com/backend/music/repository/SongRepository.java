package com.backend.music.repository;

import com.backend.music.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song, String> {
    Page<Song> findByTitreContainingIgnoreCase(String titre, Pageable pageable);
    Page<Song> findByAlbumId(String albumId, Pageable pageable);
} 