import { useDailyPetStats } from "../store/emotionAtom";

export function useDailyStats() {
    const stats = useDailyPetStats();
    return { stats };
}
