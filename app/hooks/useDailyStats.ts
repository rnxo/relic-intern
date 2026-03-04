import { useAtomValue } from "jotai";
import { dailyPetStatsAtom } from "../store/emotionAtom";

export function useDailyStats() {
    const stats = useAtomValue(dailyPetStatsAtom);

    return {
        stats,
    };
}
