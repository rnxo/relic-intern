import { Habit } from "../features/habit/habit.type";

export const getTimeBlockScore = (timeBlock: Habit["time_block"]): number => {
  if (!timeBlock) throw new Error("value is empty");

  switch (timeBlock) {
    case "morning":
      return 1;
    case "daytime":
      return 2;
    case "evening":
      return 3;
    case "night":
      return 4;
    case "midnight":
      return 5;
    default:
      return 0;
  }
};
