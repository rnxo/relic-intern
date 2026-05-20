/* TO: shimaao HabitRepositoryのメソッドトリセツです。
    getAll() -> 全habitデータを取得
    getById() -> 一致するidのhabitデータを取得
    create() -> habitデータの新規作成
    update() -> habitデータの更新
    delete() -> habitデータの削除
*/

import { habitRepository } from "./habit.repository";
import type { Habit, NewHabitInput, UpdateHabitInput } from "./habit.type";

export const habitService = {
  getAll: async () => await habitRepository.getAll(),
  getById: async (id: string) => await habitRepository.getById(id),
  create: async (input: NewHabitInput) => await habitRepository.create(input),
  update: async (id: string, newHabitInput: Habit) =>
    await habitRepository.update(id, newHabitInput),
  delete: async (id: string) => await habitRepository.delete(id),

  complete: async (id: string) => {
    try {
          const targetHabit = await habitRepository.getById(id);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const isCompleting = !targetHabit.is_completed;

    let newStreakDays = targetHabit.streak_days;

    if (isCompleting) {
      const lastDate = targetHabit.completed_at?.split("T")[0] ?? null;
      if (!lastDate) {
        newStreakDays = 1;
      } else {
        const diffDays = Math.floor(
          (new Date(todayStr).getTime() - new Date(lastDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        newStreakDays = diffDays <= 1 ? targetHabit.streak_days + 1 : 1;
      }
    } else {
      // 取り消し: 今日完了していた場合のみstreakを戻す
      if (targetHabit.completed_at?.split("T")[0] === todayStr) {
        newStreakDays = Math.max(0, targetHabit.streak_days - 1);
      }
    }

    const completedHabit: UpdateHabitInput = {
      is_completed: isCompleting,
      completed_at: isCompleting ? now.toISOString() : targetHabit.completed_at,
      streak_days: newStreakDays,
      updated_at: now.toISOString(),
    };

    return await habitRepository.update(id ,completedHabit)
    } catch (error) {
      throw new Error(`habit.service complete: ${error}`)
    }
  },
};
