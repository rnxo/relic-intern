import { GetTrustArg } from "../features/pet/pet.type";

const heaviness: number = 5;


//引数としてheaviness: numberを引き取る
//返り値の型はPromise<GetTrustArg>
export function getTrust(): number {
    const trust = heaviness;
    return trust;
}