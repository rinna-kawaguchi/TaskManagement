package com.taskmanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ListReorderRequest {

    @NotEmpty
    private List<ReorderItem> items;

    public List<ReorderItem> getItems() {
        return items;
    }

    public void setItems(List<ReorderItem> items) {
        this.items = items;
    }
}
