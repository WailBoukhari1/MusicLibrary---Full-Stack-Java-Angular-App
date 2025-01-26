package com.backend.music.service;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.model.Song;

import java.util.List;

public interface SongService {
    Page<SongResponse> getAllSongs(Pageable pageable);
    Page<SongResponse> searchByTitle(String title, Pageable pageable);
    Page<SongResponse> getSongsByAlbum(String albumId, Pageable pageable);
    SongResponse getSongById(String id);
    SongResponse createSong(SongRequest request);
    SongResponse updateSong(String id, SongRequest request);
    void deleteSong(String id);
    Resource getAudioFile(String id);
    List<SongResponse> getSongsByIds(List<String> songIds);
    SongResponse toggleFavorite(String id);
    Page<SongResponse> getFavoriteSongs(Pageable pageable);
} 