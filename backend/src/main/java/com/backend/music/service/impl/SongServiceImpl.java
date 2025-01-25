package com.backend.music.service.impl;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.exception.ResourceNotFoundException;
import com.backend.music.mapper.SongMapper;
import com.backend.music.model.Song;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.FileStorageService;
import com.backend.music.service.SongService;
import com.backend.music.util.AudioUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class SongServiceImpl implements SongService {
    
    private final SongRepository songRepository;
    private final SongMapper songMapper;
    private final FileStorageService fileStorageService;

    @Override
    public Page<SongResponse> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
                .map(songMapper::toResponseDto);
    }

    @Override
    public SongResponse getSongById(String id) {
        return songRepository.findById(id)
                .map(songMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    @Override
    public SongResponse createSong(SongRequest request) {
        Song song = songMapper.toEntity(request);
        
        if (request.getAudioFile() != null) {
            String audioFileId = fileStorageService.store(request.getAudioFile());
            song.setAudioFileId(audioFileId);
            
            Integer duration = fileStorageService.getAudioDuration(request.getAudioFile());
            song.setDuration(duration);
        }
        
        if (request.getImageFile() != null) {
            String imageFileId = fileStorageService.store(request.getImageFile());
            song.setImageFileId(imageFileId);
        }
        
        song.setCreatedAt(LocalDateTime.now());
        song.setUpdatedAt(LocalDateTime.now());
        
        return songMapper.toResponseDto(songRepository.save(song));
    }

    @Override
    public SongResponse updateSong(String id, SongRequest request) {
        return songRepository.findById(id)
                .map(song -> {
                    songMapper.updateEntityFromDto(request, song);
                    
                    if (request.getAudioFile() != null) {
                        if (song.getAudioFileId() != null) {
                            fileStorageService.delete(song.getAudioFileId());
                        }
                        String audioFileId = fileStorageService.store(request.getAudioFile());
                        song.setAudioFileId(audioFileId);
                        
                        Integer duration = fileStorageService.getAudioDuration(request.getAudioFile());
                        song.setDuration(duration);
                    }
                    
                    if (request.getImageFile() != null) {
                        if (song.getImageFileId() != null) {
                            fileStorageService.delete(song.getImageFileId());
                        }
                        String imageFileId = fileStorageService.store(request.getImageFile());
                        song.setImageFileId(imageFileId);
                    }
                    
                    song.setUpdatedAt(LocalDateTime.now());
                    return songMapper.toResponseDto(songRepository.save(song));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    @Override
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
                
        if (song.getAudioFileId() != null) {
            fileStorageService.delete(song.getAudioFileId());
        }
        if (song.getImageFileId() != null) {
            fileStorageService.delete(song.getImageFileId());
        }
        
        songRepository.deleteById(id);
    }

    @Override
    public Page<SongResponse> searchByTitle(String title, Pageable pageable) {
        return songRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(songMapper::toResponseDto);
    }

    @Override
    public Page<SongResponse> getSongsByAlbum(String albumId, Pageable pageable) {
        return songRepository.findByAlbumId(albumId, pageable)
                .map(songMapper::toResponseDto);
    }

    @Override
    public Resource getAudioFile(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        
        if (song.getAudioFileId() == null) {
            throw new ResourceNotFoundException("Audio file not found for song: " + id);
        }
        
        return fileStorageService.load(song.getAudioFileId());
    }
} 