package com.backend.music.mapper;
import java.util.List;

import org.mapstruct.*;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.model.Song;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SongMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "audioFileId", ignore = true)
    @Mapping(target = "imageFileId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "duration", ignore = true)
    @Mapping(target = "album", ignore = true)
    Song toEntity(SongRequest request);
    
    @Mapping(target = "audioUrl", source = "audioFileId")
    @Mapping(target = "imageUrl", source = "imageFileId")
    @Mapping(target = "albumId", expression = "java(song.getAlbum() != null ? song.getAlbum().getId() : null)")
    @Mapping(target = "albumTitle", expression = "java(song.getAlbum() != null ? song.getAlbum().getTitle() : null)")
    @Mapping(target = "albumArtist", expression = "java(song.getAlbum() != null ? song.getAlbum().getArtist() : null)")
    SongResponse toResponse(Song song);

    List<SongResponse> toResponseList(List<Song> songs);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "audioFileId", ignore = true)
    @Mapping(target = "imageFileId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "duration", ignore = true)
    @Mapping(target = "album", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(SongRequest request, @MappingTarget Song song);
} 