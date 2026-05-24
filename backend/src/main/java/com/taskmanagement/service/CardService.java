package com.taskmanagement.service;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CardWithListResponse;
import com.taskmanagement.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Transactional(readOnly = true)
    public List<CardResponse> getCardsByListId(Long listId) {
        return cardRepository.findByBoardListIdOrderByPositionAsc(listId).stream()
                .map(CardResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CardResponse getCardById(Long id) {
        return cardRepository.findById(id)
                .map(CardResponse::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "カードが見つかりません: " + id));
    }

    @Transactional(readOnly = true)
    public List<CardWithListResponse> searchCards(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return cardRepository.findAll().stream()
                    .map(CardWithListResponse::new)
                    .toList();
        }
        return cardRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword).stream()
                .map(CardWithListResponse::new)
                .toList();
    }
}
