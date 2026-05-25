import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Habit, NewHabitInput } from "./habit.type";
import { updatePetStatsAtom } from "@/app/store/emotionAtom";
import { testTimeAtom } from "@/app/store/testTimeAtom";
import { petAtom } from "@/app/features/pet/pet.state";
import {
  calculateBlockPoints,
  TimeBlock,
  isBlockPassed,
} from "@/app/lib/petCalculations";
import { NextResponse } from "next/server";

// habit一覧のベースatom（クライアント側で保持）
const res = await fetch("/api/habit");
const initHabits: Habit[] = res.ok ? await res.json() : [];
const habitsAtom = atom<Habit[]>(initHabits);

export const useHabits = () => {
  const [habits, setHabits] = useAtom(habitsAtom);
  const testHour = useAtomValue(testTimeAtom);
  const setPetStats = useSetAtom(updatePetStatsAtom);
  const setPet = useSetAtom(petAtom);

  const addNewHabit = async (input: NewHabitInput) => {
    const res = await fetch("/api/habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    console.log("addNewHabit: ", JSON.stringify(input, null, 2));

    if (!res.ok) {
      console.log(res);
      throw new Error("ERROR: failed to add a new habit");
    }

    const { data } = await res.json();
    setHabits((prev) => [...prev, data]);
  };

  const deleteHabit = async (id: string) => {
    const res = await fetch(`/api/habit/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("ERROR: failed to delete habit data");
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const updateHabit = async (id: string, input: Partial<Habit>) => {
    const res = await fetch(`/api/habit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error("ERROR: failed to update habit data");
    const { data } = await res.json();
    setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
  };

  // ペット計算はクライアント側atomへの依存があるためstate層の責任
  // ストリーク計算・DB更新はhabitService（Server Action）の責任
  const completeHabit = async (id: string) => {
    //getTrust関数
    //getExhaustion関数
    const targetHabit = habits.find((habit) => habit.id === id);
    if (!targetHabit) return;

    const isCompletedFlag = !targetHabit.is_completed;
    //habit.is_completedをfalseからtrueに変更したhabitを更新関数で更新
    try {
      const res = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: isCompletedFlag }),
      });

      if (!res.ok) throw new Error("ERROR: failed to complete habit");
      const { data } = await res.json();
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? data : habit)),
      );

      // 完了時のみ joy を一時的にセット、3秒後に normal へ戻す
      if (isCompletedFlag) {
        setPet((prev) => prev ? { ...prev, expression: "joy" } : prev);
        setTimeout(() => {
          setPet((prev) => prev ? { ...prev, expression: "normal" } : prev);
        }, 3000);
      }
    } catch (error) {
      return NextResponse.json({ message: error });
    }
  };
  return { habits, addNewHabit, deleteHabit, updateHabit, completeHabit };
};
