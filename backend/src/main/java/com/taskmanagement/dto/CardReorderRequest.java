package com.taskmanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CardReorderRequest {

    @NotEmpty
    private List<CardReorderItem> cards;

    public List<CardReorderItem> getCards() { return cards; }
    public void setCards(List<CardReorderItem> cards) { this.cards = cards; }
}
