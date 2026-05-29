import { Habit } from "../features/habit/habit.type";

export function getExhaustion(habit: Habit): number {
  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;
  const targetTimeBlockEnd = getTimeBlockEnd(habit.time_block);
  if(!habit.heaviness) throw new Error("heaviness value is undefined");
  const intermediateValue = habit.heaviness * Math.abs(currentTime - targetTimeBlockEnd);

  if (0 < intermediateValue && intermediateValue < 20) {
    return 1;
  } else if (intermediateValue < 40) {
    return 2;
  } else if (intermediateValue < 60) {
    return 3;
  } else if (intermediateValue < 80) {
    return 4;
  } else {
    return 5;
  }
}

const getTimeBlockEnd = (timeBlock: Habit["time_block"]): number => {
  switch (timeBlock) {
    case "morning": // 6:00 ~ 10:00
      return 10;
    case "daytime": // 10:00 ~ 16:00
      return 16;
    case "evening": // 16:00 ~ 18:00
      return 18;
    case "night": // 18:00 ~ 22:00
      return 22;
    case "midnight": // 22:00 ~ 25:00
      return 25;
    default:
      throw new Error("value is undefined");
  }
};
