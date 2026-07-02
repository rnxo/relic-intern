"use client";

import { Suspense } from "react";
import HabitCardList from "./_components/habit_components/HabitCardList";
import PetView from "./_components/PetView";
import { Loader2 } from "lucide-react";
import { Header } from "./_components/Header";

export default function DashBoardPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-lumi-base transition-all duration-300">
      <Header />
      {/* ── メインコンテンツ ── */}
      <main className="h-dvh flex-1 overflow-y-auto min-w-0">
        <Suspense fallback={<LoadingState />}>
          <HabitCardList />
        </Suspense>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60dvh]">
      <Loader2
        className="w-8 h-8 text-lumi-primary animate-spin"
        aria-label="読み込み中"
      />
    </div>
  );
}
