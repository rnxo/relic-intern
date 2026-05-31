# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lumi** — 感情を持つペットコンパニオン付きの習慣トラッキングTodoアプリ。ユーザーのタスク完了パターンに応じてペットの感情・信頼度・形態が変化するゲーミフィケーション機能を持つ。

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **State:** Jotai（`app/store/`配下のatoms）
- **UI:** Tailwind CSS 4 + shadcn/ui (New York style) + Motion (アニメーション)
- **DB:** Supabase（`habits`, `pet`, `pet_comment`テーブル）
- **AI:** Google Generative AI (Gemini) — ペットのコメント生成

## Commands

```bash
npm run dev      # 開発サーバー起動 (localhost:3000)
npm run build    # プロダクションビルド
npm start        # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## Architecture

### ルーティング
- `/` — ウェルカムページ
- `/dashboard` — メイン画面（ペット表示 + 習慣リスト）
- `/register-habit` — 習慣登録フォーム


## Implementation Documentation Rules

実装終了時は必ず以下の内容を記述したテキストを私に伝えること

**記載内容:**
- 変更を加えたファイル名
- 新規作成したファイル名
- 新規変数の説明
- 既存ファイルへの追加コード
- ファイルごとに追記したコードが何をしているかの説明


## Color Conventions

globals.cssに定義されたLumi CSS変数クラスを使用すること。

**使用例:**
- 背景色: `bg-lumi-base`, `bg-lumi-surface`, `bg-lumi-sidebar`
- テキスト色: `text-lumi-fg`, `text-lumi-muted`, `text-lumi-primary`
- ボーダー: `border-lumi-border`, `border-lumi-border/30`
- アクセント: `bg-lumi-primary`, `text-lumi-secondary`

**新規色を追加する場合:**
- 実装ドキュメントMDファイルの冒頭に `## ⚠️ NEW COLOR ADDED` セクションを設け、追加した色の変数名・値・用途を明記すること
ハードコードされた色（`#1a1b26` など）は使用禁止。

## Key Conventions

- パスエイリアス: `@/*` → プロジェクトルート
- ページコンポーネントは `_components/` サブディレクトリに配置
- shadcn/uiコンポーネントは `components/ui/`
- 認証なし（Supabase anon keyでの公開アクセス、MVP段階）
- 環境変数: `.env.local` に `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`
