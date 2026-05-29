import { Habit } from "../features/habit/habit.type";

//引数としてheaviness: numberを引き取る
//返り値の型はPromise<GetTrustArg>
export function getTrust(habit: Habit): number {
    if(!habit.heaviness) throw new Error("heaviness is undefined or empty");
    return habit.heaviness;
}