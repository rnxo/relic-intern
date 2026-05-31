import { HABIT_TYPE_LABELS, HabitTypeKey } from "@/app/features/habit/habit.type";
import { HabitTypeIcon } from "./HabitTypeIcons";
import { SelectCard } from "./SelectCard";

const habitTypes: { key: HabitTypeKey; label: string }[] = (
  Object.entries(HABIT_TYPE_LABELS) as [HabitTypeKey, string][]
).map(([key, label]) => ({ key, label }));

interface HabitTypesCardListProps {
  value: string | undefined;
  onChange: (typeKey: HabitTypeKey) => void;
}

export function HabitTypeCardList({ value, onChange }: HabitTypesCardListProps) {
  return (
    /* モバイル: 3列グリッド、sm以上: habitTypesの数に応じて自動フィット */
    <div
      className="grid grid-cols-3 sm:grid-cols-5 gap-2"
      role="group"
      aria-label="習慣のカテゴリを選択"
    >
      {habitTypes.map((type) => (
        <SelectCard
          key={type.key}
          type="button"
          className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary"
          isSelected={value === type.key}
          onClick={() => onChange(type.key)}
          aria-pressed={value === type.key}
          aria-label={type.label}
        >
          <HabitTypeIcon type={type.key} />
          <span className="text-xs sm:text-sm text-lumi-secondary font-bold leading-tight text-center">
            {type.label}
          </span>
        </SelectCard>
      ))}
    </div>
  );
}
