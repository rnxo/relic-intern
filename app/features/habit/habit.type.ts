export type HabitTypeKey = "exercise" | "study" | "meal" | "sleeping" | "others";
export type TimeBlock = "morning" | "daytime" | "evening" | "night" | "midnight";
export const HABIT_TYPE_LABELS: Record<HabitTypeKey, string> = {
  exercise: "運動",
  study:     "学習",
  meal:      "食事",
  sleeping:  "睡眠",
  others:    "その他",
};

export type Habit = {
    id: string;
    user_id: string;
    title: string;
    time_block: TimeBlock;
    target_days: string;
    streak_days: number;
    is_completed: boolean; //目標日数到達フラグ
    is_checked: boolean; //チェックずみフラグ
    duration?: string;
    type?: string;
    heaviness?: number;
    completed_at: string;
    created_at: string;
    updated_at: string;
}


export type NewHabitInput = Pick<Habit, 'title' | 'time_block' | 'target_days' | 'type' | 'heaviness' | 'duration'>
export type UpdateHabitInput = Partial<Omit<Habit, 'id' | 'user_id' | 'created_at'>>
/*
To: simaao
Pickユティリティ型を使用すると以下の型と同義である
export type NewHabitInput = {
    title: string;
    time_block: string;
    target_days: string;
}
PartialはHabitの全フィールドをオプションにする 全フィールドに？が付与される
OmitはPickの逆の挙動をする
*/

