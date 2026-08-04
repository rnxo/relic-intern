/* TO: shimaao HabitRepositoryのメソッドトリセツです。
    getAll() -> 全habitデータを取得
    getById() -> 一致するidのhabitデータを取得
    create() -> habitデータの新規作成
    update() -> habitデータの更新
    delete() -> habitデータの削除
*/

import { getHeaviness } from "@/app/utils/getHeaviness";
import { habitRepository } from "./habit.repository";
import type { Habit, NewHabitInput, UpdateHabitInput } from "./habit.type";
import { profileRepository } from "../profile/profile.repository";
import { getTrust } from "@/app/utils/getTrust";
import { getExhaustion } from "@/app/utils/getExhaustion";
import { petRepository } from "../pet/pet.repository";
import { UpdatePetType } from "../pet/pet.type";

const getStreakDays = (
  isCompleting: boolean,
  streakDays: number,
  completedAt: string,
  todayStr: string,
): number => {
  if (isCompleting) {
    const lastDate = completedAt?.split("T")[0] ?? null;
    if (!lastDate) return 1;
    const diffDays = Math.floor(
      (new Date(todayStr).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diffDays <= 1 ? streakDays + 1 : 1;
  } else {
    if (completedAt?.split("T")[0] === todayStr) {
      return Math.max(0, streakDays - 1);
    }
    return streakDays;
  }
};

//今後バリデーションを追加する
export const habitService = {
  getAll: async () => await habitRepository.getAll(),
  getById: async (id: string) => await habitRepository.getById(id),
  create: async (input: NewHabitInput) => {
    try {          
    const user = await profileRepository.get();
    const heaviness: number = getHeaviness(input, user);
    const heavinessIncludedInput = { ...input, heaviness: heaviness};
    return await habitRepository.create(heavinessIncludedInput)
    } catch(error) {
      throw new Error(`habit.service create: ${error}`);
    }
  },
  update: async (id: string, newHabitInput: Habit) =>
    await habitRepository.update(id, newHabitInput),
  delete: async (id: string) => await habitRepository.delete(id),

  check: async (id: string) => {
    try {
      const targetHabit = await habitRepository.getById(id);
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const isChecking = !targetHabit.is_checked;

      const newStreakDays = getStreakDays(
        isChecking,
        targetHabit.streak_days,
        targetHabit.completed_at,
        todayStr,
      );

      const currentPet = await petRepository.get();
      const updatedPet: UpdatePetType = {
        trust: currentPet.trust + getTrust(targetHabit),
        exhaustion: currentPet.exhaustion + getExhaustion(targetHabit),
      };

      await petRepository.update(updatedPet);

      const completedHabit: UpdateHabitInput = {
        is_checked: isChecking,
        completed_at: isChecking ? now.toISOString() : targetHabit.completed_at,
        streak_days: newStreakDays,
        updated_at: now.toISOString(),
      };

      return await habitRepository.update(id ,completedHabit)
    } catch (error) {
      throw new Error(`habit.service complete: ${error}`)
    }
  },
};
