package com.backend.music.dto;

import lombok.Data;
import jakarta.validation.constraints.Size;
import java.util.Date;

@Data
public class SongDTO {
    private String id;
    private String titre;
    private Integer duree;
    private Integer trackNumber;
    
    @Size(max = 200)
    private String description;
    private String categorie;
    private Date dateAjout;
    private String albumId;
    private String audioFileId;
} 