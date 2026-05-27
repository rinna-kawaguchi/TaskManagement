# TaskManagement

## バックエンド起動

ローカル開発では `local` プロファイルを指定して起動する。

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 理由

シェル環境に別プロジェクト用の `DB_HOST` 環境変数が設定されている場合があるため、`application-local.yml`（固定値でDockerのPostgreSQLを指定）を使用する `local` プロファイルで起動する必要がある。

オプションなしで起動すると `DB_HOST` 環境変数の値が使われてしまい、意図しないDBに接続しようとして起動失敗する。

## Docker（PostgreSQL）起動

```bash
docker compose up -d db
```

バックエンド起動前にPostgreSQLコンテナが起動している必要がある。

## ドキュメント

機能追加・変更の際は `docs/requirements.md` を参照し、実装後に内容が古くなっていれば更新すること。

## Git運用ルール

CONTRIBUTING.md に従い、以下を必ず守ること。

- **mainブランチへの直接コミット・pushは禁止**
- 作業は必ず feature/fix/refactor ブランチを切って行う
- ブランチ名にはIssue番号を含める（例: `feature/#12-add-task-api`）
- 変更はPRを通じてmainにマージする
