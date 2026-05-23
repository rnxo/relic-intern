import { NewHabitInput } from "@/app/features/habit/habit.type";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeBlockSelectorProps {
  value?: string;
  onChange: (key: keyof NewHabitInput, val: string) => void;
}

export function TimeBlockSelector({ value, onChange}: TimeBlockSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange("time_block", val)}
    >
      <SelectTrigger className="h-14 bg-[#1a1b26]/50 border-[#414868] rounded-2xl text-white focus:ring-2 focus:ring-[#7aa2f7] transition-all">
        <SelectValue placeholder="時間帯を選択" />
      </SelectTrigger>
      <SelectContent className="bg-[#1a1b26] border-[#414868] text-white rounded-2xl">
        <SelectGroup>
          <SelectLabel className="text-gray-500">タイムブロック</SelectLabel>
          <SelectItem
            value="morning"
            className="focus:bg-[#24283b] focus:text-[#7aa2f7]"
          >
            朝方 (6:00 - 10:00)
          </SelectItem>
          <SelectItem
            value="daytime"
            className="focus:bg-[#24283b] focus:text-[#7aa2f7]"
          >
            日中 (10:00 - 16:00)
          </SelectItem>
          <SelectItem
            value="evening"
            className="focus:bg-[#24283b] focus:text-[#7aa2f7]"
          >
            夕方 (16:00 - 18:00)
          </SelectItem>
          <SelectItem
            value="night"
            className="focus:bg-[#24283b] focus:text-[#7aa2f7]"
          >
            夜 (18:00 - 22:00)
          </SelectItem>
          <SelectItem
            value="midnight"
            className="focus:bg-[#24283b] focus:text-[#7aa2f7]"
          >
            深夜 (22:00 - 25:00)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
