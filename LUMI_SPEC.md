# Lumi — アプリケーション仕様書（AI向けプロンプト）

あなたは「Lumi」というWebアプリケーションのコードベースを扱います。以下の仕様を理解した上で、開発・修正・レビューを行ってください。

---

## 1. プロジェクト概要

**Lumi**は、感情を持つバーチャルペットコンパニオン付きの習慣トラッキングアプリです。

- ユーザーは日々の習慣（タスク）を登録し、タイムブロック（朝・昼・夜・深夜）ごとに管理する
- 習慣の達成パターンに応じて、ペット「Lumi」の**信頼度(trust)**・**疲労度(exhaustion)**・**感情(expression)**が変化する
- ペットはレベルアップ/ダウンし、レベル15以上で**フクロウ形態**に進化する
- Gemini AIによるペットの台詞生成と、習慣パターンの分析・提案機能を搭載

---

## 2. 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 + TypeScript 5 |
| 状態管理 | Jotai（アトミックステート） |
| スタイリング | Tailwind CSS 4 + shadcn/ui (New York style) |
| アニメーション | Motion (`motion/react`) — ※PetSvg.tsx/OwlSvg.tsxは`framer-motion`を使用中（`motion/react`に統一予定） |
| DB | Supabase (PostgreSQL) |
| AI | Google Generative AI (Gemini) |
| アイコン | Lucide React |
| パスエイリアス | `@/*` → プロジェクトルート |

---

## 3. ディレクトリ構成

```
app/
├── layout.tsx                          # ルートレイアウト（Jotai Provider）
├── page.tsx                            # ウェルカムページ (/)
├── globals.css                         # グローバルスタイル
├── (routes)/
│   ├── dashboard/
│   │   ├── page.tsx                    # メインダッシュボード（2カラム）
│   │   └── _components/
│   │       ├── PetView.tsx             # ペット表示・ステータス・コメント
│   │       ├── PetSvg.tsx              # Lumi SVGアバター（4表情）
│   │       ├── OwlSvg.tsx              # フクロウSVGアバター（進化形態）
│   │       ├── HabitCardList.tsx        # 習慣リストコンテナ
│   │       ├── HabitGroup.tsx           # タイムブロック別グループ
│   │       ├── HabitItem.tsx            # 個別の習慣カード
│   │       ├── LumiConsultation.tsx     # AI分析・チャットモーダル
│   │       ├── RegisterHabitDialog.tsx  # 習慣編集ダイアログ
│   │       └── TestTimeForm.tsx         # デバッグ用時刻操作
│   └── register-habit/
│       ├── page.tsx                     # 習慣登録フォーム
│       └── _components/HabitForm.tsx    # スタブ実装（未完成）
├── api/
│   ├── habit/route.ts                  # GET(全件取得) / POST(作成)
│   ├── habit/[id]/route.ts             # GET(デバッグ用) / PUT(更新) / DELETE(削除)
│   ├── pet/route.ts                    # GET(取得) / PUT(更新)
│   ├── comment/route.ts               # POST(AI台詞生成) / GET(最新取得)
│   ├── ai_chat/route.ts               # POST(分析/チャット) / GET(履歴)
│   └── suggestion/route.ts            # POST(AI提案)
├── store/
│   ├── habitAtom.ts                    # 習慣CRUD + 完了ロジック
│   ├── petAtom.ts                      # ペット取得・リフレッシュ
│   ├── emotionAtom.ts                  # 日次ステータス算出
│   └── testTimeAtom.ts                 # デバッグ用テスト時刻
├── hooks/
│   ├── habitHooks.ts                   # useHabits()
│   ├── petHooks.ts                     # usePet()
│   └── useDailyStats.ts               # useDailyStats()
├── lib/
│   ├── petCalculations.ts              # タイムブロック計算・ポイント算出 (PetGrowthStatus型, getTimeBlockByHour()含む)
│   └── supabase/client.ts              # Supabaseクライアント
└── types/
    ├── habit.ts                        # Habit型
    ├── pet.ts                          # Pet型 + PetForm型 + getPetForm()
    ├── petComment.ts                   # PetComment型 + NewPetComment型
    └── user.ts                         # User型（将来用）

components/
├── SideBar.tsx                         # 固定左サイドバー(80px)
└── ui/                                 # shadcn/uiコンポーネント群
    ├── button.tsx, card.tsx, dialog.tsx, input.tsx
    ├── label.tsx, select.tsx, field.tsx, separator.tsx, slider.tsx
```

---

## 4. データモデル

### Habit（習慣）
```typescript
type Habit = {
  id: string;              // UUID
  title: string;           // 習慣名
  timeBlock: 'morning' | 'daytime' | 'night' | 'midnight' | 'undefined';
  targetDays: string;      // 目標日数 ("7" | "14" | "21" | "30")
  streakDays: number;      // 連続達成日数
  isCompleted: boolean;    // 本日の完了フラグ
  completedAt?: string;    // 完了タイムスタンプ (ISO)
  createdAt?: string;
  updatedAt?: string;
};
```

### Pet（ペット）
```typescript
type Pet = {
  id: string;
  level: number;           // レベル (0〜∞)
  emotion: number;         // 感情値
  trust: number;           // 信頼度 (0〜100)
  exhaustion: number;      // 疲労度 (0〜100)
  expression: 'happy' | 'sad' | 'angry' | 'neutral';
  updatedAt: string;
};
```

### PetComment（ペットの台詞）
```typescript
type PetComment = {
  id: string;
  petId: string;           // FK → pet.id
  message: string;         // Gemini生成の台詞
  expression: 'happy' | 'sad' | 'angry' | 'neutral';
  createdAt: string;
};

// INSERT時用（id・createdAtはDB自動生成のため省略）
type NewPetComment = Omit<PetComment, 'id' | 'createdAt'>;
```

### PetForm（ペット形態）
```typescript
type PetForm = 'lumi' | 'owl';

function getPetForm(level: number): PetForm  // level >= 15 → 'owl', else 'lumi'
```

### PetGrowthStatus（成長ステータス）
```typescript
// app/lib/petCalculations.ts
type PetGrowthStatus = {
  dailyTrust: number;
  dailyExhaustion: number;
  dailyEmotion: number;
  newTotalTrust: number;
  newTotalExhaustion: number;
  newTotalEmotion: number;
  willLevelUp: boolean;
  willLevelDown: boolean;
};
```

### Supabaseテーブル
- `habits` — 習慣データ
- `pet` — ペット状態（MVP: 1レコード）
- `pet_comment` — ペットコメント履歴
- `lumi_consultation_history` — AI分析履歴

---

## 5. コアビジネスロジック

### 5.1 タイムブロック制 (`app/lib/petCalculations.ts`)

1日を4つのタイムブロックに分割し、各ブロックごとに達成数に応じたポイントを計算する。

| ブロック | 判定時間帯（ロジック） | UIラベル（推奨時間帯） | 最大タスク数 |
|---------|---------------------|---------------------|------------|
| Morning | 5:00〜11:00 | 6:00〜9:00 | 3 |
| Daytime | 11:00〜18:00 | 11:00〜18:00 | 5 |
| Night | 18:00〜24:00 | 18:00〜24:00 | 5 |
| Midnight | 0:00〜5:00 | 0:00〜5:00 | 2 |

> **注**: 判定時間帯は`getTimeBlockByHour(hour)`でタスクのブロック分類・ブロック終了判定に使用。UIラベルは推奨利用時間帯の表示用であり、論理判定には影響しない。

**信頼度ポイント (tp)** — 達成数に応じた報酬/ペナルティ（`calculateBlockPoints()`の詳細テーブル）:

| ブロック (max) | 0〜1個 | 2個 | 3個 | 4個 | 5個以上 |
|--------------|--------|-----|-----|-----|---------|
| Daytime/Night (max=5) | -1 | +1 | +1 | +2 | +3 |
| Morning (max=3) | -2 | +1 | +2 | — | — |
| Midnight (max=2) | -1 | +2 | — | — | — |

**疲労度ポイント (ep)** — 密度とタスク超過によるペナルティ:
- 上限超過（`completedCount > max`）: `ep = max`（そのブロックの最大値を疲労として加算）
- 上限以下の段階的ep:
  - max=5（Daytime/Night）: 3個以上 → ep=1、未満 → ep=0
  - max=3（Morning）: 2個以上 → ep=1、未満 → ep=0
  - max=2（Midnight）: 2個以上 → ep=1、未満 → ep=0

**適用タイミング**:
- tp/ep はそのブロックの時間帯が**過ぎた後**に反映される
- ただし疲労度はタスク超過時に即時反映

### 5.2 表情の決定 (`calculateExpression`)

```
happy   → trust ≥ 65 AND exhaustion ≤ 30
sad     → trust ≤ 50 AND exhaustion ≤ 50
angry   → trust ≤ 30 AND exhaustion ≤ 65
neutral → 上記いずれにも該当しない場合
```

### 5.3 レベルシステム

- **レベルアップ**: trust ≥ 100 → level+1, trust=50, exhaustion=0, emotion=0
- **レベルダウン**: exhaustion ≥ 100 → level-1 (最低0), trust=0, exhaustion=50, emotion=0
- **形態変化**: level ≥ 15 → Lumi形態からOwl（フクロウ）形態へ

### 5.4 習慣完了フロー (`completedHabitAtom`)

1. 対象の習慣を取得し、タイムブロックを確認
2. 同タイムブロック内の本日完了数を算出（トグル前後）
3. `calculateBlockPoints()`でtp/epの差分を計算
4. 差分が0でなければ`updatePetStatsAtom`でペット更新
5. 習慣の`isCompleted`をトグル、`streakDays`を増減

**streakDaysの増減ルール（現実装の仕様）:**
- **完了にする場合（isCompleted: false → true）**:
  - 前回完了日が「当日または前日」（diffDays=0 or 1）: `streakDays + 1`
  - それ以外（2日以上空いた）: `streakDays = 1`（リセット）
  - ※ 同日に再度完了した場合（diffDays=0）も streak+1 となる（現仕様）
- **未完了に戻す場合（isCompleted: true → false）**:
  - 前回完了日が当日の場合: `streakDays - 1`（最低0）
  - 前回完了日が別日の場合: streakDaysは変化なし

### 5.5 日次ステータス算出 (`dailyPetStatsAtom`)

- 全ブロックのtp/epを集計（ブロック終了後のみ加算）
- 日次emotion = 日次trust合計 − 日次exhaustion合計
- ペットの累積ステータスに日次値を加算

---

## 6. データフロー

```
ユーザーが習慣を完了
  ↓
HabitItem → completedHabitAtom
  ↓
petCalculations.calculateBlockPoints() で tp/ep 差分計算
  ↓
updatePetStatsAtom → PUT /api/pet → Supabase更新
  ↓
refreshPetAtom → petAtom再取得 → UIリレンダー
  ↓
PetView: 表情変更・アニメーション発火
```

---

## 7. APIエンドポイント

### 習慣 API

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/habit` | 全習慣取得 → `{ habits: Habit[] }` |
| POST | `/api/habit` | 習慣作成 → `{ message, data }` |
| GET | `/api/habit/[id]` | 単一習慣取得（デバッグ用、console.log出力あり） |
| PUT | `/api/habit/[id]` | 習慣更新（完了トグル・ストリーク等） |
| DELETE | `/api/habit/[id]` | 習慣削除 |

### ペット API

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/pet` | ペット取得 → `{ pet: Pet }` |
| PUT | `/api/pet` | ペット更新（trust, exhaustion, expression等） |

### AI API

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/comment` | ペットの台詞をGeminiで生成 |
| GET | `/api/comment?petId=xxx` | 最新コメント取得 |
| POST | `/api/ai_chat?mode=analyze` | 習慣パターン分析（タイムブロック分布、提案生成） |
| POST | `/api/ai_chat?mode=chat` | 分析に基づく対話 |
| GET | `/api/ai_chat?petId=xxx` | 最新分析結果取得 |
| POST | `/api/suggestion` | 習慣提案生成 |

---

## 8. UI構成

### ダッシュボード (`/dashboard`)
- **2カラムレスポンシブレイアウト**
  - 左カラム (450px, lg以上で表示): PetView + LumiConsultation
  - メインカラム: HabitCardList（タイムブロック別にグループ化）
- Suspenseでローディング状態を管理

### ペット表示 (PetView)
- SVGアバター（Lumi or Owl、4表情対応）
- ステータスバー（trust, exhaustion, emotion）
- ペットの台詞表示（**現在無効化中**、将来再有効化予定）
- タスク完了時のジャンプアニメーション
- レベル15到達時の進化エフェクト

### 習慣カード (HabitItem)
- 完了チェックボックス（`Circle`アイコン、完了時は内部に青い丸インジケータを表示）
- ストリークカウンター（🔥表示）
- 経過日数/目標日数バッジ
- 編集・削除ボタン

### アニメーション (Motion)
- ペットの浮遊アニメーション（常時、4秒周期）
- 完了時のジャンプ（3秒）
- 進化エフェクト（フラッシュ＋パーティクル、5秒）
- 表情切り替え（0.3秒）
- 感情バーのトランジション（1秒）

---

## 9. 状態管理 (Jotai)

### データ取得アトム
- `habitsAtom` — 全習慣を非同期取得
- `petAtom` — ペットデータを非同期取得
- `dailyPetStatsAtom` — 日次ステータスを派生算出

### アクションアトム
- `addHabitAtom` — POST /api/habit（`habitAtom.ts`）
- `deleteHabitAtom` — DELETE /api/habit/[id]（`habitAtom.ts`）
- `updateHabitAtom` — PUT /api/habit/[id]（`habitAtom.ts`）
- `completedHabitAtom` — 完了トグル + ペットステータス計算（`habitAtom.ts`）
- `updatePetStatsAtom` — PUT /api/pet（**`emotionAtom.ts`**に配置）

### リフレッシュ機構
- `refreshHabitsAtom` / `refreshPetAtom` — カウンターインクリメントで再取得をトリガー（公開API）
- 内部カウンタ `habitsRefreshAtom` / `petRefreshAtom` はprivate（各ファイル内部でのみ参照）

---

## 10. デザインシステム

### カラーパレット（ダークテーマ）
- 背景: `#1a1b26`（ダークネイビー）
- サーフェス: `#24283b`
- ボーダー: `#414868`
- プライマリ: `#7aa2f7`（ブルー）
- セカンダリ: `#7dcfff`（シアン）
- パープル: `#bb9af7`（フクロウ形態用）
- テキスト: white / `#a9b1d6` / `#9aa5ce`

---

## 11. 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
GEMINI_API_KEY=[server-side-only]
```

---

## 12. 認証

現在は**認証なし**（MVP段階）。Supabase anon keyによる公開アクセス。将来的にSupabase Authで多ユーザー対応予定。

---

## 13. 開発コマンド

```bash
npm run dev      # 開発サーバー (localhost:3000)
npm run build    # プロダクションビルド
npm run lint     # ESLint
```

---

## 14. 注意事項・既知の制約

- ペットコメント生成機能（台詞表示）は`PetView.tsx`内で現在無効化中（将来再有効化予定。セクション8参照）
- `TestTimeForm`コンポーネントはデバッグ用の時刻操作ツール
- `testTimeAtom`が設定されている場合、ブロック計算がテスト時刻を使用する
- 単一ユーザー前提（petテーブルは1レコード）
