import type { Habit } from "@/app/features/habit/habit.type";
import type { HabitLog } from "@/app/features/habitLog/habitLog.type";
import {
  toLoggedOnSet,
  calcCurrentStreak,
  calcBestStreak,
  calcAchievementRate,
} from "@/app/features/habitLog/habitLog.logic";
import { getJstDateStr } from "@/app/utils/getJstDateStr";

export type DailyHeatmapCell = {
  day: number;
  weekday: number; // 0=日 ... 6=土
  col: number; // グリッド上の列番号(0始まり)
  isChecked: boolean;
  isInRange: boolean; // false = 未来 or 習慣開始前(表示対象外)
};

export type MonthlyHeatmapData = {
  year: number;
  month: number; // 0始まり
  daysInMonth: number;
  todayDate: number;
  cells: DailyHeatmapCell[];
  currentStreak: number;
  bestStreak: number;
  achievementRate: number; // 0-100
};

export function buildMonthlyHeatmap(
  habit: Habit,
  logs: HabitLog[],
  target: { year: number; month: number },
  today: Date = new Date(),
): MonthlyHeatmapData {
  const { year, month } = target;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayStr = getJstDateStr(today);
  const todayDate = Number(todayStr.split("-")[2]);

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const createdAt = habit.created_at ? new Date(habit.created_at) : today;
  const isFutureMonth =
    year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());
  const isBeforeCreatedMonth =
    year < createdAt.getFullYear() ||
    (year === createdAt.getFullYear() && month < createdAt.getMonth());

  // その月における有効範囲(rangeStart〜rangeEnd)を求める。
  // 範囲がない(未来月・習慣開始前の月)場合は rangeStart > rangeEnd にして下のループを素通りさせる。
  let rangeStart = 1;
  let rangeEnd = daysInMonth;
  if (isFutureMonth || isBeforeCreatedMonth) {
    rangeStart = 1;
    rangeEnd = 0;
  } else {
    if (isCurrentMonth) rangeEnd = todayDate;
    if (year === createdAt.getFullYear() && month === createdAt.getMonth()) {
      rangeStart = createdAt.getDate();
    }
  }

  const loggedOnSet = toLoggedOnSet(logs, habit.id);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStrOf = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

  const cells: DailyHeatmapCell[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = (firstWeekday + (day - 1)) % 7;
    const col = Math.floor((firstWeekday + (day - 1)) / 7);
    const isInRange = day >= rangeStart && day <= rangeEnd;
    const isChecked = isInRange && loggedOnSet.has(dateStrOf(day));
    cells.push({ day, weekday, col, isChecked, isInRange });
  }

  // currentStreak は「今日」からの連続なので、表示中が今月の時だけ意味を持つ
  const currentStreak = isCurrentMonth ? calcCurrentStreak(loggedOnSet, todayStr) : 0;
  const hasRange = rangeEnd >= rangeStart;
  const bestStreak = hasRange
    ? calcBestStreak(loggedOnSet, dateStrOf(rangeStart), dateStrOf(rangeEnd))
    : 0;
  const achievementRate = hasRange
    ? calcAchievementRate(loggedOnSet, dateStrOf(rangeStart), dateStrOf(rangeEnd))
    : 0;

  return {
    year,
    month,
    daysInMonth,
    todayDate,
    cells,
    currentStreak,
    bestStreak,
    achievementRate,
  };
}
