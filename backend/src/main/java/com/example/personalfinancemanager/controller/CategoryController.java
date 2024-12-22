package com.example.personalfinancemanager.controller;

import com.example.personalfinancemanager.model.Category;
import com.example.personalfinancemanager.model.User;
import com.example.personalfinancemanager.repository.CategoryRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getUserCategories(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Category> categories = categoryRepository.findByUser_UserId(userId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{categoryName}")
    public ResponseEntity<Category> getCategory(@PathVariable String categoryName, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Category category = categoryRepository.findByNameAndUser_UserId(categoryName, userId);
        return ResponseEntity.ok(category);
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }


        User user = new User();
        user.setUserId(userId);
        category.setUser(user);

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }
}
