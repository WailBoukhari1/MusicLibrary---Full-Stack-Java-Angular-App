package com.backend.music.service;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.model.Song;
import com.backend.music.repository.SongRepository;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.mapper.SongMapper;
import com.backend.music.util.FileValidationUtils;
import com.backend.music.service.impl.SongServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class SongServiceTest {

    @Mock
    private SongRepository songRepository;

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private SongMapper songMapper;

    @Mock
    private FileValidationUtils fileValidationUtils;

    @InjectMocks
    private SongServiceImpl songService;

    private Song testSong;
    private SongRequest songRequest;
    private SongResponse songResponse;
    private MultipartFile audioFile;
    private MultipartFile imageFile;

    @BeforeEach
    void setUp() {
        testSong = Song.builder()
                .id("1")
                .title("Test Song")
                .artist("Test Artist")
                .audioFileId("audio123")
                .imageFileId("image123")
                .duration(180)
                .trackNumber(1)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        audioFile = new MockMultipartFile(
                "audio",
                "test.wav",
                "audio/wav",
                "test audio content".getBytes()
        );

        imageFile = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        songRequest = SongRequest.builder()
                .title("Test Song")
                .artist("Test Artist")
                .trackNumber(1)
                .audioFile(audioFile)
                .imageFile(imageFile)
                .build();

        songResponse = SongResponse.builder()
                .id("1")
                .title("Test Song")
                .artist("Test Artist")
                .audioFileId("audio123")
                .imageFileId("image123")
                .duration(180)
                .build();
    }

    @Test
    void getAllSongsSuccess() {
        // Arrange
        Page<Song> songPage = new PageImpl<>(List.of(testSong));
        when(songRepository.findAll(any(Pageable.class))).thenReturn(songPage);
        when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

        // Act
        Page<SongResponse> result = songService.getAllSongs(Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testSong.getTitle(), result.getContent().get(0).getTitle());
    }

    // @Test
    // void createSongSuccess() {
    //     // Arrange
    //     when(fileStorageService.store(any(MultipartFile.class)))
    //             .thenReturn("newAudio123")
    //             .thenReturn("newImage123");
    //     when(songRepository.save(any(Song.class))).thenReturn(testSong);
    //     when(songMapper.toEntity(any(SongRequest.class))).thenReturn(testSong);
    //     when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

    //     // Act
    //     SongResponse result = songService.createSong(songRequest);

    //     // Assert
    //     assertNotNull(result);
    //     assertEquals(songRequest.getTitle(), result.getTitle());
    //     assertEquals(songRequest.getArtist(), result.getArtist());
    //     verify(fileStorageService, times(2)).store(any(MultipartFile.class));
    // }

    @Test
    void getSongByIdSuccess() {
        // Arrange
        when(songRepository.findById("1")).thenReturn(Optional.of(testSong));
        when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

        // Act
        SongResponse result = songService.getSongById("1");

        // Assert
        assertNotNull(result);
        assertEquals(testSong.getId(), result.getId());
        assertEquals(testSong.getTitle(), result.getTitle());
    }

    @Test
    void deleteSongSuccess() {
        // Arrange
        when(songRepository.findById("1")).thenReturn(Optional.of(testSong));
        doNothing().when(songRepository).delete(any(Song.class));
        doNothing().when(fileStorageService).delete(anyString());

        // Act & Assert
        assertDoesNotThrow(() -> songService.deleteSong("1"));
        verify(songRepository).delete(testSong);
        verify(fileStorageService).delete(testSong.getAudioFileId());
        verify(fileStorageService).delete(testSong.getImageFileId());
    }

    @Test
    void searchByTitleSuccess() {
        // Arrange
        Page<Song> songPage = new PageImpl<>(List.of(testSong));
        when(songRepository.findByTitleContainingIgnoreCase(anyString(), any(Pageable.class)))
                .thenReturn(songPage);
        when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

        // Act
        Page<SongResponse> result = songService.searchByTitle("Test", Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testSong.getTitle(), result.getContent().get(0).getTitle());
    }

    @Test
    void toggleFavoriteSuccess() {
        // Arrange
        when(songRepository.findById("1")).thenReturn(Optional.of(testSong));
        when(songRepository.save(any(Song.class))).thenReturn(testSong);
        when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

        // Act
        SongResponse result = songService.toggleFavorite("1");

        // Assert
        assertNotNull(result);
        verify(songRepository).save(any(Song.class));
    }

    @Test
    void getFavoriteSongsSuccess() {
        // Arrange
        Page<Song> songPage = new PageImpl<>(List.of(testSong));
        when(songRepository.findByIsFavoriteTrue(any(Pageable.class))).thenReturn(songPage);
        when(songMapper.toResponse(any(Song.class))).thenReturn(songResponse);

        // Act
        Page<SongResponse> result = songService.getFavoriteSongs(Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testSong.getTitle(), result.getContent().get(0).getTitle());
    }
} 