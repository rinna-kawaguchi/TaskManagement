package com.taskmanagement.repository;

import com.taskmanagement.entity.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardListRepository extends JpaRepository<BoardList, Long> {
    List<BoardList> findAllByOrderByPositionAsc();
}
