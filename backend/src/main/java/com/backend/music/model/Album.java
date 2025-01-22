package com.backend.music.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.sound.midi.Track;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "albums")
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Artist is required")
    @Column(nullable = false)
    private String artist;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "genre")
    private Genre genre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "release_date")
    private LocalDateTime releaseDate;
    
    @Column(name = "cover_url")
    private String coverUrl;
    
    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    private List<Track> tracks = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

