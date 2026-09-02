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
  target: { year: number; month: number }, // month は0始まり。表示対象の年月
  today: Date = new Date(),
): MonthlyHeatmapData {
  const { year, month } = target;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayDate = today.getDate();

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
  const windowLen = Math.max(0, rangeEnd - rangeStart + 1);

  // 月ごとに異なるが同じ月なら常に同じ模様になるよう、シードに年月を含める
  const random = mulberry32(hashSeed(`${habit.id}-${year}-${month}`));
  const checkedDays = new Set<number>();

  // 直近の連続日数(habit.streak_days)は「今表示している月」が今月のときだけ反映する
  const streakLen = isCurrentMonth
    ? Math.max(0, Math.min(Number(habit.streak_days) || 0, windowLen))
    : 0;
  const streakEnd = habit.is_checked ? todayDate : todayDate - 1;
  const streakStart = streakLen > 0 ? streakEnd - streakLen + 1 : streakEnd + 1;

  for (let day = rangeStart; day <= rangeEnd; day++) {
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
    const isInRange = day >= rangeStart && day <= rangeEnd;
    cells.push({ day, weekday, col, isChecked: isInRange && checkedDays.has(day), isInRange });
  }

  let currentStreak = 0;
  for (let day = rangeEnd; day >= rangeStart; day--) {
    if (checkedDays.has(day)) currentStreak++;
    else break;
  }

  let bestStreak = 0;
  let run = 0;
  for (let day = rangeStart; day <= rangeEnd; day++) {
    if (checkedDays.has(day)) {
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }
  }

  const achievementRate = windowLen > 0 ? Math.round((checkedDays.size / windowLen) * 100) : 0;

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
