import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Habit, NewHabitInput } from "./habit.type";
import { updatePetStatsAtom } from "@/app/store/emotionAtom";
import { testTimeAtom } from "@/app/store/testTimeAtom";
import { calculateBlockPoints, TimeBlock, isBlockPassed } from "@/app/lib/petCalculations";

// habit一覧のベースatom（クライアント側で保持）
const res = await fetch('api/habit');
const initHabits: Habit[] = await res.json();
const habitsAtom = atom<Habit[]>(initHabits);

export const useHabits = () => {
    const [habits, setHabits] = useAtom(habitsAtom);
    const testHour = useAtomValue(testTimeAtom);
    const setPetStats = useSetAtom(updatePetStatsAtom);

    const addNewHabit = async (input: NewHabitInput) => {
        const res = await fetch('/api/habit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(input)
        });

        if(!res.ok) {
            console.log(res);
            throw new Error("ERROR: failed to add a new habit");
        }

        const { data } = await res.json();
        setHabits(prev => [...prev, data]);
    };

    const deleteHabit = async (id: string) => {
        const res = await fetch(`/api/habit/${id}`, {
            method: 'DELETE'
        });

        if(!res.ok) throw new Error("ERROR: failed to delete habit data");
        setHabits(prev => prev.filter(habit => habit.id !== id));
    };

    const updateHabit = async (id: string, input: Partial<Habit>) => {
        const res = await fetch(`/api/habit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(input),
        });

        if(!res.ok) throw new Error("ERROR: failed to update habit data");
        const { data } = await res.json();
        setHabits(prev => prev.map(h => h.id === id ? data: h));

    };

    // ペット計算はクライアント側atomへの依存があるためstate層の責任
    // ストリーク計算・DB更新はhabitService（Server Action）の責任
    const completeHabit = async (id: string) => {
        const habit = habits.find((h) => h.id === id);
        if (!habit) return;

        const todayStr = new Date().toISOString().split("T")[0];
        const timeBlock = habit.time_block as TimeBlock;

        if (timeBlock) {
            const currentHour = testHour !== null ? testHour : new Date().getHours();
            const blockHabits = habits.filter((h) => h.time_block === timeBlock);
            const countBefore = blockHabits.filter(
                (h) => h.is_completed && h.completed_at?.split("T")[0] === todayStr
            ).length;
            const isChecking = !habit.is_completed;
            const countAfter = isChecking ? countBefore + 1 : Math.max(0, countBefore - 1);

            const pBefore = calculateBlockPoints(timeBlock, countBefore);
            const pAfter = calculateBlockPoints(timeBlock, countAfter);

            if (isBlockPassed(timeBlock, currentHour)) {
                const trustDelta = pAfter.tp - pBefore.tp;
                const exhaustDelta = pAfter.ep - pBefore.ep;
                if (trustDelta !== 0 || exhaustDelta !== 0) {
                    setPetStats(trustDelta, exhaustDelta);
                }
            } else {
                const max = timeBlock === "morning" ? 3 : timeBlock === "midnight" ? 2 : 5;
                if (countAfter > max || countBefore > max) {
                    const exhaustDelta = pAfter.ep - pBefore.ep;
                    if (exhaustDelta !== 0) {
                        setPetStats(0, exhaustDelta);
                    }
                }
            }
        }

        const res = await fetch(`/api/habit/${id}/complete`, { method: 'PATCH' });
        if (!res.ok) throw new Error("ERROR: failed to complete habit");

        const { data } = await res.json();
        setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
    };

    return { habits, addNewHabit, deleteHabit, updateHabit, completeHabit };
};