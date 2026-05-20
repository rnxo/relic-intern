/*
    heavinessの評価軸
    - 所要時間
    - 生活習慣型と設定タイムブロックとの差異
    - 本気度
*/

import { Habit } from "@/app/features/habit/habit.type";

const mockHabitData: Habit = {
  id: "123",
  user_id: "user_012345",
  title: "朝のジョギング",
  time_block: "morning",
  target_days: "14", // 例: 平日をターゲット
  streak_days: 5,
  is_completed: false,
  completed_at: "", // 未完了なのでundefined
  created_at: "2023-10-01T08:00:00Z",
  updated_at: "2023-10-05T08:00:00Z",
};

type Heaviness = {
  duration: number;
  chronotypeTimeBlockDiff: number;
  seriousness: number;
};

const getHeaviness = (habit: Habit): Heaviness => {

};
