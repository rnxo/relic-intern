import type { Habit } from "@/app/features/habit/habit.type";

/*
 habitsテーブルには「直近1回分のchecked_at」「streak_days」「elapsed_days」しかなく、
 「その月の何日にチェックしたか」という日次履歴を保持するテーブルが存在しない。
 そのため、このファイルはヒートマップの見た目のみを再現するダミーデータを生成する
 （ユーザー承認済み。実データ接続は今後のリファクタで対応予定）。
 直近の連続日数部分だけは habit.streak_days / is_checked という実データを反映し、
 それより過去の分布は habit.id をシードにした決定的な擬似乱数で埋めるため、
 再読み込みしてもチカチカ変わらず同じ結果になる。
*/

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

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDummyMonthlyHeatmap(
  habit: Habit,
  today: Date = new Date(),
): MonthlyHeatmapData {
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayDate = today.getDate();

  const elapsedDays = Math.max(0, Number(habit.elapsed_days) || 0);
  const windowLen = Math.max(1, Math.min(elapsedDays || 1, todayDate));
  const rangeStart = todayDate - windowLen + 1;

  const streakLen = Math.max(0, Math.min(Number(habit.streak_days) || 0, windowLen));
  const streakEnd = habit.is_checked ? todayDate : todayDate - 1;
  const streakStart = streakLen > 0 ? streakEnd - streakLen + 1 : streakEnd + 1;

  const random = mulberry32(hashSeed(habit.id));
  const checkedDays = new Set<number>();

  for (let day = rangeStart; day <= todayDate; day++) {
    if (streakLen > 0 && day >= streakStart && day <= streakEnd) {
      checkedDays.add(day);
      continue;
    }
    if (random() < 0.62) checkedDays.add(day);
  }

  const cells: DailyHeatmapCell[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = (firstWeekday + (day - 1)) % 7;
    const col = Math.floor((firstWeekday + (day - 1)) / 7);
    const isInRange = day >= rangeStart && day <= todayDate;
    cells.push({ day, weekday, col, isChecked: isInRange && checkedDays.has(day), isInRange });
  }

  let currentStreak = 0;
  for (let day = todayDate; day >= rangeStart; day--) {
    if (checkedDays.has(day)) currentStreak++;
    else break;
  }

  let bestStreak = 0;
  let run = 0;
  for (let day = rangeStart; day <= todayDate; day++) {
    if (checkedDays.has(day)) {
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }
  }

  const achievementRate = Math.round((checkedDays.size / windowLen) * 100);

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
