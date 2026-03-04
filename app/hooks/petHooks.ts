import { useAtomValue } from "jotai";
import { petAtom } from "../store/petAtom";

export function usePet() {
    // 非同期Atomなので、コンポーネント側でSuspenseが必要
    const pet = useAtomValue(petAtom);

    return {
        pet,
    };
}
