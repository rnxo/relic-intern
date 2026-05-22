export type Habit = {
    id: string;
    user_id: string;
    title: string;
    time_block: string;
    target_days: string;
    streak_days: number;
    is_completed: boolean;
    type?: string;
    heaviness?: string;
    completed_at: string;
    created_at: string;
    updated_at: string;
}

export type NewHabitInput = Pick<Habit, 'title' | 'time_block' | 'target_days'>
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

