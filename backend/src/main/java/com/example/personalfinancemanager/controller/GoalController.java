package com.example.personalfinancemanager.controller;

import com.example.personalfinancemanager.model.Goal;
import com.example.personalfinancemanager.model.User;
import com.example.personalfinancemanager.repository.GoalRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GoalController {

    private GoalRepository goalRepository;

    public GoalController(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @GetMapping("/goals")
    public ResponseEntity<List<Goal>> getGoalsByUserId(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Goal> goals = goalRepository.findByUser_UserId(userId);
        return ResponseEntity.ok(goals);
    }

    @PostMapping("/goals")
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUserId(userId);
        goal.setUser(user);

        Goal savedGoal = goalRepository.save(goal);
        return ResponseEntity.ok(savedGoal);
    }

    @PutMapping("/goals/{goalId}")
    public ResponseEntity<Goal> updateGoal(@PathVariable int goalId, @RequestBody Goal goal,
                                           HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Goal existingGoal = goalRepository.findById(goalId).orElse(null);
        if (existingGoal != null && existingGoal.getUser().getUserId() == userId) {
            existingGoal.setTargetAmount(goal.getTargetAmount());
            existingGoal.setSavedAmount(goal.getSavedAmount());
            existingGoal.setTargetDate(goal.getTargetDate());
            existingGoal.setName(goal.getName());
            Goal savedGoal = goalRepository.save(existingGoal);
            return ResponseEntity.ok(savedGoal);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/goals/{goalId}")
    public void deleteGoal(@PathVariable int goalId, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        Goal goal = goalRepository.findById(goalId).orElse(null);

        if (goal != null && goal.getUser().getUserId() == userId) {
            goalRepository.deleteById(goalId);
        }
    }

}
