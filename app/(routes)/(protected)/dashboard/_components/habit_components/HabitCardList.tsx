import { useHabits } from "@/app/features/habit/habit.state";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitGroup } from "./HabitGroup";
import { redirect } from 'next/navigation'
import { signout } from "@/app/auth/actions";



export default function HabitCardList() {
    const { habits } = useHabits(); // 読み込みは一回だけにする今後直す by skyremt

    const morningHabits = habits?.filter(h => h.time_block === 'morning') || [];
    const daytimeHabits = habits?.filter(h => h.time_block === 'daytime') || [];
    const eveningHabits = habits?.filter(h => h.time_block === 'evening') || [];
    const nightHabits = habits?.filter(h => h.time_block === 'night') || [];
    const midnightHabits = habits?.filter(h => h.time_block === 'midnight') || [];

    //signout function
    const handleSignOut = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        await signout();
    }

    return (
        <div className="flex flex-col flex-1 py-12 px-8 space-y-10 min-h-screen bg-lumi-base">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">今日の習慣一覧</h1>
                    <p className="text-gray-400 font-medium">毎日の成長を記録しよう</p>
                </div>
                <Button 
                    className="bg-[#7aa2f7] hover:bg-[#7dcfff] text-white font-bold px-6 py-6 rounded-2xl shadow-lg flex items-center gap-2 transition-all"
                    onClick={handleSignOut}
                >
                    <span>サインアウト</span>
                </Button>
                <Button
                    onClick={() => redirect("/register-habit")}
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
                <HabitGroup title="夕方" habits={eveningHabits} />
                <HabitGroup title="夜" habits={nightHabits} />
                <HabitGroup title="深夜" habits={midnightHabits} />
            </div>
        </div>
    );
}
