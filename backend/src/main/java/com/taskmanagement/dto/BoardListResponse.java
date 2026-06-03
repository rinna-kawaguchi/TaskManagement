package com.taskmanagement.dto;

import com.taskmanagement.entity.BoardList;
import java.time.LocalDateTime;

public class BoardListResponse {

    private Long id;
    private String title;
    private Integer position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BoardListResponse(BoardList boardList) {
        this.id = boardList.getId();
        this.title = boardList.getTitle();
        this.position = boardList.getPosition();
        this.createdAt = boardList.getCreatedAt();
        this.updatedAt = boardList.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getPosition() {
        return position;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
