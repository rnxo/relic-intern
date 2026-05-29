/*
    heavinessの評価軸
    - 所要時間
    - 生活習慣型と設定タイムブロックとの差異
    - 本気度
*/
import { Habit, NewHabitInput } from "../features/habit/habit.type";
import { Profile } from "../features/profile/profile.type";
import { getHabitDurationScore } from "./getHabitDurationScore";
import { getTimeBlockScore } from "./getTimeBlockScore";


// const getHabitDurationScore = (duration: Habit["duration"]): number => {
//   if (!duration) throw new Error("value of duration in empty");

//   const durationNum: number = parseInt(duration);

//   if(durationNum <= 30) {
//     return 1;
//   } else if(durationNum <= 60) {
//     return 2;
//   } else if(durationNum <= 90) {
//     return 3;
//   } else if(durationNum <= 120) {
//     return 4;
//   } else if(durationNum > 120) {
//     return 5;
//   } else {
//     throw new Error("unvalid value");
//   }
// }

const getHabitTypeScore = (type: Habit["type"], typeRanking: Profile["typeRankingScore"]): number => {
  if (!type || !(type in typeRanking)) throw new Error("invalid type value");
  return Number(typeRanking[type as keyof typeof typeRanking]);
};

// const getTimeBlockScore = (timeBlock: Habit["time_block"]): number => {
//   if(!timeBlock) throw new Error("value is empty");

//   switch(timeBlock) {
//     case "morning":
//       return 1;
//     case "daytime":
//       return 2;
//     case "evening":
//       return 3;
//     case "night":
//       return 4;
//     case "midnight":
//       return 5;
//     default:
//       return 0;
//   }
// }


export const getHeaviness = (habit: NewHabitInput, user: Profile): number => {
  //habit_01とuserBaseValueの座標平面上でのきょりを算出
  //きょりをheavinessの中間値を算出
  //中間値を点数振り分けをし、heavinessを算出

  const durationScore: number = getHabitDurationScore(habit.duration);
  const timeBlockScore: number = getTimeBlockScore(habit.time_block);
  const typeScore: number = getHabitTypeScore(habit.type, user.typeRankingScore);

  const userBaseCoord = {xCoord: user.maxFocusTimeScore, yCoord: user.peakTimeBlockScore };
  const habitCoord =  { xCoord: durationScore, yCoord: timeBlockScore };

  const xCoordDistance = Math.abs(userBaseCoord.xCoord - habitCoord.xCoord)
  const yCoordDistance = Math.abs(userBaseCoord.yCoord - habitCoord.yCoord);

  let distance = Math.sqrt(Math.pow(xCoordDistance, 2) + Math.pow(yCoordDistance, 2));

  if(distance > 5) distance = 5;
  if(distance < 0 || 5 < distance) throw new Error("value of distance is out of range");

  const intermediateValue = distance * typeScore;

  if(0 <= intermediateValue && intermediateValue < 5) {
    return 1;
  } else if (5 <= intermediateValue && intermediateValue < 10) {
    return 2;
  } else if (10 <= intermediateValue && intermediateValue < 15) {
    return 3;
  } else if (15 <= intermediateValue && intermediateValue < 20) {
    return 4;
  } else if (20 <= intermediateValue && intermediateValue <= 25) {
    return 5;
  } else {
    throw new Error("value of intermidateValue is out of range");
  }
}
