"use client";

import { Suspense } from "react";
import HabitCardList from "@/app/(routes)/dashboard/_components/HabitCardList";
import PetView from "@/app/(routes)/dashboard/_components/PetView";
import LumiConsultation from "@/app/(routes)/dashboard/_components/LumiConsultation";
import { TestTimeForm } from "@/app/(routes)/dashboard/_components/TestTimeForm";
import { Loader2 } from "lucide-react";

export default function DashBoardPage() {
    return (
        <div className="flex w-full min-h-screen bg-[#1a1b26] pl-20 transition-all duration-300">
            {/* Control Panel / Pet Section (Left) */}
            <aside className="w-[450px] border-r border-[#414868]/30 overflow-y-auto hidden lg:block">
                <Suspense fallback={<LoadingState />}>
                    <div className="flex flex-col h-full bg-[#1a1b26]">
                        <PetView />
                        <div className="px-4 pb-4">
                            <LumiConsultation />
                        </div>
                        <div className="mt-auto p-4 flex justify-center pb-8 border-t border-[#414868]/20 bg-[#16161e]/50">
                            <TestTimeForm />
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
