export type Habit = {
    id: string;
    user_id: string;
    title: string;
    time_block: string;
    target_days: string;
    streak_days: number;
    is_completed: boolean;
    completed_at: string;
    created_at: string;
    updated_at: string;
}

export type NewHabitInput = Pick<Habit, 'title' | 'time_block' | 'target_days'>
/*
To: shimaao
Pickユティリティ関数を使用すると以下の型と同義である
export type NewHabitInput = {
    title: string;
    time_block: string;
    target_days: string;
}
*/