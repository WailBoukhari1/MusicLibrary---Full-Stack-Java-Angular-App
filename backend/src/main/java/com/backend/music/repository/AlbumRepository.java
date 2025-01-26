package com.backend.music.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.music.model.Album;

import java.time.LocalDateTime;

@Repository
public interface AlbumRepository extends MongoRepository<Album, String> {
    @Query("{ 'title': { $regex: ?0, $options: 'i' }}")
    Page<Album> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("{ 'artist': { $regex: ?0, $options: 'i' }}")
    Page<Album> findByArtistContainingIgnoreCase(String artist, Pageable pageable);
    
    @Query("{ 'releaseDate': { $gte: ?0, $lt: ?1 }}")
    Page<Album> findByYear(Integer year, Pageable pageable);

    Page<Album> findByReleaseDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
} 