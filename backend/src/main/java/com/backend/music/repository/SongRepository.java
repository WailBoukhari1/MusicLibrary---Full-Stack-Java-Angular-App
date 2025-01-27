package com.backend.music.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.music.model.Song;

@Repository
public interface SongRepository extends MongoRepository<Song, String> {
    @Query("{ 'title': { $regex: ?0, $options: 'i' }}")
    Page<Song> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Song> findByAlbumId(String albumId, Pageable pageable);

    Page<Song> findByIsFavoriteTrue(Pageable pageable);

    void deleteByAlbumId(String albumId);
} 