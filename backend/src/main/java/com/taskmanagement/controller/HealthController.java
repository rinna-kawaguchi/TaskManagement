package com.taskmanagement.controller;

import com.taskmanagement.repository.BoardListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final BoardListRepository boardListRepository;

    public HealthController(BoardListRepository boardListRepository) {
        this.boardListRepository = boardListRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        long listCount = boardListRepository.count();
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "db", "connected",
            "listCount", listCount
        ));
    }
}
