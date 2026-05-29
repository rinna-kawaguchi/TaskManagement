package com.taskmanagement.controller;

import com.taskmanagement.dto.CardReorderRequest;
import com.taskmanagement.dto.CardRequest;
import com.taskmanagement.dto.CardUpdateRequest;
import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CardWithListResponse;
import com.taskmanagement.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponse> getCardById(@PathVariable Long id) {
        return ResponseEntity.ok(cardService.getCardById(id));
    }

    @GetMapping
    public ResponseEntity<List<CardWithListResponse>> searchCards(
            @RequestParam(required = false, defaultValue = "") String keyword) {
        return ResponseEntity.ok(cardService.searchCards(keyword));
    }

    @PostMapping
    public ResponseEntity<CardResponse> createCard(@Valid @RequestBody CardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.createCard(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable Long id,
            @Valid @RequestBody CardUpdateRequest request) {
        return ResponseEntity.ok(cardService.updateCard(id, request));
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderCards(@Valid @RequestBody CardReorderRequest request) {
        cardService.reorderCards(request);
        return ResponseEntity.noContent().build();
    }
}
