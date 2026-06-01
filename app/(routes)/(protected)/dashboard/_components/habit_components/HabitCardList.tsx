import { useHabits } from "@/app/features/habit/habit.state";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { HabitGroup } from "./HabitGroup";
import { signout } from "@/app/auth/actions";
import { Suspense } from "react";
import PetView from "../PetView";

export default function HabitCardList() {
    const { habits } = useHabits();
    const router = useRouter();

    const morningHabits  = habits?.filter(h => h.time_block === 'morning')  || [];
    const daytimeHabits  = habits?.filter(h => h.time_block === 'daytime')  || [];
    const eveningHabits  = habits?.filter(h => h.time_block === 'evening')  || [];
    const nightHabits    = habits?.filter(h => h.time_block === 'night')    || [];
    const midnightHabits = habits?.filter(h => h.time_block === 'midnight') || [];

    const handleSignOut = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        await signout();
    };

    return (
        <div className="flex flex-col min-h-screen bg-lumi-base">

            {/* ── モバイル専用: ペットセクション (lg以上では非表示) ── */}
            <section
                className="lg:hidden border-b border-lumi-border/30"
                aria-label="ペットステータス"
            >
                <Suspense fallback={null}>
                    <PetView />
                    {/* <div className="px-4 pb-4">
                        <LumiConsultation />
                    </div> */}
                </Suspense>
            </section>

            {/* ── ヘッダー ── */}
            <header className="sticky top-0 z-30 bg-lumi-base/90 backdrop-blur-xl border-b border-lumi-border/30 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
                    <div className="space-y-0.5 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-lumi-fg tracking-tight truncate">
                            今日の習慣一覧
                        </h1>
                        <p className="text-xs sm:text-sm text-lumi-muted font-medium">
                            毎日の成長を記録しよう
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* 習慣追加ボタン */}
                        <Button
                            onClick={() => router.push("/register-habit")}
                            className="min-h-11 min-w-11 bg-lumi-primary hover:bg-lumi-primary-hover text-white font-bold px-3 sm:px-5 rounded-xl shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                            aria-label="習慣を追加する"
                        >
                            <Plus size={18} aria-hidden="true" />
                            <span className="hidden sm:inline text-sm">習慣追加</span>
                        </Button>

                        {/* サインアウトボタン */}
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="min-h-11 min-w-11 text-lumi-muted hover:text-lumi-fg hover:bg-lumi-surface px-3 rounded-xl transition-all duration-200 cursor-pointer"
                            aria-label="サインアウト"
                        >
                            <LogOut size={18} aria-hidden="true" />
                            <span className="hidden sm:inline text-sm ml-1">サインアウト</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── 習慣リスト ── */}
            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-8 max-w-3xl mx-auto w-full">
                <HabitGroup title="朝方"  habits={morningHabits}  />
                <HabitGroup title="日中"  habits={daytimeHabits}  />
                <HabitGroup title="夕方"  habits={eveningHabits}  />
                <HabitGroup title="夜"    habits={nightHabits}    />
                <HabitGroup title="深夜"  habits={midnightHabits} />

                {/* 空状態 */}
                {habits?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <p className="text-lumi-muted text-base">習慣がまだ登録されていません</p>
                        <Button
                            onClick={() => router.push("/register-habit")}
                            className="min-h-11 bg-lumi-primary hover:bg-lumi-primary-hover text-white font-bold px-6 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            <Plus size={18} className="mr-2" aria-hidden="true" />
                            最初の習慣を追加する
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
