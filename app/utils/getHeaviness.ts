/*
    heavinessの評価軸
    - 所要時間
    - 生活習慣型と設定タイムブロックとの差異
    - 本気度
*/
import { Habit } from "../features/habit/habit.type";
import { Profile } from "../features/profile/profile.type";

type MockHabitType = Habit & {
  durationScore: number;
  typeScore: number;
  timeBlockScore: number;
}

interface IGetHeavinessFnArgs {
  habit: MockHabitType;
  user: Profile;
}


export const getHeaviness = ({ habit, user }: IGetHeavinessFnArgs): number => {
  //habit_01とuserBaseValueの座標平面上でのきょりを算出
  //きょりをheavinessの中間値を算出
  //中間値を点数振り分けをし、heavinessを算出

  const userBaseCoord = {xCoord: user.maxFocusTimeScore, yCoord: user.peakTimeBlockScore };
  const habitCoord =  { xCoord: habit.durationScore, yCoord: habit.timeBlockScore };

  const xCoordDistance = Math.abs(userBaseCoord.xCoord - habitCoord.xCoord)
  const yCoordDistance = Math.abs(userBaseCoord.yCoord - habitCoord.yCoord);

  const distance = Math.sqrt(Math.pow(xCoordDistance, 2) + Math.pow(yCoordDistance, 2));

  if(distance < 0 || 5 < distance) throw new Error("value of distance is out of range");

  const intermediateValue = distance * habit.typeScore;

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
