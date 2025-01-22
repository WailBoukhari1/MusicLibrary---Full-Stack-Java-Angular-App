package com.backend.music.mapper;

import com.backend.music.dto.request.CategoryRequest;
import com.backend.music.dto.response.CategoryResponse;
import com.backend.music.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {
    
    CategoryResponse toResponseDto(Category category);
    
    Category toEntity(CategoryRequest request);
    
    void updateEntityFromDto(CategoryRequest request, @MappingTarget Category category);
} 