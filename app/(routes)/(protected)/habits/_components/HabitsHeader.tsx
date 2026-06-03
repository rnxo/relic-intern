"use client";

import { Plus, ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteHabitWarningDialog } from "./DeleteHabitWarningDialog";
import { a } from "motion/react-client";
import { RegisterHabitDialog } from "./RegisterHabitDialog";

export function HabitsHeader() {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const fakeHandleClick = () => {
    alert("delete habit clicked");
  }

  return (
    <div className="w-full h-14 grid grid-cols-3 items-center sticky top-0 bg-lumi-base/60 border-b-2 border-lumi-primary/30">
      <Link href="/dashboard" className="m-4 text-lumi-primary/50 hover:text-lumi-primary transition-colors rounded-full p-1">
        <ArrowLeftToLine />
      </Link>
      <h1 className="text-base font-bold text-lumi-fg text-center">習慣一覧</h1>
      <div className="flex justify-end items-center gap-2">
        <RegisterHabitDialog />
      </div>
    </div>
  );
}


