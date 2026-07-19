"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddNewHabitButton() {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push("/register-habit")}
      className="min-h-11 min-w-11 bg-lumi-primary hover:bg-lumi-primary-hover text-white font-bold px-3 sm:px-5 rounded-xl shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
      aria-label="習慣を追加する"
    >
      <Plus size={18} aria-hidden="true" />
      <span className="hidden sm:inline text-sm">習慣追加</span>
    </Button>
  );
}
