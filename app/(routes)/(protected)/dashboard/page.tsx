"use client";

import { Suspense } from "react";
import HabitCardList from "./_components/HabitCardList";
import PetView from "./_components/PetView";
import LumiConsultation from "./_components/LumiConsultation";
import { Loader2 } from "lucide-react";

export default function DashBoardPage() {
    return (
        <div className="flex w-full min-h-screen bg-[#1a1b26] transition-all duration-300">
            {/* Control Panel / Pet Section (Left) */}
            <aside className="w-[450px] border-r border-[#414868]/30 overflow-y-auto hidden lg:block">
                <Suspense fallback={<LoadingState />}>
                    <div className="flex flex-col h-full bg-[#1a1b26]">
                        <PetView />
                        <div className="px-4 pb-4">
                            <LumiConsultation />
                        </div>
                    </div>
                </Suspense>
            </aside>

            {/* Main Content Area (Right) */}
            <main className="flex-1 overflow-y-auto">
                <Suspense fallback={<LoadingState />}>
                    <HabitCardList />
                </Suspense>
            </main>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 text-[#7aa2f7] animate-spin" />
        </div>
    );
}
