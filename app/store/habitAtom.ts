import { atom } from "jotai";
import { Habit } from "../types/habit";
import { updatePetStatsAtom } from "./emotionAtom";
import { testTimeAtom } from "./testTimeAtom";
import { calculateBlockPoints, TimeBlock, isBlockPassed } from "../lib/petCalculations";

// リフレッシュ用の内部カウンタ
const habitsRefreshAtom = atom(0);

// Promise型を保持する非同期atom
export const habitsAtom = atom<Promise<Habit[]>>(async (get) => {
    // リフレッシュを検知
    get(habitsRefreshAtom);

    // SSRガード
    if (typeof window === "undefined") return [];

    try {
        const response = await fetch("/api/habit");
        if (!response.ok) return [];
        const data = await response.json();
        return data.habits || [];
    } catch (error) {
        console.error("Failed to fetch habits:", error);
        return [];
    }
});

// リフレッシュをトリガーするatom
export const refreshHabitsAtom = atom(
    null,
    (get, set) => set(habitsRefreshAtom, (prev: number) => prev + 1)
);

//habitデータを新規追加
export const addHabitAtom = atom(
    null,
    async (get, set, habitData: Partial<Habit>) => {
        if (!habitData.title?.trim()) return;

        const newHabit: Habit = {
            id: crypto.randomUUID(),
            title: habitData.title.trim(),
            timeBlock: habitData.timeBlock || "morning",
            targetDays: habitData.targetDays || "7",
            streakDays: habitData.streakDays || 0,
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };
        await fetch("/api/habit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHabit),
        });
        // データを再取得（リフレッシュ）
        set(refreshHabitsAtom);
    }
);

//特定のhabitデータを削除
export const deleteHabitAtom = atom(
    null,
    async (get, set, id: string) => {
        await fetch(`/api/habit/${id}`, {
            method: "DELETE",
        });
        set(refreshHabitsAtom);
    }
)

//特定のhabitデータを更新
export const updateHabitAtom = atom(
    null,
    async (get, set, id: string, updates: Partial<Habit>) => {
        await fetch(`/api/habit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        set(refreshHabitsAtom);
    }
)


//habitデータの完了チェックロジック
export const completedHabitAtom = atom(
    null,
    async (get, set, id: string) => {
        const habits = await get(habitsAtom);
        const habit = habits.find((h: Habit) => h.id === id);
        if (!habit) return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // --- 1. ペットへの影響計算 (tp, epの差分) ---
        const timeBlock = habit.timeBlock as TimeBlock;
        if (timeBlock && timeBlock !== ("undefined" as any)) {
            const testHour = get(testTimeAtom);
            const currentHour = testHour !== null ? testHour : new Date().getHours();

            // 時間を過ぎている場合のみ計算をトリガーする
            if (isBlockPassed(timeBlock, currentHour)) {
                const blockHabits = habits.filter(h => h.timeBlock === timeBlock);
                const countBefore = blockHabits.filter(h =>
                    h.isCompleted && h.completedAt && h.completedAt.split('T')[0] === todayStr
                ).length;

                const isChecking = !habit.isCompleted;
                const countAfter = isChecking ? countBefore + 1 : Math.max(0, countBefore - 1);

                const pBefore = calculateBlockPoints(timeBlock, countBefore);
                const pAfter = calculateBlockPoints(timeBlock, countAfter);

                const trustDelta = pAfter.tp - pBefore.tp;
                const exhaustDelta = pAfter.ep - pBefore.ep;

                if (trustDelta !== 0 || exhaustDelta !== 0) {
                    set(updatePetStatsAtom, trustDelta, exhaustDelta);
                }
            } else {
                // 時間を過ぎていない場合でも、上限超過による疲労度(ep)の変化は即座に反映する
                const blockHabits = habits.filter(h => h.timeBlock === timeBlock);
                const countBefore = blockHabits.filter(h =>
                    h.isCompleted && h.completedAt && h.completedAt.split('T')[0] === todayStr
                ).length;

                const isChecking = !habit.isCompleted;
                const countAfter = isChecking ? countBefore + 1 : Math.max(0, countBefore - 1);

                const pBefore = calculateBlockPoints(timeBlock, countBefore);
                const pAfter = calculateBlockPoints(timeBlock, countAfter);

                // epのみを抽出し、上限超過(maxより大きい)の場合の差分を計算
                const max = (timeBlock === 'morning' ? 3 : timeBlock === 'midnight' ? 2 : 5);
                if (countAfter > max || countBefore > max) {
                    const exhaustDelta = pAfter.ep - pBefore.ep;
                    if (exhaustDelta !== 0) {
                        set(updatePetStatsAtom, 0, exhaustDelta);
                    }
                }
            }
        }

        // --- 2. 習慣自体のステータス更新 ---
        const lastCompletedDate = habit.completedAt ? habit.completedAt.split('T')[0] : null;
        let newIsCompleted = !habit.isCompleted;
        let newStreak = habit.streakDays;
        let newCompletedAt = habit.completedAt;

        if (newIsCompleted) {
            newCompletedAt = now.toISOString();
            if (!lastCompletedDate) {
                newStreak = 1;
            } else {
                const lastDate = new Date(lastCompletedDate);
                const todayDate = new Date(todayStr);
                const diffTime = todayDate.getTime() - lastDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0 || diffDays === 1) {
                    newStreak = habit.streakDays + 1;
                } else {
                    newStreak = 1;
                }
            }
        } else {
            if (lastCompletedDate === todayStr) {
                if (newStreak > 0) newStreak -= 1;
            }
        }

        await fetch(`/api/habit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                isCompleted: newIsCompleted,
                completedAt: newCompletedAt,
                streakDays: newStreak
            }),
        });

        set(refreshHabitsAtom);
    }
);
