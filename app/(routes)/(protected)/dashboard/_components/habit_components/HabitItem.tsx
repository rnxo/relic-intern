import type { Habit } from "@/app/features/habit/habit.type";
import { useHabits } from "@/app/features/habit/habit.state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Pencil, Trash2 } from "lucide-react";
// RegisterHabitDialog は無効化中 — /register-habit?habitId= への遷移に移行
// import RegisterHabitDialog from "./RegisterHabitDialog";
import { HabitTypeTag } from "./HabitTypeTag";
import { useRouter } from "next/navigation";

const getDurationColorClass = (duration: string | undefined): string => {
  const d = Number(duration);
  if (!duration || isNaN(d)) return "border border-lumi-primary bg-lumi-primary/15 text-lumi-primary";
  if (d <= 30) return "border border-green-400 bg-green-400/15 text-green-400";
  if (d <= 60) return "border border-yellow-400 bg-yellow-400/15 text-yellow-400";
  if (d <= 90) return "border border-orange-400 bg-orange-400/15 text-orange-400";
  return "border border-red-400 bg-red-400/15 text-red-400";
};

export function HabitItem({ habit }: { habit: Habit }) {
  const { deleteHabit, completeHabit } = useHabits();
  const router = useRouter();

  const createdAtDate = habit.created_at
    ? new Date(habit.created_at)
    : new Date();
  const elapsedDays = Math.floor(
    (new Date().getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className={`group relative w-full transition-all duration-300 ${
        habit.is_completed ? "bg-[#24283b]/20 opacity-80" : "bg-[#24283b]/40"
      } backdrop-blur-sm border border-[#414868] rounded-2xl overflow-hidden hover:border-[#7aa2f7]/50`}
    >
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-5">
          {/* チェックボタン */}
          <button
            onClick={() => completeHabit(habit.id)}
            className="relative hover:scale-110 transition-transform focus:outline-none"
          >
            <Circle
              size={28}
              className={
                habit.is_completed ? "text-[#7aa2f7]" : "text-[#414868]"
              }
            />
            {habit.is_completed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#7aa2f7] rounded-full shadow-[0_0_10px_rgba(122,162,247,0.5)]" />
              </div>
            )}
          </button>

          <div className="space-y-1">
            <span
              className={`text-lg font-bold transition-colors ${
                habit.is_completed
                  ? "text-gray-500 line-through"
                  : "text-white group-hover:text-[#7dcfff]"
              }`}
            >
              {habit.title}
            </span>
            <div className="flex gap-2 items-center">
              {Number(habit.streak_days) > 0 && (
                <span className="flex items-center gap-1 text-2xl font-bold text-orange-400">
                  🔥 {habit.streak_days}日継続
                </span>
              )}
              <HabitTypeTag type={habit.type} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 所要時間 */}
          <div className={`text-xs font-semibold tracking-widest ${getDurationColorClass(habit.duration)} rounded-full px-3 py-1.5`}>
            <span>{habit.duration} min</span>
          </div>
          {/* 経過日数 */}
          <div className="text-xs font-semibold text-white tracking-widest bg-[#7aa2f7] rounded-full p-2">
            <span>{elapsedDays}/{habit.target_days}</span>
          </div>

          <div className="flex gap-2 transition-opacity">
            {/* 編集ボタン — /register-habit?habitId= に遷移して編集 */}
            <Button
              variant="ghost"
              size="sm"
              className="text-[#345cec] hover:text-[#7aa2f7] hover:bg-[#7aa2f7]/10 rounded-xl"
              onClick={() => router.push(`/register-habit?habitId=${habit.id}`)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-red-400/10 rounded-xl"
              onClick={() => deleteHabit(habit.id)}
            >
              <Trash2
                size={16}
                color="red"
                className="text-red-400 hover:text-red-500"
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
