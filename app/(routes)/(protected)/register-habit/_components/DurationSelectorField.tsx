"use client";

import { useState } from "react";
import { SelectCard } from "./SelectCard";
import { Label } from "@/components/ui/label";
import { CustomTimeButton } from "./CustomTimeButton";

//public.profileのmax_focus_timeに対応した配列に変更
const DURATION_PRESETS = ["30", "60", "90", "120"];

interface DurationSelectorFiledProps {
  value: string | undefined;
  onChange: (val: string) => void;
}

export function DurationSelectorFiled({ value, onChange }: DurationSelectorFiledProps) {  
  return (
    <div className="flex items-center justify-between">
      {DURATION_PRESETS.map((opt) => (
        <SelectCard 
          key={opt} 
          className="border-2 hover:border-lumi-primary" 
          isSelected={value === opt}
          onClick={() => onChange(opt)}>
          <div className="flex flex-col justify-center items-center">
            <Label className="text-xl text-lumi-primary">
              {opt}
            </Label>
            <span className="text-sm text-lumi-primary/30">min</span>
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

