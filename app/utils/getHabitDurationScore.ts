import { Habit } from "../features/habit/habit.type";

export const getHabitDurationScore = (duration: Habit["duration"]): number => {
  if (!duration) throw new Error("value of duration in empty");

  const durationNum: number = parseInt(duration);

  if (durationNum <= 30) {
    return 1;
  } else if (durationNum <= 60) {
    return 2;
  } else if (durationNum <= 90) {
    return 3;
  } else if (durationNum <= 120) {
    return 4;
  } else if (durationNum > 120) {
    return 5;
  } else {
    throw new Error("unvalid value");
  }
};
