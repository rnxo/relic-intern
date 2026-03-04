import { useHabits } from "@/app/hooks/habitHooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitGroup } from "./HabitGroup";


export default function HabitCardList() {
    const { habits } = useHabits();
    const router = useRouter();

    const morningHabits = habits?.filter(h => h.timeBlock === 'morning') || [];

    const daytimeHabits = habits?.filter(h => h.timeBlock === 'daytime') || [];
    const nightHabits = habits?.filter(h => h.timeBlock === 'night') || [];
    const midnightHabits = habits?.filter(h => h.timeBlock === 'midnight') || [];

    return (
        <div className="flex flex-col flex-1 py-12 px-8 space-y-10 min-h-screen bg-[#1a1b26]">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">今日の習慣一覧</h1>
                    <p className="text-gray-400 font-medium">毎日の成長を記録しよう</p>
                </div>
                <Button
                    onClick={() => router.push("/register-habit")}
                    className="bg-[#7aa2f7] hover:bg-[#7dcfff] text-white font-bold px-6 py-6 rounded-2xl shadow-lg flex items-center gap-2 transition-all"
                >
                    <Plus size={20} />
                    <span>習慣追加</span>
                </Button>
            </div>

            {/* Habit Groups */}
            <div className="space-y-12">
                <HabitGroup title="朝方" habits={morningHabits} />
                <HabitGroup title="日中" habits={daytimeHabits} />
                <HabitGroup title="夜" habits={nightHabits} />
                <HabitGroup title="深夜" habits={midnightHabits} />
            </div>
        </div>
    );
}
