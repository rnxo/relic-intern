import { useAtomValue } from "jotai";
import { testTimeAtom } from "./testTimeAtom";
import { useHabitsQuery } from "@/app/features/habit/habit.state";
import { usePetQuery } from "@/app/features/pet/pet.state";
import { calculateBlockPoints, TimeBlock, isBlockPassed, calculateExpression } from "../lib/petCalculations";

export const useDailyPetStats = () => {
    const { data: habits = [] } = useHabitsQuery();
    const { data: pet } = usePetQuery();
    const testHour = useAtomValue(testTimeAtom);

    if (!pet) return null;

    const currentHour = testHour !== null ? testHour : new Date().getHours();
    const todayStr = new Date().toISOString().split("T")[0];

    const completedToday = habits.filter(
        (h) => h.is_checked && h.completed_at && h.completed_at.split("T")[0] === todayStr
    );

    const blocks: TimeBlock[] = ["morning", "daytime", "night", "midnight"];

    let dailyTrust = 0;
    let dailyExhaustion = 0;

    blocks.forEach((block) => {
        const count = completedToday.filter((h) => h.time_block === block).length;

        if (isBlockPassed(block, currentHour)) {
            const { tp, ep } = calculateBlockPoints(block, count);
            dailyTrust += tp;
            dailyExhaustion += ep;
        } else {
            const max = block === "morning" ? 3 : block === "midnight" ? 2 : 5;
            if (count > max) {
                const { ep } = calculateBlockPoints(block, count);
                dailyExhaustion += ep;
            }
        }
    });

    return {
        dailyTrust,
        dailyExhaustion,
        dailyEmotion: dailyTrust - dailyExhaustion,
        currentTotalTrust: pet.trust,
        currentTotalExhaustion: pet.exhaustion,
        level: pet.intimate_level,
        currentHour,
    };
};
