import { useQuery } from "@tanstack/react-query";
import type { DateRange, HabitLog } from "./habitLog.type";

export const habitLogQueryKey = (range: DateRange) =>
  ["habit-logs", range.from, range.to] as const;

export const useHabitLogsQuery = (range: DateRange) => {
  return useQuery({
    queryKey: habitLogQueryKey(range),
    queryFn: async (): Promise<HabitLog[]> => {
      const params = new URLSearchParams({ from: range.from, to: range.to });
      const res = await fetch(`/api/habit-log?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch habit logs");
      return res.json() as Promise<HabitLog[]>;
    },
    staleTime: 0,
  });
};
