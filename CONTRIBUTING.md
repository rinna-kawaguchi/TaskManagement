# コントリビューションガイド

## ブランチ命名規則

Issue対応時は必ずブランチ名にIssue番号を含めてください。

| 種別 | パターン | 例 |
|------|----------|-----|
| 新機能 | `feature/#{番号}-{概要}` | `feature/#12-add-task-api` |
| バグ修正 | `fix/#{番号}-{概要}` | `fix/#34-fix-login-bug` |
| リファクタ | `refactor/#{番号}-{概要}` | `refactor/#56-cleanup-service` |

## 開発フロー

1. 対応するIssueを作成または確認する（既存Issueがある場合はそれを使う）
2. 上記の命名規則でブランチを作成する（Issueがない軽微な変更はIssue番号なしでも可）
3. PRを作成し、Issueがある場合は本文に `Closes #<Issue番号>` を記載する
4. mainブランチへの直接pushは禁止（Branch Protection Ruleで強制）
5. PRがマージされると、紐づいたIssueが自動でクローズされる

## Issue自動クローズ

PRの説明文に以下のキーワードを含めると、マージ時にIssueが自動クローズされます。

```
Closes #<Issue番号>
```

例：`Closes #12`
