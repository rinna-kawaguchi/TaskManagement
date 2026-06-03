package com.taskmanagement.repository;

import com.taskmanagement.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByBoardListIdOrderByPositionAsc(Long listId);

    List<Card> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    @Modifying
    @Query("DELETE FROM Card c WHERE c.boardList.id = :listId")
    void deleteByBoardListId(@Param("listId") Long listId);
}
