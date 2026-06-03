"use client";

import { Suspense } from "react";
import HabitCardList from "./habit_components/HabitCardList";
import PetView from "./PetView";
import { Loader2 } from "lucide-react";
import { Habit } from "@/app/features/habit/habit.type";
import { Pet } from "@/app/features/pet/pet.type";
import { useHabitsQuery } from "@/app/features/habit/habit.state";
import { usePetQuery } from "@/app/features/pet/pet.state";

interface ClientDashBoardPageProps {
    initHabits: Habit[]; 
    initPet: Pet; 
}

export default function ClientDashBoardPage({ initHabits, initPet }: ClientDashBoardPageProps) {
    const { data: habits } = useHabitsQuery({ initialData: initHabits });
    const { data: pet  } = usePetQuery({ initialData: initPet });
  
    return (
        <div className="flex w-full min-h-screen bg-lumi-base transition-all duration-300">
            {/* ── ペットサイドパネル: デスクトップ(lg以上)のみ表示 ── */}
            <aside
                className="w-70 xl:w-75 border-r border-lumi-border/30 overflow-y-auto hidden lg:flex flex-col"
                aria-label="ペットステータス"
            >
                <Suspense fallback={<LoadingState />}>
                    <div className="flex flex-col min-h-full bg-lumi-base">
                        <PetView pet={pet ?? null}/>
                    </div>
                </Suspense>
            </aside>

            {/* ── メインコンテンツ ── */}
            <main className="flex-1 overflow-y-auto min-w-0">
                <Suspense fallback={<LoadingState />}>
                    <HabitCardList habits={habits} pet={pet ?? null}/>
                </Suspense>
            </main>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center min-h-[60dvh]">
            <Loader2 className="w-8 h-8 text-lumi-primary animate-spin" aria-label="読み込み中" />
        </div>
    );
}
