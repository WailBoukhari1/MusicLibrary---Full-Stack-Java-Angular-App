package com.backend.music.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "albums")
public class Album {
    @Id
    private String id;
    private String titre;
    private String artiste;
    private Integer annee;
    private List<String> songIds;
    
    @DBRef
    private List<Song> songs = new ArrayList<>();
} 