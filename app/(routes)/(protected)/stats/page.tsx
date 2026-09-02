"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
import { useHabitLogsQuery } from "@/app/features/habitLog/habitLog.state";
import { getJstDateStr } from "@/app/utils/getJstDateStr";
import { buildMonthlyHeatmap } from "./_lib/monthlyHeatmap";
import { StatsHeader } from "./_components/StatsHeader";
import { HabitTab } from "./_components/HabitTab";
import { CalendarHeatmap } from "./_components/CalendarHeatmap";

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
  // 表示中の月を「今月からのオフセット」で持つ。0=今月, -1=先月 ... 未来方向には進めない
  const [monthOffset, setMonthOffset] = useState(0);

  const activeHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.find((h) => h.id === activeHabitId) ?? habits[0];
  }, [habits, activeHabitId]);

  const target = useMemo(() => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [monthOffset]);

  const range = useMemo(() => {
    const from = new Date(target.year, target.month, 1);
    from.setDate(from.getDate() - 62); // 月またぎの連続記録を数えるため余分に取得
    const to = new Date(target.year, target.month + 1, 0);
    return { from: getJstDateStr(from), to: getJstDateStr(to) };
  }, [target]);

  const { data: logs = [] } = useHabitLogsQuery(range);

  const heatmap = useMemo(() => {
    if (!activeHabit) return null;
    return buildMonthlyHeatmap(activeHabit, logs, target);
  }, [activeHabit, logs, target]);

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
        <StatsHeader />
        {/* Lumiコメント */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-lumi-surface px-3.5 py-2.5">
          <Feather size={18} className="shrink-0 text-lumi-secondary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-lumi-muted">
            {buildLumiComment(activeHabit, heatmap.currentStreak)}
          </p>
        </div>

        {/* habitタブ */}
        {/* <HabitTab habits={habits}/> */}
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

        {/* 月ナビ(未来月へは進めない) */}
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setMonthOffset((o) => o - 1)}
            aria-label="前の月へ"
            className="cursor-pointer text-lumi-muted transition-colors hover:text-lumi-fg"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <span className="text-xs text-lumi-muted">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonthOffset((o) => Math.min(0, o + 1))}
            disabled={monthOffset >= 0}
            aria-label="次の月へ"
            className="cursor-pointer text-lumi-muted transition-colors hover:text-lumi-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-lumi-muted"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        {/* カレンダーヒートマップ */}
        <CalendarHeatmap cells={heatmap.cells} />
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
