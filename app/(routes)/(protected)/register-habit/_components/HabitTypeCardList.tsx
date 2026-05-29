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
    <div className="flex gap-2">
      {habitTypes.map((type) => (
        <SelectCard
          key={type.key}
          type="button"
          className="w-32 h-24 flex flex-col items-center justify-center"
          isSelected={value === type.key}
          onClick={() => onChange(type.key)}
        >
          <HabitTypeIcon type={type.key} />
          <span className="text-lumi-secondary font-bold">{type.label}</span>
        </SelectCard>
      ))}
    </div>
  );
}
