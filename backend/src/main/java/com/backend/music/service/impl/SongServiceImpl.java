package com.backend.music.service.impl;

import com.backend.music.dto.SongDTO;
import com.backend.music.mapper.SongMapper;
import com.backend.music.model.Song;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.AlbumService;
import com.backend.music.service.SongService;
import com.backend.music.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Transactional
public class SongServiceImpl implements SongService {
    
    private static final Logger logger = LoggerFactory.getLogger(SongServiceImpl.class);
    
    private final SongRepository songRepository;
    private final AlbumService albumService;
    private final FileStorageService fileStorageService;
    private final SongMapper songMapper;
    private final GridFsTemplate gridFsTemplate;
    private final FileValidationService fileValidationService;
    
    @Override
    public Page<SongDTO> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
                .map(songMapper::toDto);
    }
    
    @Override
    public Page<SongDTO> searchByTitle(String title, Pageable pageable) {
        return songRepository.findByTitreContainingIgnoreCase(title, pageable)
                .map(songMapper::toDto);
    }
    
    @Override
    public Page<SongDTO> getSongsByAlbum(String albumId, Pageable pageable) {
        return songRepository.findByAlbumId(albumId, pageable)
                .map(songMapper::toDto);
    }
    
    @Override
    public SongDTO getSongById(String id) {
        return songRepository.findById(id)
                .map(songMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }
    
    @Override
    @Transactional
    public SongDTO uploadSong(MultipartFile file, String title, String artist, String albumId) {
        // Store the audio file
        String audioFileId = fileStorageService.storeFile(file);

        // Create and save the song
        Song song = new Song();
        song.setTitre(title);
        song.setArtiste(artist);
        song.setAlbumId(albumId);
        song.setAudioFileId(audioFileId);
        song.setDateAjout(new Date());
        
        Song savedSong = songRepository.save(song);
        
        // Add song to album
        albumService.addSongToAlbum(albumId, savedSong.getId());
        
        return songMapper.toDto(savedSong);
    }
    
    @Override
    public SongDTO updateSong(String id, SongDTO songDTO) {
        return songRepository.findById(id)
                .map(song -> {
                    songMapper.updateEntityFromDto(songDTO, song);
                    return songMapper.toDto(songRepository.save(song));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }
    
    @Override
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        
        if (song.getAudioFileId() != null) {
            gridFsTemplate.delete(Query.query(Criteria.where("_id").is(song.getAudioFileId())));
        }
        
        songRepository.deleteById(id);
    }
    
    @Override
    public byte[] getAudioFile(String audioFileId) {
        try {
            return gridFsTemplate.getResource(audioFileId).getInputStream().readAllBytes();
        } catch (IOException e) {
            throw new ResourceNotFoundException("Audio file not found with id: " + audioFileId);
        }
    }
    
    @Override
    @Transactional
    public SongDTO createSong(SongDTO songDTO, MultipartFile audioFile) {
        String audioFileId = fileStorageService.storeFile(audioFile);
        
        Song song = songMapper.toEntity(songDTO);
        song.setAudioFileId(audioFileId);
        song.setDateAjout(new Date());
        
        Song savedSong = songRepository.save(song);
        
        if (song.getAlbumId() != null) {
            albumService.addSongToAlbum(song.getAlbumId(), savedSong.getId());
        }
        
        return songMapper.toDto(savedSong);
    }
} 