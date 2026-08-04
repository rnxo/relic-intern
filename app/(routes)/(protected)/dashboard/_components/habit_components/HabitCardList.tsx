"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitGroup } from "./HabitGroup";
import { Habit } from "@/app/features/habit/habit.type";

interface HabitCardListProps {
  habits: Habit[] | undefined;
}

export default function HabitCardList({ habits }: HabitCardListProps) {
  const router = useRouter();

  const activeHabits = habits?.filter((h) => !h.is_completed) ?? [];

  const morningHabits = activeHabits.filter((h) => h.time_block === "morning");
  const daytimeHabits = activeHabits.filter((h) => h.time_block === "daytime");
  const eveningHabits = activeHabits.filter((h) => h.time_block === "evening");
  const nightHabits = activeHabits.filter((h) => h.time_block === "night");
  const midnightHabits = activeHabits.filter((h) => h.time_block === "midnight");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-8 max-w-3xl mx-auto w-full">
      <HabitGroup title="朝方" habits={morningHabits} />
      <HabitGroup title="日中" habits={daytimeHabits} />
      <HabitGroup title="夕方" habits={eveningHabits} />
      <HabitGroup title="夜" habits={nightHabits} />
      <HabitGroup title="深夜" habits={midnightHabits} />

      {/* 空状態 */}
      {habits?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-lumi-muted text-base">
            習慣がまだ登録されていません
          </p>
          <Button
            onClick={() => router.push("/register-habit")}
            className="min-h-11 bg-lumi-primary hover:bg-lumi-primary-hover text-white font-bold px-6 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} className="mr-2" aria-hidden="true" />
            最初の習慣を追加する
          </Button>
        </div>
      )}
    </div>
  );
}
