import { HABIT_TYPE_LABELS, type Habit, type HabitTypeKey } from "@/app/features/habit/habit.type";
import { useMemo, useState } from "react";
import { Dumbbell, BookOpen, UtensilsCrossed, Moon, Sparkles } from "lucide-react";

interface HabitTabProps {
  habits: Habit[];
}

const HABIT_TYPE_ICONS: Record<HabitTypeKey, typeof Dumbbell> = {
  exercise: Dumbbell,
  study: BookOpen,
  meal: UtensilsCrossed,
  sleeping: Moon,
  others: Sparkles,
};

const HABIT_TYPE_COLOR_VARS: Record<HabitTypeKey, string> = {
  exercise: 'var(--lumi-chart-exercise)',
  study: 'var(--lumi-chart-study)',
  meal: 'var(--lumi-chart-food)',
  sleeping: 'var(--lumi-chart-sleep)',
  others: 'var(--lumi-chart-other)',
};

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function getHabitTypeKey(type: string | undefined): HabitTypeKey {
  if (type && type in HABIT_TYPE_LABELS) return type as HabitTypeKey;
  return 'others';
}

export function HabitTab({ habits }: HabitTabProps ) {
  const [activeHabitId, setActiveHabitId] = useState<string>('');

  const activeHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.find((h) => h.id === activeHabitId) ?? habits[0];
  }, [habits, activeHabitId]);

  return (
    <div
      className="mb-4 flex gap-1.5 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none' }}
      role="tablist"
      aria-label="習慣を切り替え"
    >
      {habits.map((habit) => {
        const key = getHabitTypeKey(habit.type);
        const Icon = HABIT_TYPE_ICONS[key];
        const color = HABIT_TYPE_COLOR_VARS[key];
        const isActive = habit.id === activeHabit?.id;
        return (
          <button
            key={habit.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveHabitId(habit.id)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
            style={
              isActive
                ? {
                    borderColor: color,
                    backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
                    color,
                  }
                : {
                    borderColor: 'var(--lumi-border)',
                    color: 'var(--lumi-muted)',
                  }
            }
          >
            <Icon size={13} aria-hidden="true" />
            <span>{habit.title}</span>
          </button>
        );
      })}
    </div>
  );
}
