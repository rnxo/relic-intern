import { useAtomValue, useSetAtom } from "jotai";
import {
    habitsAtom,
    refreshHabitsAtom,
    addHabitAtom,
    deleteHabitAtom,
    updateHabitAtom,
    completedHabitAtom
} from "@/app/store/habitAtom";

export function useHabits() {
    // 値の参照
    // 非同期Atomなので、コンポーネント側でSuspenseが必要
    const habits = useAtomValue(habitsAtom);

    // アクションを取得
    const refreshHabits = useSetAtom(refreshHabitsAtom);
    const addNewHabit = useSetAtom(addHabitAtom);
    const deleteHabit = useSetAtom(deleteHabitAtom);
    const updateHabit = useSetAtom(updateHabitAtom);
    const completeHabit = useSetAtom(completedHabitAtom);

    return {
        habits,
        getAllHabits: refreshHabits, // 名前を維持してリフレッシュ機能にマッピング
        addNewHabit,
        deleteHabit,
        updateHabit,
        completeHabit
    };
}
