import { NewHabitInput } from "@/app/features/habit/habit.type";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeBlockSelectorProps {
  value?: string;
  onChange: (key: keyof NewHabitInput, val: string) => void;
}

export function TimeBlockSelector({ value, onChange }: TimeBlockSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange("time_block", val)}
    >
      <SelectTrigger
        className="min-h-[52px] bg-lumi-base/50 border-lumi-border rounded-2xl text-lumi-fg focus:ring-2 focus:ring-lumi-primary transition-all cursor-pointer"
        aria-label="時間帯を選択"
      >
        <SelectValue placeholder="時間帯を選択" />
      </SelectTrigger>
      <SelectContent className="bg-lumi-surface border-lumi-border text-lumi-fg rounded-2xl">
        <SelectGroup>
          <SelectLabel className="text-lumi-muted/70">タイムブロック</SelectLabel>
          <SelectItem
            value="morning"
            className="focus:bg-lumi-base focus:text-lumi-primary cursor-pointer min-h-[40px]"
          >
            朝方 (6:00 - 10:00)
          </SelectItem>
          <SelectItem
            value="daytime"
            className="focus:bg-lumi-base focus:text-lumi-primary cursor-pointer min-h-[40px]"
          >
            日中 (10:00 - 16:00)
          </SelectItem>
          <SelectItem
            value="evening"
            className="focus:bg-lumi-base focus:text-lumi-primary cursor-pointer min-h-[40px]"
          >
            夕方 (16:00 - 18:00)
          </SelectItem>
          <SelectItem
            value="night"
            className="focus:bg-lumi-base focus:text-lumi-primary cursor-pointer min-h-[40px]"
          >
            夜 (18:00 - 22:00)
          </SelectItem>
          <SelectItem
            value="midnight"
            className="focus:bg-lumi-base focus:text-lumi-primary cursor-pointer min-h-[40px]"
          >
            深夜 (22:00 - 25:00)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
