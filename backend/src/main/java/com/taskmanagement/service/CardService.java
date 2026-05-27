package com.taskmanagement.service;

import com.taskmanagement.dto.CardRequest;
import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CardWithListResponse;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.entity.Card;
import com.taskmanagement.repository.BoardListRepository;
import com.taskmanagement.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final BoardListRepository boardListRepository;

    public CardService(CardRepository cardRepository, BoardListRepository boardListRepository) {
        this.cardRepository = cardRepository;
        this.boardListRepository = boardListRepository;
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

    @Transactional
    public CardResponse createCard(CardRequest request) {
        BoardList boardList = boardListRepository.findById(request.getListId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "リストが見つかりません: " + request.getListId()));

        List<Card> existing = cardRepository.findByBoardListIdOrderByPositionAsc(request.getListId());
        int nextPosition = existing.isEmpty() ? 1 : existing.get(existing.size() - 1).getPosition() + 1;

        Card card = new Card();
        card.setBoardList(boardList);
        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        card.setDueDate(request.getDueDate());
        card.setPosition(nextPosition);

        return new CardResponse(cardRepository.save(card));
    }
}
