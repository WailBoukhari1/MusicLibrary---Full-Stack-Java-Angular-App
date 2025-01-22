package com.backend.music.service.impl;

import com.backend.music.dto.request.CategoryRequest;
import com.backend.music.dto.response.CategoryResponse;
import com.backend.music.exception.ResourceNotFoundException;
import com.backend.music.mapper.CategoryMapper;
import com.backend.music.model.Category;
import com.backend.music.repository.CategoryRepository;
import com.backend.music.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    
    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(categoryMapper::toResponseDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public CategoryResponse getCategoryById(String id) {
        return categoryRepository.findById(id)
            .map(categoryMapper::toResponseDto)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
    
    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        return categoryMapper.toResponseDto(categoryRepository.save(category));
    }
    
    @Override
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        return categoryRepository.findById(id)
            .map(category -> {
                categoryMapper.updateEntityFromDto(request, category);
                return categoryMapper.toResponseDto(categoryRepository.save(category));
            })
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
    
    @Override
    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
} 