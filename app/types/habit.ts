export type Habit = {
    id: string;
    user_id: string;
    title: string;
    timeBlock: 'morning' | 'daytime' | 'night' | 'midnight' | 'undefined';
    targetDays: string;
    streakDays: number;
    isCompleted: boolean;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

