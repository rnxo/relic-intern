"use client";

import { SelectCard } from "./SelectCard";
import { Label } from "@/components/ui/label";
import { CustomTimeButton } from "./CustomTimeButton";

const DURATION_PRESETS = ["30", "60", "90", "120"];

interface DurationSelectorFiledProps {
  value: string | undefined;
  onChange: (val: string) => void;
}

export function DurationSelectorFiled({ value, onChange }: DurationSelectorFiledProps) {
  return (
    <div
      className="grid grid-cols-5 gap-2"
      role="group"
      aria-label="所要時間を選択"
    >
      {DURATION_PRESETS.map((opt) => (
        <SelectCard
          key={opt}
          type="button"
          className="border-2 hover:border-lumi-primary min-h-[60px] w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary"
          isSelected={value === opt}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          aria-label={`${opt} 分`}
        >
          <div className="flex flex-col justify-center items-center gap-0.5">
            <Label className="text-base sm:text-xl text-lumi-primary font-bold pointer-events-none">
              {opt}
            </Label>
            <span className="text-xs text-lumi-primary/50 pointer-events-none">min</span>
          </div>
        </SelectCard>
      ))}
      <CustomTimeButton
        isSelected={value !== undefined && !DURATION_PRESETS.includes(value)}
        onChange={onChange}
      />
    </div>
  );
}
