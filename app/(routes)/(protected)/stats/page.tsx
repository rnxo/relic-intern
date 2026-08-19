"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Feather,
  Flame,
  Moon,
  MoonStar,
  Sparkles,
  Target,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { useHabitsQuery } from "@/app/features/habit/habit.state";
import { HABIT_TYPE_LABELS, type Habit, type HabitTypeKey } from "@/app/features/habit/habit.type";
import { generateDummyMonthlyHeatmap } from "./_lib/dummyMonthlyHeatmap";

const HABIT_TYPE_ICONS: Record<HabitTypeKey, typeof Dumbbell> = {
  exercise: Dumbbell,
  study: BookOpen,
  meal: UtensilsCrossed,
  sleeping: Moon,
  others: Sparkles,
};

const HABIT_TYPE_COLOR_VARS: Record<HabitTypeKey, string> = {
  exercise: "var(--lumi-chart-exercise)",
  study: "var(--lumi-chart-study)",
  meal: "var(--lumi-chart-food)",
  sleeping: "var(--lumi-chart-sleep)",
  others: "var(--lumi-chart-other)",
};

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function getHabitTypeKey(type: string | undefined): HabitTypeKey {
  if (type && type in HABIT_TYPE_LABELS) return type as HabitTypeKey;
  return "others";
}

function buildLumiComment(habit: Habit, currentStreak: number): string {
  if (currentStreak >= 14) {
    return `${habit.title}、${currentStreak}日連続だね。もうすっかり習慣になってきたよ。`;
  }
  if (currentStreak >= 7) {
    return `${habit.title}、${currentStreak}日連続だね。この調子で一緒に頑張ろう。`;
  }
  if (currentStreak >= 1) {
    return `${habit.title}を${currentStreak}日続けられてるね。少しずつ積み重ねていこう。`;
  }
  return `${habit.title}、今日からまた一緒に始めよう。`;
}

export default function StatsPage() {
  const router = useRouter();
  const { data: habits = [], isPending } = useHabitsQuery();
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  const activeHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.find((h) => h.id === activeHabitId) ?? habits[0];
  }, [habits, activeHabitId]);

  const heatmap = useMemo(() => {
    if (!activeHabit) return null;
    return generateDummyMonthlyHeatmap(activeHabit);
  }, [activeHabit]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-lumi-base px-6">
        <MoonStar className="animate-pulse text-lumi-secondary" size={28} aria-hidden="true" />
        <p className="text-sm text-lumi-muted">読み込み中...</p>
      </div>
    );
  }

  if (!activeHabit || !heatmap) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-lumi-base px-6 text-center">
        <MoonStar className="text-lumi-secondary" size={32} aria-hidden="true" />
        <p className="text-lumi-muted">まだ習慣が登録されていません。</p>
      </div>
    );
  }

  const typeKey = getHabitTypeKey(activeHabit.type);
  const accentColor = HABIT_TYPE_COLOR_VARS[typeKey];
  const monthLabel = `${heatmap.year}年${heatmap.month + 1}月`;

  return (
    <div className="min-h-screen bg-lumi-base pb-10 text-lumi-fg">
      <div className="mx-auto max-w-md px-4 pt-6 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-lumi-fg transition-colors hover:bg-lumi-surface"
            aria-label="前のページに戻る"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 className="text-base font-medium text-lumi-fg">統計</h1>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-lumi-surface"
            aria-hidden="true"
          >
            <MoonStar size={16} className="text-lumi-secondary" />
          </div>
        </div>

        {/* Lumiコメント */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-lumi-surface px-3.5 py-2.5">
          <Feather size={18} className="shrink-0 text-lumi-secondary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-lumi-muted">
            {buildLumiComment(activeHabit, heatmap.currentStreak)}
          </p>
        </div>

        {/* habitタブ */}
        <div
          className="mb-4 flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
          role="tablist"
          aria-label="習慣を切り替え"
        >
          {habits.map((habit) => {
            const key = getHabitTypeKey(habit.type);
            const Icon = HABIT_TYPE_ICONS[key];
            const color = HABIT_TYPE_COLOR_VARS[key];
            const isActive = habit.id === activeHabit.id;
            return (
              <button
                key={habit.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveHabitId(habit.id)}
                className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                style={
                  isActive
                    ? {
                        borderColor: color,
                        backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
                        color,
                      }
                    : {
                        borderColor: "var(--lumi-border)",
                        color: "var(--lumi-muted)",
                      }
                }
              >
                <Icon size={13} aria-hidden="true" />
                <span>{habit.title}</span>
              </button>
            );
          })}
        </div>

        {/* 月ナビ(表示のみ・他月には未対応) */}
        <div className="mb-2 flex items-center justify-between px-1">
          <ChevronLeft size={16} className="text-lumi-muted/40" aria-hidden="true" />
          <span className="text-xs text-lumi-muted">{monthLabel}</span>
          <ChevronRight size={16} className="text-lumi-muted/40" aria-hidden="true" />
        </div>

        {/* カレンダーヒートマップ */}
        <div className="mb-3 rounded-xl bg-lumi-surface/60 p-3">
          <div className="flex gap-2">
            <div
              className="grid flex-shrink-0 gap-[3px]"
              style={{ gridTemplateRows: "repeat(7, 14px)" }}
            >
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="flex h-[14px] w-[14px] items-center justify-center text-[9px] text-lumi-muted/70"
                >
                  {i % 2 === 1 ? label : ""}
                </div>
              ))}
            </div>
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateRows: "repeat(7, 14px)",
                gridAutoFlow: "column",
                gridAutoColumns: "14px",
              }}
            >
              {heatmap.cells.map((cell) => (
                <div
                  key={cell.day}
                  title={`${heatmap.month + 1}月${cell.day}日${
                    cell.isInRange ? (cell.isChecked ? "：達成" : "：未達成") : ""
                  }`}
                  className={`h-[14px] w-[14px] rounded-[3px] ${
                    cell.day === heatmap.todayDate
                      ? "outline outline-1 outline-offset-1 outline-lumi-fg"
                      : ""
                  }`}
                  style={{
                    gridRow: cell.weekday + 1,
                    gridColumn: cell.col + 1,
                    background: !cell.isInRange
                      ? "transparent"
                      : cell.isChecked
                        ? accentColor
                        : "var(--lumi-chart-inactive)",
                    border: !cell.isInRange
                      ? "1px dashed var(--lumi-border)"
                      : cell.isChecked
                        ? "none"
                        : "1px solid var(--lumi-border)",
                    opacity: !cell.isInRange ? 0.35 : cell.isChecked ? 1 : 0.45,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 pl-[22px]">
            <span
              className="inline-block h-[11px] w-[11px] rounded-[3px]"
              style={{ background: "var(--lumi-chart-inactive)", opacity: 0.45, border: "1px solid var(--lumi-border)" }}
            />
            <span className="text-[10.5px] text-lumi-muted">未達成</span>
            <span
              className="ml-2 inline-block h-[11px] w-[11px] rounded-[3px]"
              style={{ background: accentColor }}
            />
            <span className="text-[10.5px] text-lumi-muted">達成</span>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-lumi-surface px-2 py-2.5 text-center">
            <Flame size={16} className="mx-auto text-amber-400" aria-hidden="true" />
            <div className="mt-0.5 text-lg font-medium text-lumi-fg tabular-nums">
              {heatmap.currentStreak}日
            </div>
            <div className="text-[10.5px] text-lumi-muted">現在の連続</div>
          </div>
          <div className="rounded-lg bg-lumi-surface px-2 py-2.5 text-center">
            <Trophy size={16} className="mx-auto text-lumi-secondary" aria-hidden="true" />
            <div className="mt-0.5 text-lg font-medium text-lumi-fg tabular-nums">
              {heatmap.bestStreak}日
            </div>
            <div className="text-[10.5px] text-lumi-muted">最長連続</div>
          </div>
          <div className="rounded-lg bg-lumi-surface px-2 py-2.5 text-center">
            <Target size={16} className="mx-auto text-green-400" aria-hidden="true" />
            <div className="mt-0.5 text-lg font-medium text-lumi-fg tabular-nums">
              {heatmap.achievementRate}%
            </div>
            <div className="text-[10.5px] text-lumi-muted">達成率</div>
          </div>
        </div>
      </div>
    </div>
  );
}
