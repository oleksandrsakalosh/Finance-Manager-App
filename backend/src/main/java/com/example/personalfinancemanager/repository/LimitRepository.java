package com.example.personalfinancemanager.repository;

import com.example.personalfinancemanager.model.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LimitRepository extends JpaRepository<Limit, Integer> {
    List<Limit> findByUser_UserId(int userId);
}
