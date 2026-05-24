package com.taskmanagement.component;

import com.taskmanagement.entity.BoardList;
import com.taskmanagement.entity.Card;
import com.taskmanagement.repository.BoardListRepository;
import com.taskmanagement.repository.CardRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BoardListRepository boardListRepository;
    private final CardRepository cardRepository;

    public DataInitializer(BoardListRepository boardListRepository, CardRepository cardRepository) {
        this.boardListRepository = boardListRepository;
        this.cardRepository = cardRepository;
    }

    @Override
    public void run(String... args) {
        if (boardListRepository.count() > 0) {
            return;
        }

        BoardList todo = new BoardList();
        todo.setTitle("Todo");
        todo.setPosition(1);

        BoardList inProgress = new BoardList();
        inProgress.setTitle("In Progress");
        inProgress.setPosition(2);

        BoardList done = new BoardList();
        done.setTitle("Done");
        done.setPosition(3);

        boardListRepository.saveAll(List.of(todo, inProgress, done));

        Card card1 = new Card();
        card1.setBoardList(todo);
        card1.setTitle("プロジェクト構成のセットアップ");
        card1.setDescription("GradleとPostgreSQLを使ったSpring Bootプロジェクトの初期構成を行う");
        card1.setDueDate(LocalDate.of(2026, 5, 25));
        card1.setPosition(1);

        Card card2 = new Card();
        card2.setBoardList(todo);
        card2.setTitle("API仕様書の作成");
        card2.setDescription("OpenAPI仕様書を使って全てのRESTエンドポイントをドキュメント化する");
        card2.setDueDate(LocalDate.of(2026, 6, 1));
        card2.setPosition(2);

        Card card3 = new Card();
        card3.setBoardList(todo);
        card3.setTitle("認証機能の実装");
        card3.setDescription("JWTを使ったログインとトークンリフレッシュのエンドポイントを追加する");
        card3.setDueDate(LocalDate.of(2026, 6, 10));
        card3.setPosition(3);

        Card card4 = new Card();
        card4.setBoardList(inProgress);
        card4.setTitle("データベーススキーマの設計");
        card4.setDescription("ER図を作成してテーブル定義を確定させる");
        card4.setDueDate(LocalDate.of(2026, 5, 20));
        card4.setPosition(1);

        Card card5 = new Card();
        card5.setBoardList(inProgress);
        card5.setTitle("カードのCRUDエンドポイント構築");
        card5.setDescription("カード管理のPOST・PUT・DELETE操作を実装する");
        card5.setDueDate(LocalDate.of(2026, 5, 30));
        card5.setPosition(2);

        Card card6 = new Card();
        card6.setBoardList(done);
        card6.setTitle("ステージング環境へのデプロイ");
        card6.setDescription("Dockerを設定してバックエンドをステージングサーバーにデプロイする");
        card6.setDueDate(LocalDate.of(2026, 5, 15));
        card6.setPosition(1);

        Card card7 = new Card();
        card7.setBoardList(done);
        card7.setTitle("ユニットテストの作成");
        card7.setDescription("サービス層とリポジトリクエリのJUnitテストを追加する");
        card7.setDueDate(LocalDate.of(2026, 5, 10));
        card7.setPosition(2);

        cardRepository.saveAll(List.of(card1, card2, card3, card4, card5, card6, card7));
    }
}
