import type { HabitLog } from "./habitLog.type";

export function toLoggedOnSet(logs: HabitLog[], habitId: string): Set<string> {
  const set = new Set<string>();
  for (const log of logs) {
    if (log.habit_id === habitId) set.add(log.logged_on);
  }
  return set;
}

// "YYYY-MM-DD" 文字列同士の日数差分(a - b)。TZに依存しないようUTCで計算する。
export function diffDaysStr(a: string, b: string): number {
  const toUtc = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(a) - toUtc(b)) / 86_400_000);
}

// "YYYY-MM-DD" 文字列に日数を加算する。TZに依存しないようUTCで計算する。
export function addDaysStr(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().split("T")[0];
}

export function calcCurrentStreak(loggedOnSet: Set<string>, baseDateStr: string): number {
  let streak = 0;
  let cursor = baseDateStr;
  while (loggedOnSet.has(cursor)) {
    streak++;
    cursor = addDaysStr(cursor, -1);
  }
  return streak;
}

export function calcBestStreak(
  loggedOnSet: Set<string>,
  rangeStartStr: string,
  rangeEndStr: string,
): number {
  let best = 0;
  let run = 0;
  let cursor = rangeStartStr;
  while (diffDaysStr(cursor, rangeEndStr) <= 0) {
    if (loggedOnSet.has(cursor)) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
    cursor = addDaysStr(cursor, 1);
  }
  return best;
}

export function calcAchievementRate(
  loggedOnSet: Set<string>,
  rangeStartStr: string,
  rangeEndStr: string,
): number {
  const totalDays = diffDaysStr(rangeEndStr, rangeStartStr) + 1;
  if (totalDays <= 0) return 0;

  let checked = 0;
  let cursor = rangeStartStr;
  while (diffDaysStr(cursor, rangeEndStr) <= 0) {
    if (loggedOnSet.has(cursor)) checked++;
    cursor = addDaysStr(cursor, 1);
  }
  return Math.round((checked / totalDays) * 100);
}
