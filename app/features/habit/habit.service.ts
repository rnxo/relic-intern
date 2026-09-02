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
import { getJstDateStr } from "@/app/utils/getJstDateStr";
import { habitLogRepository } from "../habitLog/habitLog.repository";
import { toLoggedOnSet, calcCurrentStreak } from "../habitLog/habitLog.logic";

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
      const todayStr = getJstDateStr();
      const isChecking = !targetHabit.is_checked;

      if (isChecking) {
        await habitLogRepository.add(id, todayStr);
      } else {
        await habitLogRepository.remove(id, todayStr);
      }

      const logs = await habitLogRepository.getByRange({
        from: getJstDateStr(new Date(targetHabit.created_at)),
        to: todayStr,
      });
      const newStreakDays = calcCurrentStreak(toLoggedOnSet(logs, id), todayStr);

      const currentPet = await petRepository.get();
      const updatedPet: UpdatePetType = {
        trust: currentPet.trust + getTrust(targetHabit),
        exhaustion: currentPet.exhaustion + getExhaustion(targetHabit),
      };

      await petRepository.update(updatedPet);

      const now = new Date();
      const checkedHabit: UpdateHabitInput = {
        is_checked: isChecking,
        checked_at: isChecking ? now.toISOString() : targetHabit.checked_at,
        streak_days: newStreakDays,
        updated_at: now.toISOString(),
      };

      return await habitRepository.update(id ,checkedHabit)
    } catch (error) {
      throw new Error(`habit.service complete: ${error}`)
    }
  },
};
