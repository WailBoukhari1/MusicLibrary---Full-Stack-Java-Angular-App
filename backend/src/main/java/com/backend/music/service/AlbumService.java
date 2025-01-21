package com.backend.music.service;

import com.backend.music.dto.AlbumDTO;
import com.backend.music.dto.AlbumCreateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AlbumService {
    Page<AlbumDTO> getAllAlbums(Pageable pageable);
    Page<AlbumDTO> searchByTitle(String title, Pageable pageable);
    Page<AlbumDTO> searchByArtist(String artist, Pageable pageable);
    Page<AlbumDTO> filterByYear(Integer year, Pageable pageable);
    AlbumDTO getAlbumById(String id);
    AlbumDTO createAlbum(AlbumCreateDTO albumCreateDTO);
    AlbumDTO updateAlbum(String id, AlbumDTO albumDTO);
    void deleteAlbum(String id);
    AlbumDTO addSongToAlbum(String albumId, String songId);
} 