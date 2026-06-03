---
name: quality-check
description: TaskManagementアプリの品質チェックを実行する。「品質チェック」「lintチェック」「checkstyle」「コード品質」などと言われたら使う。
disable-model-invocation: false
---

# TaskManagement 品質チェック手順

以下の4項目をすべて実行し、結果をまとめて報告してください。

---

## 1. フロントエンド ESLint

Node.js 22 で実行します（ESLint 10 は Node 20+ が必要）。

```bash
cd frontend
source ~/.nvm/nvm.sh && nvm use 22
npx eslint . --format json
```

JSON 出力をパースして、ファイル名・行番号・ルールID・メッセージの一覧を表示してください。
問題がなければ「ESLint: 問題なし」と報告してください。

---

## 2. バックエンド Checkstyle（Google Java Style）

```bash
cd backend
./gradlew checkstyleMain
```

出力から `[WARN]` / `[ERROR]` 行を抽出し、ルール名ごとに件数をまとめて報告してください。
以下は **既知・対応不要** の警告です。報告から除外してください:
- `MagicNumber`（DataInitializer.java の日付リテラル）

---

## 3. デファクトスタンダード確認

以下の観点でコードを調査し、外れているものがあれば指摘してください。

| 観点 | チェック内容 |
|---|---|
| `application.yml` | `ddl-auto` が `create` になっていないか |
| CORS 設定 | 必要なメソッドが許可されているか |
| Entity | 推奨ライブラリ（Lombok等）の観点で改善余地があるか |
| Node.js バージョン | `.nvmrc` が存在し ESLint と互換性があるか |
| Checkstyle 設定 | `build.gradle.kts` に設定されているか |

---

## 4. ドキュメントと実装の差異確認

`docs/` フォルダ内の以下のファイルと実装を照合し、差異を報告してください。

- `docs/requirements.md` — 機能要件の記載漏れ・齟齬
- `docs/usecases.md` — 実装済みユースケースの記載漏れ
- `docs/screen-design.md` — 実際のUIと異なる画面設計の記載
- `docs/data-model.md` — Entity と ER 図の差異

**照合対象コード:**
- バックエンド: `backend/src/main/java/com/taskmanagement/`
- フロントエンド: `frontend/src/`

---

## 報告フォーマット

各項目を以下の形式でまとめてください。

```
### 1. ESLint
- ✅ 問題なし  または
- ⚠️ N件の問題
  - ファイル名:行番号 [ルールID] メッセージ

### 2. Checkstyle
- ✅ 問題なし（既知除く）  または
- ⚠️ N件の問題（MagicNumber除く）
  - RuleName: N件

### 3. デファクトスタンダード
- ✅ 問題なし  または
- ⚠️ 指摘事項
  - 項目名: 問題の内容と推奨対応

### 4. ドキュメントと実装の差異
- ✅ 差異なし  または
- ⚠️ 差異あり
  - ファイル名: 差異の内容
```
