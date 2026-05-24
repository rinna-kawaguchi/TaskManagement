package com.taskmanagement.dto;

import com.taskmanagement.entity.Card;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CardResponse {

    private Long id;
    private Long listId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CardResponse(Card card) {
        this.id = card.getId();
        this.listId = card.getBoardList().getId();
        this.title = card.getTitle();
        this.description = card.getDescription();
        this.dueDate = card.getDueDate();
        this.position = card.getPosition();
        this.createdAt = card.getCreatedAt();
        this.updatedAt = card.getUpdatedAt();
    }

    public Long getId() { return id; }
    public Long getListId() { return listId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDate getDueDate() { return dueDate; }
    public Integer getPosition() { return position; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
