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
  const [inputValue, setInputValue] = useState<string>("CUSTOM");

  return (
    isClicked ? (
      <SelectCard
        type="button"
        className="border-2 hover:border-lumi-primary"
        isSelected={isSelected}
      >
        <Input
          className="border-2 border-lumi-secondary rounded-2xl"
          type="number"
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            setIsClicked(false);
            if (inputValue) onChange(inputValue);
          }}
        />
      </SelectCard>
    ) : (
      <SelectCard
        type="button"
        className="border-2 hover:border-lumi-primary"
        isSelected={isSelected}
        onClick={() => setIsClicked(true)}
      >
        <Label className="flex justify-center text-xl font-bold text-lumi-primary">
          {inputValue}
        </Label>
      </SelectCard>
    )
  );
}
