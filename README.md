# TaskManagement

Raise TechのAIエンジニアリングコースの課題として作成する、Trello風タスク管理Webアプリです。

## 技術スタック

| レイヤー | 技術 | バージョン |
|----------|------|------------|
| フロントエンド | React + TypeScript | React 19 / TypeScript 6 |
| ビルドツール | Vite | 8.x |
| バックエンド | Spring Boot (Java) | Spring Boot 4.0 / Java 25 |
| データベース | PostgreSQL | 16 |
| ORM | Spring Data JPA (Hibernate) | Spring Boot 4.0 同梱 |

## 必要な環境

- Java 25
- Docker / Docker Compose
- Node.js（フロントエンド開発時）

## セットアップ・起動手順

### 1. データベース起動

```bash
docker compose up -d db
```

### 2. バックエンド起動

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

> **注意:** `local` プロファイルの指定が必須です。シェル環境に別プロジェクト用の `DB_HOST` が設定されている場合、オプションなしで起動すると意図しないDBに接続してしまいます。

バックエンドは http://localhost:8080 で起動します。

### 3. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

## 開発ガイド

ブランチ命名規則・開発フローは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ドキュメント

- [要件定義書](docs/requirements.md)
- [ユースケース](docs/usecases.md)
- [画面設計](docs/screen-design.md)
- [データモデル・ER図](docs/data-model.md)
