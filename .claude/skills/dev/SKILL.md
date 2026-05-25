---
name: dev
description: TaskManagementアプリの起動手順を案内する。「起動」「run」「dev」「サーバー」などと言われたら使う。
disable-model-invocation: false
---

## TaskManagement 起動手順

以下の順番でサービスを起動してください。

### 1. PostgreSQL（Docker）を起動

```bash
docker compose up -d db
```

### 2. バックエンド（Spring Boot）を起動

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

> **注意:** `local` プロファイルを必ず指定すること。省略すると環境変数 `DB_HOST` が使われ、意図しないDBに接続して起動失敗する。

バックエンドは `http://localhost:8080` で起動します。

### 3. フロントエンド（React + Vite）を起動

別のターミナルで実行します。Node.js v22 が必要です。

```bash
# nvmでNode.jsのバージョンを切り替える
nvm use 22

cd frontend
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

### 動作確認

| URL | 確認内容 |
|---|---|
| http://localhost:8080/api/lists | バックエンドAPI（リスト一覧） |
| http://localhost:5173 | フロントエンド（Kanbanボード） |
