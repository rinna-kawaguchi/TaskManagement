package com.taskmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CardReorderItem {

    @NotNull
    private Long id;

    @NotNull
    private Long listId;

    @NotNull
    @Min(1)
    private Integer position;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getListId() { return listId; }
    public void setListId(Long listId) { this.listId = listId; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
}
