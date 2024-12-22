package com.example.personalfinancemanager.repository;

import com.example.personalfinancemanager.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByUser_UserId(int userId);

    Category findByNameAndUser_UserId(String name, int userId);

}
