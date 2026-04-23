---
  企画・設計専門エージェント向けプロンプト

  ---
  # Lumi — プロジェクト仕様書・設計現状レポート

  ## あなたへの依頼

  あなたはプロダクトの企画と設計を専門とするエージェントです。
  以下に記載する「Lumi」というアプリの**現在の仕様・技術設計・課題**を正確に把握した上で、
  このアプリをハッカソン作品から商業プロダクトへと進化させるための
  **仕様の再定義と設計の見直し**を行ってください。

  開発は2名体制（個人開発者 + 友人）で行い、収益化を目指します。


  ---

  ## 1. プロダクト概要

  **アプリ名:** Lumi（ルミ）
  **コンセプト:** 感情を持つペットコンパニオン付きの習慣トラッキングTodoアプリ。
  ユーザーのタスク完了行動に応じてペットの感情・信頼度・レベル・形態が変化するゲーミフィケーション機能を中核とする。

  **ターゲットユーザー（ハッカソン想定）:**
  - 夜型の生活をしているユーザー（深夜タイムブロックが存在することが示唆）
  - 習慣化に挫折しやすい人
  - ゲーミフィケーションに惹かれる人（特にINTP気質の論理的かつ知的好奇心が強い人 ← AIプロンプト内に明記あり）


  ---

  ## 2. 現在の技術スタック

  | 項目 | 内容 |
  |------|------|
  | Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 |
  | State管理 | Jotai（非同期atom中心） |
  | UI | Tailwind CSS 4 + shadcn/ui (New York style) + Motion（Framer Motion互換） |
  | DB | Supabase（PostgreSQL）※ anon key による公開アクセス（認証なし） |
  | AI | Google Generative AI (Gemini) ※ `gemini-3-flash-preview` と `gemini-2.0-flash` が混在 |
  | デプロイ | 未定（Vercel想定） |


  ---

  ## 3. 現在の画面構成

  ### `/` — ウェルカムページ
  - 現状は `<div>Welcom to Lumi !!</div>` のみ。実質未実装。

  ### `/dashboard` — メイン画面（2カラムレイアウト）
  - **左カラム（lg以上のみ表示）:** ペット表示エリア（PetView） + AI分析相談室（LumiConsultation）
  - **右カラム:** 習慣一覧（HabitCardList）
  - ※ モバイル対応：左カラムが `hidden lg:block` のため、**モバイルではペットが一切表示されない**（重大な未対応）

  ### `/register-habit` — 習慣登録フォーム
  - タイトル・タイムブロック・目標日数を入力して習慣を登録


  ---

  ## 4. データモデル（Supabase）

  ### `habits` テーブル
  ```typescript
  {
    id: string           // UUID
    title: string        // 習慣名
    timeBlock: 'morning' | 'daytime' | 'night' | 'midnight' | 'undefined'
    targetDays: string   // 目標日数（数値の文字列）
    streakDays: number   // 連続達成日数
    isCompleted: boolean // 当日の完了フラグ
    completedAt?: string // 完了日時（ISO文字列）
    createdAt?: string
    updatedAt?: string
  }

  pet テーブル

  {
    id: string           // UUID
    level: number        // レベル（int8）
    emotion: number      // 感情値（累計）
    trust: number        // 信頼度（0〜100）
    exhaustion: number   // 疲労度（0〜100）
    expression: 'happy' | 'sad' | 'angry' | 'neutral'
    updatedAt: string
  }
  ※ 現在は1レコード固定（認証なしのMVP）。全ユーザーが同一ペットを共有している。

  pet_comment テーブル

  {
    pet_id: string
    message: string
    expression: string
    created_at: timestamp
  }

  lumi_consultation_history テーブル

  {
    pet_id: string
    role: 'lumi_analysis' | 'lumi_chat'
    content: string
    suggestions: string[] // 配列（lumi_analysisのみ）
    created_at: timestamp
  }

  ---
  5. コアゲームロジック

  タイムブロック制（app/lib/petCalculations.ts）

  習慣をタイムブロックに割り当て、そのブロック時間が終了した時点でポイントを計算する。

  ┌──────────┬──────────┬──────────────────┐
  │ ブロック │  時間帯  │ 最大推奨タスク数 │
  ├──────────┼──────────┼──────────────────┤
  │ morning  │ 5〜11時  │ 3                │
  ├──────────┼──────────┼──────────────────┤
  │ daytime  │ 11〜18時 │ 5                │
  ├──────────┼──────────┼──────────────────┤
  │ night    │ 18〜24時 │ 5                │
  ├──────────┼──────────┼──────────────────┤
  │ midnight │ 0〜5時   │ 2                │
  └──────────┴──────────┴──────────────────┘

  信頼度（Trust Point / tp）計算

  - ブロック内の達成数が少ないとマイナス（例：morningで1件以下 → -2tp）
  - 達成数が多いほど高得点

  疲労度（Exhaustion Point / ep）計算

  - 推奨上限を超えると加算される
  - ブロック時間が過ぎていなくても、上限超過時は即座にepを反映

  ペットステータス更新フロー

  習慣完了チェック
  → timeBlock × 達成数 から tp/ep の差分を計算
  → updatePetStatsAtom に trustDelta, exhaustDelta を渡す
  → trust + trustDelta, exhaustion + exhaustDelta を更新
  → trust >= 100 でレベルアップ（trust=50, exhaustion=0 にリセット）
  → exhaustion >= 100 でレベルダウン（trust=0, exhaustion=50 にリセット）
  → calculateExpression() でexpressionを再計算
  → PUT /api/pet → Supabase に保存

  感情（Expression）の判定ロジック

  if (trust >= 65 && exhaustion <= 30)  → 'happy'
  if (trust <= 50 && exhaustion <= 50)  → 'sad'
  if (trust <= 30 && exhaustion <= 65)  → 'angry'
  else                                   → 'neutral'
  ※ 条件が重複・欠落している箇所あり（例: trust=60, exhaustion=40 は neutral になるが、設計意図が不明瞭）

  ペット形態変化

  - Level 1〜14：Lumi（デフォルト形態）
  - Level 15以上：フクロウ形態（進化エフェクトあり）
  - 夜型ユーザー向けの特化ルートとして設計されている

  ---
  6. AI機能

  ペットセリフ生成（/api/comment POST）

  - Gemini に対してペットのキャラクター（Lumi）として1〜2文の日本語コメントを生成させる
  - expression・level・今日の達成数・trigger（task_completed等）を入力として使用
  - 現在はデバッグ用に無効化されている（return; で即終了）
  - 生成したコメントはSupabaseの pet_comment テーブルに保存

  ライフパターン分析（/api/ai_chat POST, mode: "analyze"）

  - タイムブロック別の完了数を集計してGeminiに送信
  - 分析結果（analysis）+ 習慣提案（suggestions配列）+ パターン分類（patternType）をJSON形式で返す
  - 結果は lumi_consultation_history テーブルに保存・再利用可能

  Lumiとのチャット（/api/ai_chat POST, mode: "chat"）

  - 分析結果をコンテキストとして渡し、ユーザーとの対話を実現
  - 履歴もDBに保存

  新習慣提案（/api/suggestion POST）

  - 完了履歴 + アクティビティログ + レベルを元に提案を生成
  - gemini-2.0-flash を使用（他のAPIは gemini-3-flash-preview）
  - ※このエンドポイントはUIから呼ばれている箇所が現状見当たらない（未接続の可能性）

  ---
  7. 現在の主要な技術的問題・未実装事項

  1. 認証が存在しない — Supabase anon
  keyで公開アクセス。全ユーザーが同一のpetレコードとデータを共有している。商業化には認証（Supabase Auth or
  NextAuth）が必須。
  2. モバイル非対応 — ペット表示が hidden lg:block でPCのみ。モバイルユーザーにはコアUXが届かない。
  3. ウェルカムページ未実装 — / は素の div のみ。オンボーディングなし。
  4. ペットのセリフ機能が無効化されている — fetchComment 関数の冒頭に return;
  が入っており、全コメント生成が停止している。
  5. isCompleted がリセットされない —
  習慣の完了状態が翌日0時にリセットされるロジックが存在しない（DBレベルでもフロントレベルでも未実装）。
  6. /api/suggestion がUIと未接続 — エンドポイントは存在するがどのコンポーネントからも呼ばれていない。
  7. Geminiモデル名の不統一 — gemini-3-flash-preview（存在しない可能性）と gemini-2.0-flash が混在。
  8. 感情判定ロジックに欠陥 — calculateExpression() の条件が排他的でなく、trust=45, exhaustion=60
  などのケースで意図しない neutral になる。
  9. petAtom は全ユーザー共通の1件を取得 — 認証実装後は user_id での絞り込みが必要。
  10. testTimeAtom が本番コードに混入 — 開発用の時刻上書き機能が本番に残っている。

  ---
  8. 現在のUI/UXデザイン方針

  - カラーパレット: Tokyo Night テーマ（#1a1b26 背景、#7aa2f7 アクセントブルー、#bb9af7 パープル）
  - 雰囲気: ダーク・深夜・ゲーム的・内省的
  - アニメーション: Motion（Framer
  Motion互換）を多用。ペットのジャンプ、進化エフェクト、ステータスバーのアニメーションなど。
  - 主要コンポーネント:
    - PetSvg — デフォルト形態のSVGペット（4種のexpression）
    - OwlSvg — フクロウ形態のSVGペット（4種のexpression）
    - HabitItem — チェック・削除・継続日数表示付きの習慣カード
    - HabitGroup — タイムブロック別の習慣グループ
    - LumiConsultation — AI分析相談室（分析 + チャット）
    - PetEmotionStatus — 信頼度・疲労度・感情値のステータスバー

  ---
  9. 収益化に向けて再設計が必要な領域（あなたへの設問）

  以上の現状を踏まえて、以下の観点から企画・設計の提言を行ってください：

  A. ユーザーアカウント・認証設計

  - 認証基盤の選定と、「ユーザーごとのペット + 習慣データ」の設計

  B. コア体験の再定義

  - ハッカソン向けに実装された現在のゲームロジック（tp/ep/タイムブロック制）の商業的妥当性
  - ユーザーが離脱しやすいポイントと、継続率を高めるための改善案
  - モバイルファーストへの再設計方針

  C. ペットシステムの拡張性

  - 現在2形態のみ（Lumi/フクロウ）。コレクション要素・カスタマイズ要素など、マネタイズにつながる拡張案

  D. AI機能の位置づけ

  - 現在の3つのAI機能（セリフ生成・ライフパターン分析・チャット）の中で、コアUXにすべきものと、プレミアム機能にすべきも
  のの仕分け

  E. 収益モデルの提案

  - フリーミアム / サブスクリプション / 買い切り など、このアプリのユーザー特性に合った収益モデル

  F. オンボーディング設計

  - ウェルカムページ〜初回ペット名付け〜最初の習慣登録 までのフロー設計

  G. 優先度付きロードマップ

  - 2名体制を考慮した、MVP商業版リリースに向けた実装優先度の提案

  ---