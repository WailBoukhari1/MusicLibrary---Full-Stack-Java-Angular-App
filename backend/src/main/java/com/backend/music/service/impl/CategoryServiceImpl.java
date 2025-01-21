package com.backend.music.service.impl;

import com.backend.music.model.Category;
import com.backend.music.repository.CategoryRepository;
import com.backend.music.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
    
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(String id, Category categoryDetails) {
        Category existingCategory = getCategoryById(id);
        
        existingCategory.setName(categoryDetails.getName());
        existingCategory.setDescription(categoryDetails.getDescription());
        
        return categoryRepository.save(existingCategory);
    }
    
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
} 