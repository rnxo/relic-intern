"use client";

import { useHabits } from "@/app/features/habit/habit.state";
import { HabitItem } from "./HabitItem";

export function HabitListView() {
  const { habits } = useHabits();

  return (
    <main>
      <ul className="w-full flex flex-col gap-4 p-4">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
      </ul>
    </main>
  );
}
