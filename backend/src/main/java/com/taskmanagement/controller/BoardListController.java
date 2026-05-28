package com.taskmanagement.controller;

import com.taskmanagement.dto.BoardListRequest;
import com.taskmanagement.dto.BoardListResponse;
import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.service.BoardListService;
import com.taskmanagement.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class BoardListController {

    private final BoardListService boardListService;
    private final CardService cardService;

    public BoardListController(BoardListService boardListService, CardService cardService) {
        this.boardListService = boardListService;
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<BoardListResponse>> getAllLists() {
        return ResponseEntity.ok(boardListService.getAllLists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardListResponse> getListById(@PathVariable Long id) {
        return ResponseEntity.ok(boardListService.getListById(id));
    }

    @GetMapping("/{id}/cards")
    public ResponseEntity<List<CardResponse>> getCardsByListId(@PathVariable Long id) {
        return ResponseEntity.ok(cardService.getCardsByListId(id));
    }

    @PostMapping
    public ResponseEntity<BoardListResponse> createList(@Valid @RequestBody BoardListRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardListService.createList(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardListResponse> updateList(
            @PathVariable Long id,
            @Valid @RequestBody BoardListRequest request) {
        return ResponseEntity.ok(boardListService.updateList(id, request));
    }
}
