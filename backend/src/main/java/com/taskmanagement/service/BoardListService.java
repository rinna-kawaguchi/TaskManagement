package com.taskmanagement.service;

import com.taskmanagement.dto.BoardListRequest;
import com.taskmanagement.dto.BoardListResponse;
import com.taskmanagement.dto.ListReorderRequest;
import com.taskmanagement.dto.ReorderItem;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.repository.BoardListRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class BoardListService {

    private final BoardListRepository boardListRepository;

    public BoardListService(BoardListRepository boardListRepository) {
        this.boardListRepository = boardListRepository;
    }

    @Transactional(readOnly = true)
    public List<BoardListResponse> getAllLists() {
        return boardListRepository.findAllByOrderByPositionAsc().stream()
                .map(BoardListResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public BoardListResponse getListById(Long id) {
        return boardListRepository.findById(id)
                .map(BoardListResponse::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "リストが見つかりません: " + id));
    }

    @Transactional
    public BoardListResponse createList(BoardListRequest request) {
        List<BoardList> existing = boardListRepository.findAllByOrderByPositionAsc();
        int nextPosition = existing.isEmpty() ? 1 : existing.get(existing.size() - 1).getPosition() + 1;

        BoardList boardList = new BoardList();
        boardList.setTitle(request.getTitle());
        boardList.setPosition(nextPosition);

        return new BoardListResponse(boardListRepository.save(boardList));
    }

    @Transactional
    public BoardListResponse updateList(Long id, BoardListRequest request) {
        BoardList boardList = boardListRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "リストが見つかりません: " + id));
        boardList.setTitle(request.getTitle());
        return new BoardListResponse(boardListRepository.save(boardList));
    }

    @Transactional
    public void reorderLists(ListReorderRequest request) {
        for (ReorderItem item : request.getItems()) {
            BoardList boardList = boardListRepository.findById(item.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "リストが見つかりません: " + item.getId()));
            boardList.setPosition(item.getPosition());
            boardListRepository.save(boardList);
        }
    }
}
