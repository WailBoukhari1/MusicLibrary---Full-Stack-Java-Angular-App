package com.backend.music.model;

import java.util.Date;
import java.util.Set;
import java.util.HashSet;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Document(collection = "songs")
public class Song {
    @Id
    private String id;
    private String titre;
    private Integer duree;
    private Integer trackNumber;
    
    @Size(max = 200)
    private String description;
    private String categorie;
    private Date dateAjout;
    private String audioFileId;
    
    @DBRef
    private Album album;

    private String artiste;
    private String albumId;

    @DBRef
    private Set<Category> categories = new HashSet<>();
} 