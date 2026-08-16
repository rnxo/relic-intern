// 
import type { Habit } from "../features/habit/habit.type";

function getLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getElapsedDays(targetHabit: Habit): string {
  const now = new Date();
  const checkedStamp: string = targetHabit.checked_at; //Ex: '2026-08-04T16:06:48.720905+00:00'
  const lastCheckedDate: string = checkedStamp.split('T')[0]; // Ex: '2026-08-04'
  
  return "";
}
