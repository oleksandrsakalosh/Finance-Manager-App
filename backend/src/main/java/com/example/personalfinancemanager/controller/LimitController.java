package com.example.personalfinancemanager.controller;

import com.example.personalfinancemanager.model.Limit;
import com.example.personalfinancemanager.model.User;
import com.example.personalfinancemanager.repository.LimitRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LimitController {

    private LimitRepository limitRepository;

    public LimitController(LimitRepository limitRepository) {
        this.limitRepository = limitRepository;
    }

    @GetMapping("/limits")
    public ResponseEntity<List<Limit>> getLimitsByUserId(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Limit> limits = limitRepository.findByUser_UserId(userId);
        return ResponseEntity.ok(limits);
    }

    @PostMapping("/limits")
    public ResponseEntity<Limit> createLimit(@RequestBody Limit limit, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUserId(userId);
        limit.setUser(user);

        Limit savedLimit = limitRepository.save(limit);
        return ResponseEntity.ok(savedLimit);
    }

    @PutMapping("/limits/{limitId}")
    public ResponseEntity<Limit> updateLimit(@PathVariable int limitId, @RequestBody Limit limit, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Limit existingLimit = limitRepository.findById(limitId).orElse(null);
        if (existingLimit != null && existingLimit.getUser().getUserId() == userId) {
            existingLimit.setAmount(limit.getAmount());
            existingLimit.setCategory(limit.getCategory());
            Limit savedLimit = limitRepository.save(existingLimit);
            return ResponseEntity.ok(savedLimit);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/limits/{limitId}")
    public void deleteLimit(@PathVariable int limitId, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return;
        }

        Limit limit = limitRepository.findById(limitId).orElse(null);
        if (limit == null || limit.getUser().getUserId() != userId ){
            return;
        }

        limitRepository.deleteById(limitId);
    }
}
