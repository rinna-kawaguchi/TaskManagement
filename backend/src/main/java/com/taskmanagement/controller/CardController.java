package com.taskmanagement.controller;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CardWithListResponse;
import com.taskmanagement.service.CardService;
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
}
