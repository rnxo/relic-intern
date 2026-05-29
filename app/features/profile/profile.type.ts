type HabitTypeRanking = {
  exercise: number;
  study: number;
  meal: number;
  sleeping: number;
  others: number;
}

export type Profile = {
  id: string;
  userName: string;
  maxFocusTime: string;
  maxFocusTimeScore: number;
  peakTimeBlock: string;
  peakTimeBlockScore: number;
  typeRankingScore: HabitTypeRanking;
  createdAt: string;
  updatedAt: string;
}



export type UpdateProfileInput = Partial<Omit<Profile, "id" | "createdAt" | "updatedAt">>;