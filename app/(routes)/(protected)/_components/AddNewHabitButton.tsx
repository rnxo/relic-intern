"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddNewHabitButton() {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push("/register-habit")}
      className="size-14 rounded-full bg-lumi-primary hover:bg-lumi-primary-hover text-white shadow-lg shadow-lumi-primary/40 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      aria-label="習慣を追加する"
    >
      <Plus className="size-6" aria-hidden="true" />
    </Button>
  );
}
