import { habitQueryKey } from "@/app/features/habit/habit.state";
import { HabitsHeader } from "./_components/HabitsHeader";
import { HabitListView } from "./_components/HabitListView";

const fakeHabits = [
  { id: "1", title: "habit title 1" },
  { id: "2", title: "habit title 2" },
  { id: "3", title: "habit title 3" },
  { id: "4", title: "habit title 4" },
  { id: "5", title: "habit title 5" },
  { id: "6", title: "habit title 6" },
  { id: "7", title: "habit title 7" },
  { id: "8", title: "habit title 8" },
  { id: "9", title: "habit title 9" },
  { id: "10", title: "habit title 10" },
  { id: "12", title: "habit title 12" },
  { id: "13", title: "habit title 13" },
];

export default function HabitsPage() {
  return (
    <div className="flex flex-col items-center min-h-dvh bg-lumi-base">
      <HabitsHeader />
      <HabitListView />
    </div>
  );
}
