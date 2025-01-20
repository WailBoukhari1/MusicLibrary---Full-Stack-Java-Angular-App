package com.backend.music.repository;

import com.backend.music.model.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album, String> {
    Page<Album> findByTitreContainingIgnoreCase(String titre, Pageable pageable);
    Page<Album> findByArtisteContainingIgnoreCase(String artiste, Pageable pageable);
    Page<Album> findByAnnee(Integer annee, Pageable pageable);
} 