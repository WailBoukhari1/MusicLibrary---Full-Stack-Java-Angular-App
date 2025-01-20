package com.backend.music.service;

import com.backend.music.dto.SongDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface SongService {
    Page<SongDTO> getAllSongs(Pageable pageable);
    Page<SongDTO> searchByTitle(String title, Pageable pageable);
    Page<SongDTO> getSongsByAlbum(String albumId, Pageable pageable);
    SongDTO getSongById(String id);
    SongDTO createSong(SongDTO songDTO, MultipartFile audioFile);
    SongDTO updateSong(String id, SongDTO songDTO);
    void deleteSong(String id);
    byte[] getAudioFile(String audioFileId);
} 