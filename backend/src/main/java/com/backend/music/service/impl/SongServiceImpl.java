package com.backend.music.service.impl;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.exception.ResourceNotFoundException;
import com.backend.music.mapper.SongMapper;
import com.backend.music.model.Album;
import com.backend.music.model.Song;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.FileStorageService;
import com.backend.music.service.SongService;
import com.backend.music.util.FileValidationUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import java.io.BufferedInputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongServiceImpl implements SongService {
    
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final SongMapper songMapper;
    private final FileStorageService fileStorageService;
    private final FileValidationUtils fileValidationUtils;

    @Override
    public Page<SongResponse> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
            .map(songMapper::toResponse);
    }

    @Override
    public Page<SongResponse> searchByTitle(String title, Pageable pageable) {
        return songRepository.findByTitleContainingIgnoreCase(title, pageable)
            .map(songMapper::toResponse);
    }

    @Override
    public Page<SongResponse> getSongsByAlbum(String albumId, Pageable pageable) {
        return songRepository.findByAlbumId(albumId, pageable)
            .map(songMapper::toResponse);
    }

    @Override
    public SongResponse getSongById(String id) {
        return songRepository.findById(id)
            .map(songMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
    }

    @Override
    @Transactional
    public SongResponse createSong(SongRequest request) {
        // Validate audio file
        if (request.getAudioFile() != null && !fileValidationUtils.isValidAudioFile(request.getAudioFile())) {
            throw new IllegalArgumentException("Invalid audio file format");
        }
        
        Song song = songMapper.toEntity(request);
        
        // Handle audio file
        if (request.getAudioFile() != null) {
            String audioFileId = fileStorageService.store(request.getAudioFile());
            song.setAudioFileId(audioFileId);
            song.setDuration(fileStorageService.getAudioDuration(request.getAudioFile()));
        }
        
        // Handle image file
        if (request.getImageFile() != null) {
            String imageFileId = fileStorageService.store(request.getImageFile());
            song.setImageFileId(imageFileId);
        }
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        song.setCreatedAt(now);
        song.setUpdatedAt(now);
        
        // Handle album relationship
        if (request.getAlbumId() != null) {
            Album album = albumRepository.findById(request.getAlbumId())
                .orElseThrow(() -> new RuntimeException("Album not found"));
                
            song.setAlbum(album);
            Song savedSong = songRepository.save(song);
            
            // Update album
            album.getSongs().add(savedSong);
            album.setTotalTracks(album.getSongs().size());
            album.setTotalDuration(calculateAlbumDuration(album.getSongs()));
            album.setUpdatedAt(now);
            albumRepository.save(album);
            
            return songMapper.toResponse(savedSong);
        }
        
        return songMapper.toResponse(songRepository.save(song));
    }
    
    private Integer calculateAlbumDuration(List<Song> songs) {
        return songs.stream()
            .map(Song::getDuration)
            .filter(duration -> duration != null)
            .reduce(0, Integer::sum);
    }

    @Override
    @Transactional
    public SongResponse updateSong(String id, SongRequest request) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
            
        // Store old albumId to check if it changed
        String oldAlbumId = song.getAlbum().getId();
            
        songMapper.updateEntityFromRequest(request, song);
        
        if (request.getAudioFile() != null) {
            if (song.getAudioFileId() != null) {
                fileStorageService.delete(song.getAudioFileId());
            }
            String audioFileId = fileStorageService.store(request.getAudioFile());
            song.setAudioFileId(audioFileId);
        }
        
        if (request.getImageFile() != null) {
            if (song.getImageFileId() != null) {
                fileStorageService.delete(song.getImageFileId());
            }
            String imageFileId = fileStorageService.store(request.getImageFile());
            song.setImageFileId(imageFileId);
        }
        
        song.setUpdatedAt(LocalDateTime.now());
        
        Song savedSong = songRepository.save(song);

        // Handle album relationship changes
        if (oldAlbumId != null && !oldAlbumId.equals(song.getAlbum().getId())) {
            // Remove song from old album
            Album oldAlbum = albumRepository.findById(oldAlbumId).orElse(null);
            if (oldAlbum != null) {
                oldAlbum.getSongs().remove(savedSong);
                oldAlbum.setUpdatedAt(LocalDateTime.now());
                albumRepository.save(oldAlbum);
            }
        }

        if (savedSong.getAlbum() != null) {
            Album newAlbum = albumRepository.findById(savedSong.getAlbum().getId())
                .orElseThrow(() -> new RuntimeException("Album not found"));
                
            if (!newAlbum.getSongs().contains(savedSong)) {
                newAlbum.getSongs().add(savedSong);
                newAlbum.setUpdatedAt(LocalDateTime.now());
                albumRepository.save(newAlbum);
            }
            
            savedSong.setAlbum(newAlbum);
        }
        
        return songMapper.toResponse(savedSong);
    }

    @Override
    @Transactional
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
            
        // Remove song from album if it belongs to one
        if (song.getAlbum() != null) {
            Album album = albumRepository.findById(song.getAlbum().getId()).orElse(null);
            if (album != null) {
                album.getSongs().remove(song);
                album.setUpdatedAt(LocalDateTime.now());
                albumRepository.save(album);
            }
        }
            
        if (song.getAudioFileId() != null) {
            fileStorageService.delete(song.getAudioFileId());
        }
        
        if (song.getImageFileId() != null) {
            fileStorageService.delete(song.getImageFileId());
        }
        
        songRepository.delete(song);
    }

    @Override
    public Resource getAudioFile(String id) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
            
        if (song.getAudioFileId() == null) {
            throw new RuntimeException("Song has no audio file");
        }
        
        return fileStorageService.load(song.getAudioFileId());
    }

    @Override
    public List<SongResponse> getSongsByIds(List<String> songIds) {
        return songRepository.findAllById(songIds)
            .stream()
            .map(songMapper::toResponse)
            .collect(Collectors.toList());
    }

    // New methods for favorites
    public SongResponse toggleFavorite(String id) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
        song.setIsFavorite(!song.getIsFavorite());
        Song savedSong = songRepository.save(song);
        return songMapper.toResponse(savedSong);
    }

    public Page<SongResponse> getFavoriteSongs(Pageable pageable) {
        return songRepository.findByIsFavoriteTrue(pageable)
            .map(songMapper::toResponse);
    }
}
