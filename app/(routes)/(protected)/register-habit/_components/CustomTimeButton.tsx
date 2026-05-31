import { Label } from "@/components/ui/label";
import { SelectCard } from "./SelectCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CustomTimeButtonProps {
  isSelected: boolean;
  onChange: (val: string) => void;
}

export function CustomTimeButton({ isSelected, onChange }: CustomTimeButtonProps) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  return isClicked ? (
    <SelectCard
      type="button"
      className="border-2 hover:border-lumi-primary min-h-[60px] w-full cursor-pointer"
      isSelected={isSelected}
      aria-label="カスタム時間を入力"
    >
      <Input
        className="border border-lumi-secondary rounded-xl text-center text-lumi-fg bg-transparent h-9 px-1 text-sm"
        type="number"
        min="1"
        max="480"
        placeholder="分"
        autoFocus
        aria-label="カスタム時間（分）"
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          setIsClicked(false);
          if (inputValue && Number(inputValue) > 0) onChange(inputValue);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsClicked(false);
            if (inputValue && Number(inputValue) > 0) onChange(inputValue);
          }
        }}
      />
    </SelectCard>
  ) : (
    <SelectCard
      type="button"
      className="border-2 hover:border-lumi-primary min-h-[60px] w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary"
      isSelected={isSelected}
      onClick={() => setIsClicked(true)}
      aria-label="カスタム時間を設定"
      aria-pressed={isSelected}
    >
      <div className="flex flex-col justify-center items-center gap-0.5">
        <Label className="text-xs sm:text-sm font-bold text-lumi-primary pointer-events-none leading-tight">
          {isSelected ? `${inputValue}` : "自由"}
        </Label>
        <span className="text-[10px] text-lumi-primary/50 pointer-events-none">min</span>
      </div>
    </SelectCard>
  );
}
