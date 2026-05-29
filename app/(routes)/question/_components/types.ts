import { TimeBlock } from "@/app/features/habit/habit.type";

export type OnboardingAnswers = {
    avg_task_duration: string;
    peak_performance_time: TimeBlock;
    habit_type_ranking: string[];
    userBaseValue: { x: number; y: number };
    userBaseHabitPriority: {
        exercise: number;
        study: number;
        meal: number;
        sleeping: number;
        others: number;
    };
};

export const DURATION_SCORE: Record<string, number> = {
    under30: 1,
    under60: 2,
    under90: 3,
    under120: 4,
    over120: 5,
};

export const TIME_BLOCK_SCORE: Record<string, number> = {
    morning: 1,
    daytime: 2,
    evening: 3,
    night: 4,
    midnight: 5,
};

export const HABIT_NAME_TO_KEY: Record<string, keyof OnboardingAnswers["userBaseHabitPriority"]> = {
    運動: "exercise",
    学習: "study",
    食事: "meal",
    睡眠: "sleeping",
    その他: "others",
};
