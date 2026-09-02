export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  logged_on: string; // "YYYY-MM-DD" (JST基準)
  checked_at: string;
  created_at: string;
};

export type DateRange = {
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
};
