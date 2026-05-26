import { HabitTypeIcon } from "./HabitTypeIcons";
import { SelectCard } from "./SelectCard";

const habitTypes = [
  { name: "運動", icon: "", selected: true },
  { name: "学習", icon: "", selected: false },
  { name: "食事", icon: "", selected: false },
  { name: "睡眠", icon: "", selected: false },
  { name: "その他", icon: "", selected: false },
];

interface HabitTypesCardListProps {
  value: string | undefined;
  onChange: (typeName: string) => void;
}


export function HabitTypeCardList({ value, onChange } :HabitTypesCardListProps) {
  return (
    <div className="flex gap-2">
      {habitTypes.map((type) => (
        <SelectCard 
          key={type.name}
          type="button" 
          className="w-32 h-24 flex flex-col items-center justify-center"
          isSelected={value === type.name}
          onClick={() => onChange?.(type.name)}>
          <HabitTypeIcon type={type.name} />
          <span className="text-lumi-secondary font-bold" id={type.name}>
            {type.name}
          </span>
        </SelectCard>
      ))}
    </div>
  );
}
