export type Profile = {
  id: string;
  userName: string;
  maxFocusTime: string;
  maxFocusTimeScore: number;
  peakTimeBlock: string;
  peakTimeBlockScore: number;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileInput = Partial<Omit<Profile, "id" | "createdAt" | "updatedAt">>;