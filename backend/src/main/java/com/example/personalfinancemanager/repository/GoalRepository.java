package com.example.personalfinancemanager.repository;

import com.example.personalfinancemanager.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Integer> {

    List<Goal> findByUser_UserId(int userId);
}
